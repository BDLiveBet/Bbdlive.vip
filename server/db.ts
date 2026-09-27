import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserRecord {
  userId: string; // 8-digit unique numeric user ID (e.g. "84739210")
  phoneNumber: string; // Normalized E.164 (e.g. "+8801712345678")
  rawPhone: string; // As entered by user (e.g. "01712345678")
  hashedPassword: string;
  fullName: string;
  username: string;
  walletBalance: number;
  vipLevel: number;
  email?: string;
  avatar?: string;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Database directory & file path
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'users.json');

// Ensure directory exists
function ensureDbFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // Seed initial default test player (vvshamim)
    const seedHashedPassword = bcrypt.hashSync('hibajee123', 10);
    const initialUsers: UserRecord[] = [
      {
        userId: '84739210',
        phoneNumber: '+8801712345678',
        rawPhone: '01712345678',
        hashedPassword: seedHashedPassword,
        fullName: 'Shamim Hossain',
        username: 'vvshamim',
        walletBalance: 0.67,
        vipLevel: 2,
        email: 'vvshamim@hibajee.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        createdAt: '2026-07-20T10:00:00.000Z',
        updatedAt: '2026-07-20T10:00:00.000Z'
      }
    ];

    fs.writeFileSync(DB_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
  }
}

// Read all users from persistent database
export function getAllUsers(): UserRecord[] {
  ensureDbFile();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) as UserRecord[];
  } catch (error) {
    console.error('Error reading user database:', error);
    return [];
  }
}

