import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  createUser,
  verifyCredentials,
  findUserById,
  findUserByPhone,
  getAllUsers,
  saveAllUsers,
  generateUniqueUserId,
  updateUserProfile,
  updateUserPassword,
  updateUserAvatar
} from './server/db';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'hibajee_super_secret_jwt_key_2026';
const PORT = 3000;

// JWT Token Payload interface
interface JwtPayload {
  userId: string;
  phoneNumber: string;
  username: string;
}

// Helper to sign JWT token (expires in 7 days)
function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Middleware: Authenticate JWT Token
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User session no longer exists' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token' });
  }
}

async function startServer() {
  const app = express();

  // Middleware for parsing JSON request bodies
  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // 1. REGISTRATION ENDPOINT
  // ==========================================
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { phone, password, fullName, username, promoCode } = req.body;

      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'মোবাইল নম্বর প্রদান করা আবশ্যক (Phone number is required)'
        });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)'
        });
      }

      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'সঠিক নাম প্রদান করুন (Full name must be at least 2 characters)'
        });
      }

      // Create new user in persistent database with guaranteed unique 8-digit user ID
      const result = createUser({
        rawPhone: phone,
        plainPassword: password,
        fullName: fullName.trim(),
        username: username || undefined,
        promoCode: promoCode || undefined
      });

      if (!result.success || !result.user) {
        return res.status(400).json({
          success: false,
          error: result.error || 'নিবন্ধন ব্যর্থ হয়েছে (Registration failed)'
        });
      }

      const user = result.user;

      // Generate JWT Token
      const token = signToken({
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        username: user.username
      });

      return res.status(201).json({
        success: true,
        message: 'অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে (Account created successfully)',
        token,
        user: {
          userId: user.userId,
          phoneNumber: user.phoneNumber,
          rawPhone: user.rawPhone,
          fullName: user.fullName,
          username: user.username,
          walletBalance: user.walletBalance,
          vipLevel: user.vipLevel,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        error: 'অভ্যন্তরীণ সার্ভার ত্রুটি (Internal server error)'
      });
    }
  });

  // ==========================================
  // 2. SECURE LOGIN ENDPOINT
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          error: 'মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন (Phone and Password are required)'
        });
      }

      // Verify credentials strictly against the persistent database
      const result = verifyCredentials(phone, password);

      if (!result.success || !result.user) {
        // STRICT AUTHENTICATION BARRIER: Reject attempt with exact required error
        return res.status(401).json({
          success: false,
          error: 'Invalid Phone Number or Password'
        });
      }

      const user = result.user;

      // Generate JWT Session Token
      const token = signToken({
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        username: user.username
      });

      return res.json({
        success: true,
        message: 'লগইন সফল হয়েছে (Login successful)',
        token,
        user: {
          userId: user.userId,
          phoneNumber: user.phoneNumber,
          rawPhone: user.rawPhone,
          fullName: user.fullName,
          username: user.username,
          walletBalance: user.walletBalance,
          vipLevel: user.vipLevel,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: 'অভ্যন্তরীণ সার্ভার ত্রুটি (Internal server error)'
      });
    }
  });

  // ==========================================
  // 3. GOOGLE / GMAIL OAUTH LOGIN ENDPOINT
  // ==========================================
  app.post('/api/auth/google', (req: Request, res: Response) => {
    try {
      const { email, name, avatar } = req.body;

      if (!email || !name) {
        return res.status(400).json({ success: false, error: 'Email and Name are required' });
      }

      const users = getAllUsers();
      let user = users.find((u) => u.email === email);

      if (!user) {
        // Create new Google player with 100% unique 8-digit numeric User ID
        const userId = generateUniqueUserId();
        const now = new Date().toISOString();
        const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

        user = {
          userId,
          phoneNumber: `+8801${userId.slice(-8)}`,
          rawPhone: `01${userId.slice(-8)}`,
          hashedPassword: '', // OAuth users don't use password
          fullName: name,
          username,
          walletBalance: 50.0,
          vipLevel: 2,
          email,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
          createdAt: now,
          updatedAt: now
        };

        users.push(user);
        saveAllUsers(users);
      }

      const token = signToken({
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        username: user.username
      });

      return res.json({
        success: true,
        token,
        user: {
          userId: user.userId,
          phoneNumber: user.phoneNumber,
          rawPhone: user.rawPhone,
          fullName: user.fullName,
          username: user.username,
          walletBalance: user.walletBalance,
          vipLevel: user.vipLevel,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.error('Google auth error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // ==========================================
  // 4. VERIFY SESSION / GET CURRENT USER
  // ==========================================
  app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
    const user = (req as any).user;
    return res.json({
      success: true,
      user: {
        userId: user.userId,
        phoneNumber: user.phoneNumber,
        rawPhone: user.rawPhone,
        fullName: user.fullName,
        username: user.username,
        walletBalance: user.walletBalance,
        vipLevel: user.vipLevel,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  });

  // ==========================================
  // 5. UPDATE PROFILE (NICKNAME & EMAIL)
  // ==========================================
  app.post('/api/auth/profile/update', authenticateToken, (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;
      const { fullName, username, email } = req.body;

      const result = updateUserProfile(authUser.userId, {
        fullName: typeof fullName === 'string' ? fullName : undefined,
        username: typeof username === 'string' ? username : undefined,
        email: typeof email === 'string' ? email : undefined
      });

      if (!result.success || !result.user) {
        return res.status(400).json({ success: false, error: result.error || 'Failed to update profile' });
      }

      const user = result.user;
      return res.json({
        success: true,
        message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে (Profile updated successfully)',
        user: {
          userId: user.userId,
          phoneNumber: user.phoneNumber,
          rawPhone: user.rawPhone,
          fullName: user.fullName,
          username: user.username,
          walletBalance: user.walletBalance,
          vipLevel: user.vipLevel,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // ==========================================
  // 6. CHANGE PASSWORD ENDPOINT
  // ==========================================
  app.post('/api/auth/profile/password', authenticateToken, (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'সবগুলো পাসওয়ার্ড ফিল্ড পূরণ করুন (All password fields are required)'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ মিলছে না (New password and confirm password do not match)'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)'
        });
      }

      const result = updateUserPassword(authUser.userId, currentPassword, newPassword);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে'
        });
      }

      return res.json({
        success: true,
        message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে (Password changed successfully)'
      });
    } catch (error) {
      console.error('Password change error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // ==========================================
  // 7. UPDATE AVATAR ENDPOINT
  // ==========================================
  app.post('/api/auth/profile/avatar', authenticateToken, (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;
      const { avatar } = req.body;

      if (!avatar || typeof avatar !== 'string') {
        return res.status(400).json({ success: false, error: 'Avatar URL is required' });
      }

      const result = updateUserAvatar(authUser.userId, avatar);

      if (!result.success || !result.user) {
        return res.status(400).json({ success: false, error: result.error || 'Failed to update avatar' });
      }

      const user = result.user;
      return res.json({
        success: true,
        message: 'অ্যাভাটার সফলভাবে পরিবর্তন করা হয়েছে (Avatar updated successfully)',
        avatar: user.avatar,
        user: {
          userId: user.userId,
          phoneNumber: user.phoneNumber,
          rawPhone: user.rawPhone,
          fullName: user.fullName,
          username: user.username,
          walletBalance: user.walletBalance,
          vipLevel: user.vipLevel,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Avatar update error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // ==========================================
  // 8. LOGOUT ENDPOINT
  // ==========================================
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // Global error handler for API routes
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Server Error]', err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  });

  // Dedicated routes for standalone single-file HTML & downloads
  app.get(['/standalone', '/standalone.html'], (req: Request, res: Response) => {
    const standalonePath = path.join(process.cwd(), 'dist', 'standalone.html');
    const publicStandalonePath = path.join(process.cwd(), 'public', 'standalone.html');
    const targetFile = fs.existsSync(standalonePath) ? standalonePath : publicStandalonePath;
    if (fs.existsSync(targetFile)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.sendFile(targetFile);
    }
    return res.status(404).send('Standalone file not found. Please trigger build.');
  });

  app.get(['/download-standalone', '/api/download-standalone'], (req: Request, res: Response) => {
    const standalonePath = path.join(process.cwd(), 'dist', 'standalone.html');
    const publicStandalonePath = path.join(process.cwd(), 'public', 'standalone.html');
    const targetFile = fs.existsSync(standalonePath) ? standalonePath : publicStandalonePath;
    if (fs.existsSync(targetFile)) {
      return res.download(targetFile, 'bdlivebet_standalone.html');
    }
    return res.status(404).send('Standalone file not found.');
  });

  // Dedicated routes for WordPress theme zip download
  app.get(['/download-theme', '/api/download-theme', '/bdlivebet-theme.zip'], (req: Request, res: Response) => {
    const themeDistPath = path.join(process.cwd(), 'dist', 'bdlivebet-theme.zip');
    const themePublicPath = path.join(process.cwd(), 'public', 'bdlivebet-theme.zip');
    const themeRootPath = path.join(process.cwd(), 'bdlivebet-theme.zip');
    const targetFile = fs.existsSync(themeDistPath) ? themeDistPath : (fs.existsSync(themePublicPath) ? themePublicPath : themeRootPath);
    if (fs.existsSync(targetFile)) {
      res.setHeader('Content-Type', 'application/zip');
      return res.download(targetFile, 'bdlivebet-theme.zip');
    }
    return res.status(404).send('WordPress theme zip file not found.');
  });

  // ==========================================
  // VITE / STATIC SERVING MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] BDLiveBet.vip Auth & Gaming Server running on http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('[Server] Process terminated gracefully');
    });
  });
}

startServer().catch((err) => {
  console.error('[Server Crash]', err);
});
