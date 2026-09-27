import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');
const bannersDir = path.join(distDir, 'assets', 'banners');

if (!fs.existsSync(distDir) || !fs.existsSync(assetsDir)) {
  console.error('dist or dist/assets directory not found. Please run vite build first.');
  process.exit(1);
}

const cssFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.css'));
const jsFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.js') && f.startsWith('index-'));

if (!cssFile || !jsFile) {
  console.error('Missing css or js bundle in dist/assets');
  process.exit(1);
}

let cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
let jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

// Base64 encode the 4 banner images so the standalone HTML file is 100% self-contained
const bannerImages = [
  'banner_sports_vip.jpg',
  'banner_casino_jackpot.jpg',
  'banner_first_deposit.jpg',
  'banner_daily_cashback.jpg'
];

bannerImages.forEach((imgName) => {
  const imgPath = path.join(bannersDir, imgName);
  if (fs.existsSync(imgPath)) {
    const base64 = fs.readFileSync(imgPath).toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    const targetUrl = `/assets/banners/${imgName}`;
    // Replace in jsContent
    jsContent = jsContent.split(targetUrl).join(dataUri);
    console.log(`[Standalone] Embedded ${imgName} as data URI`);
  }
});

// Offline & Standalone Client-side Mock Interceptor for fetch(/api/...)
// Allows the single file to function seamlessly both with Node server AND offline/file://
const offlineInterceptorScript = `
<script>
// Standalone & Offline API fallback interceptor
(function() {
  const originalFetch = window.fetch;
  window.fetch = async function(resource, init) {
    try {
      // First attempt standard fetch (when running with server)
      const res = await originalFetch(resource, init);
      if (res.ok || res.status < 500) {
        return res;
      }
      throw new Error('Server returned ' + res.status);
    } catch (err) {
      const url = typeof resource === 'string' ? resource : resource.url;
      // If it is an API call and network failed or offline/file:// protocol
      if (url && url.includes('/api/')) {
        console.info('[Standalone Mock] Intercepted offline API call:', url);
        const method = (init && init.method) ? init.method.toUpperCase() : 'GET';
        let body = {};
        if (init && init.body) {
          try { body = JSON.parse(init.body); } catch(e) {}
        }

        // 1. /api/auth/me
        if (url.includes('/api/auth/me')) {
          const storedUser = localStorage.getItem('bdlivebet_user') || localStorage.getItem('hibajee_user');
          if (storedUser) {
            try {
              const u = JSON.parse(storedUser);
              return new Response(JSON.stringify({ success: true, user: u }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } catch(e) {}
          }
          return new Response(JSON.stringify({ success: false, error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // 2. /api/auth/login
        if (url.includes('/api/auth/login')) {
          const user = {
            userId: '84739210',
            username: body.phoneNumber || 'shamim98',
            phoneNumber: body.phoneNumber || '+8801700000000',
            fullName: 'শামীম রেজা (VIP)',
            walletBalance: 2450.00,
            vipLevel: 2,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('bdlivebet_token', 'standalone_offline_token_' + Date.now());
          localStorage.setItem('bdlivebet_user', JSON.stringify(user));
          return new Response(JSON.stringify({ success: true, user, token: 'standalone_offline_token' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // 3. /api/auth/register
        if (url.includes('/api/auth/register')) {
          const user = {
            userId: String(Math.floor(10000000 + Math.random() * 90000000)),
            username: body.username || body.phoneNumber || 'User_' + Date.now(),
            phoneNumber: body.phoneNumber || '+8801700000000',
            fullName: body.username || 'নতুন সদস্য',
            walletBalance: 100.00,
            vipLevel: 1,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('bdlivebet_token', 'standalone_offline_token_' + Date.now());
          localStorage.setItem('bdlivebet_user', JSON.stringify(user));
          return new Response(JSON.stringify({ success: true, user, token: 'standalone_offline_token' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // 4. /api/auth/profile/update
        if (url.includes('/api/auth/profile/update')) {
          const storedUser = localStorage.getItem('bdlivebet_user');
          let u = storedUser ? JSON.parse(storedUser) : { userId: '84739210' };
          u.fullName = body.fullName || u.fullName;
          u.username = body.username || u.username;
          u.email = body.email || u.email;
          localStorage.setItem('bdlivebet_user', JSON.stringify(u));
          return new Response(JSON.stringify({ success: true, user: u }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // 5. /api/auth/profile/password
        if (url.includes('/api/auth/profile/password')) {
          return new Response(JSON.stringify({ success: true, message: 'Password updated successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // 6. /api/auth/profile/avatar
        if (url.includes('/api/auth/profile/avatar')) {
          const storedUser = localStorage.getItem('bdlivebet_user');
          let u = storedUser ? JSON.parse(storedUser) : { userId: '84739210' };
          u.avatar = body.avatarUrl || u.avatar;
          localStorage.setItem('bdlivebet_user', JSON.stringify(u));
          return new Response(JSON.stringify({ success: true, avatar: u.avatar }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // Default fallback for any other API
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      throw err;
    }
  };
})();
</script>
`;

let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Remove external link rel="stylesheet"
html = html.replace(/<link rel="stylesheet"[^>]+>/, '');
// Remove external script tag
html = html.replace(/<script type="module"[^>]+><\/script>/, '');

// Safely inject CSS before </head> using function replacement to prevent $ patterns
html = html.replace('</head>', () => `  <style>\n${cssContent}\n  </style>\n</head>`);

// Safely inject offline interceptor and JS before </body> using function replacement
html = html.replace('</body>', () => `${offlineInterceptorScript}\n  <script type="module">\n${jsContent}\n  </script>\n</body>`);

fs.writeFileSync(path.join(distDir, 'standalone.html'), html);

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'standalone.html'), html);

console.log(`[Standalone HTML] Generated successfully at dist/standalone.html & public/standalone.html (${Math.round(html.length / 1024)} KB)`);