// Safely save users to persistent database
export function saveAllUsers(users: UserRecord[]): void {
  ensureDbFile();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Normalize Bangladeshi phone number for consistent lookups
export function normalizePhone(phone: string): { normalized: string; raw: string } {
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  let normalized = digitsOnly;

  if (digitsOnly.startsWith('+880')) {
    normalized = digitsOnly;
  } else if (digitsOnly.startsWith('880')) {
    normalized = `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('0')) {
    normalized = `+88${digitsOnly}`;
  } else if (digitsOnly.length === 10 && digitsOnly.startsWith('1')) {
    normalized = `+880${digitsOnly}`;
  }

  // Derive simple local phone (e.g. 01712345678)
  const raw = normalized.replace(/^\+88/, '');

  return { normalized, raw };
}

/**
 * 100% Unique 8-Digit Random Numeric User ID Generator
 * Generates an 8-digit number (10000000 - 99999999).
 * Verifies against existing database records.
 * Regenerates automatically upon collision until uniqueness is guaranteed.
 */
export function generateUniqueUserId(): string {
  const users = getAllUsers();
  const existingIds = new Set(users.map((u) => u.userId));

  let candidateId = '';
  let attempts = 0;
  const maxAttempts = 10000;

  do {
    // Generate an 8-digit integer string
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    candidateId = randomNum.toString();
    attempts++;

    if (attempts > maxAttempts) {
      // Fallback timestamp suffix if collision space is saturated
      candidateId = `${Date.now()}`.slice(-8);
    }
  } while (existingIds.has(candidateId));

  return candidateId;
}

// Find user by normalized phone number
export function findUserByPhone(phone: string): UserRecord | null {
  const { normalized, raw } = normalizePhone(phone);
  const users = getAllUsers();

  return (
    users.find((u) => {
      const uNorm = normalizePhone(u.phoneNumber).normalized;
      const uRaw = u.rawPhone || normalizePhone(u.phoneNumber).raw;
      return (
        u.phoneNumber === normalized ||
        uNorm === normalized ||
        u.rawPhone === raw ||
        uRaw === raw ||
        u.phoneNumber === phone ||
        u.rawPhone === phone
      );
    }) || null
  );
}

// Find user by unique numeric user ID
export function findUserById(userId: string): UserRecord | null {
  const users = getAllUsers();
  return users.find((u) => u.userId === userId) || null;
}

// Create and persist a new user record
export function createUser(params: {
  rawPhone: string;
  plainPassword: string;
  fullName: string;
  username?: string;
  promoCode?: string;
}): { success: boolean; user?: UserRecord; error?: string } {
  const { normalized, raw } = normalizePhone(params.rawPhone);

  // Check if phone number is already registered
  const existingUser = findUserByPhone(params.rawPhone);
  if (existingUser) {
    return {
      success: false,
      error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত (Phone number is already registered)'
    };
  }

  // Generate 100% collision-free 8-digit numeric User ID
  const userId = generateUniqueUserId();

  // Hash password using bcrypt (10 rounds)
  const hashedPassword = bcrypt.hashSync(params.plainPassword, 10);

  const now = new Date().toISOString();
  const username =
    params.username?.trim().toLowerCase().replace(/\s+/g, '_') ||
    `player_${userId.slice(-4)}`;

  const newUser: UserRecord = {
    userId,
    phoneNumber: normalized,
    rawPhone: raw,
    hashedPassword,
    fullName: params.fullName.trim(),
    username,
    walletBalance: 50.0, // ৳50 Welcome Sign-up Bonus
    vipLevel: 1,
    promoCode: params.promoCode || undefined,
    createdAt: now,
    updatedAt: now
  };

  const users = getAllUsers();
  users.push(newUser);
  saveAllUsers(users);

  return { success: true, user: newUser };
}

// Verify credentials (Phone & Password)
export function verifyCredentials(
  phone: string,
  plainPassword: string
): { success: boolean; user?: UserRecord; error?: string } {
  const user = findUserByPhone(phone);
  if (!user) {
    return {
      success: false,
      error: 'Invalid Phone Number or Password'
    };
  }

  const isPasswordValid = bcrypt.compareSync(plainPassword, user.hashedPassword);
  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Invalid Phone Number or Password'
    };
  }

  return { success: true, user };
}

// Update User Profile (Nickname/Display Name and Email Address - Phone Number is strictly non-editable)
export function updateUserProfile(
  userId: string,
  updates: { fullName?: string; username?: string; email?: string }
): { success: boolean; user?: UserRecord; error?: string } {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.userId === userId);

  if (index === -1) {
    return { success: false, error: 'User not found in database' };
  }

  const user = users[index];

  if (updates.fullName !== undefined) {
    user.fullName = updates.fullName.trim();
  }
  if (updates.username !== undefined) {
    user.username = updates.username.trim();
  }
  if (updates.email !== undefined) {
    user.email = updates.email.trim();
  }

  user.updatedAt = new Date().toISOString();
  users[index] = user;
  saveAllUsers(users);

  return { success: true, user };
}

// Update User Password (verifies current password against bcrypt hash, saves new bcrypt hash)
export function updateUserPassword(
  userId: string,
  currentPlainPassword: string,
  newPlainPassword: string
): { success: boolean; error?: string } {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.userId === userId);

  if (index === -1) {
    return { success: false, error: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found)' };
  }

  const user = users[index];

  // If user has a hashed password, verify current password
  if (user.hashedPassword) {
    const isCurrentValid = bcrypt.compareSync(currentPlainPassword, user.hashedPassword);
    if (!isCurrentValid) {
      return {
        success: false,
        error: 'বর্তমান পাসওয়ার্ডটি সঠিক নয় (Current password is incorrect)'
      };
    }
  }

  // Hash new password with bcrypt
  user.hashedPassword = bcrypt.hashSync(newPlainPassword, 10);
  user.updatedAt = new Date().toISOString();
  users[index] = user;
  saveAllUsers(users);

  return { success: true };
}

// Update User Avatar preference in database
export function updateUserAvatar(
  userId: string,
  avatarUrl: string
): { success: boolean; user?: UserRecord; error?: string } {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.userId === userId);

  if (index === -1) {
    return { success: false, error: 'User not found' };
  }

  const user = users[index];
  user.avatar = avatarUrl;
  user.updatedAt = new Date().toISOString();
  users[index] = user;
  saveAllUsers(users);

  return { success: true, user };
}
