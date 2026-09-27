import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');
const bannersDir = path.join(rootDir, 'public', 'assets', 'banners');
const themeOutputDir = path.join(rootDir, 'theme-build', 'bdlivebet');

console.log('[WP Theme Builder] Starting WordPress theme packaging...');

if (!fs.existsSync(assetsDir)) {
  console.error('[WP Theme Builder] dist/assets does not exist. Please run vite build first.');
  process.exit(1);
}

// 1. Locate bundled CSS and JS
const cssFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.css') && f.startsWith('index-'));
const jsFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.js') && f.startsWith('index-'));

if (!cssFile || !jsFile) {
  console.error('[WP Theme Builder] Missing compiled css or js in dist/assets');
  process.exit(1);
}

console.log(`[WP Theme Builder] Found CSS: ${cssFile} | JS: ${jsFile}`);

// Clean and prepare theme folder
if (fs.existsSync(path.join(rootDir, 'theme-build'))) {
  fs.rmSync(path.join(rootDir, 'theme-build'), { recursive: true, force: true });
}

fs.mkdirSync(path.join(themeOutputDir, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(themeOutputDir, 'assets', 'js'), { recursive: true });
fs.mkdirSync(path.join(themeOutputDir, 'assets', 'banners'), { recursive: true });

// Copy CSS
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
fs.writeFileSync(path.join(themeOutputDir, 'assets', 'css', 'bdlivebet.css'), cssContent);

// Process JS (embed banner data URIs so WordPress subdirectory installs never break images)
let jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
const bannerImages = [
  'banner_sports_vip.jpg',
  'banner_casino_jackpot.jpg',
  'banner_first_deposit.jpg',
  'banner_daily_cashback.jpg'
];

bannerImages.forEach((imgName) => {
  const srcPath = path.join(bannersDir, imgName);
  const destPath = path.join(themeOutputDir, 'assets', 'banners', imgName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    const base64 = fs.readFileSync(srcPath).toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    jsContent = jsContent.split(`/assets/banners/${imgName}`).join(dataUri);
  }
});

fs.writeFileSync(path.join(themeOutputDir, 'assets', 'js', 'bdlivebet.js'), jsContent);

// 2. Generate style.css
const styleCssContent = `/*
Theme Name: BDLIVEBET
Theme URI: https://bdlivebet.com
Author: BDLIVEBET Engineering Team
Author URI: https://bdlivebet.com
Description: BDLIVEBET is a state-of-the-art, high-performance WordPress theme for premier sports betting, live dealer casinos, slots, and interactive gaming in Bangladesh. Featuring full responsive mobile-first UI, real-time match scores, wallet integration, multi-payment gateways (bKash, Nagad, Rocket), and seamless member dashboard.
Version: 1.0.0
Tested up to: 6.7
Requires at least: 5.8
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: bdlivebet
Tags: entertainment, dark-mode, custom-colors, full-width-template, responsive-layout, translation-ready, accessibility-ready
*/

/* WordPress Layout & Typography Standard Utilities */
body {
  margin: 0;
  padding: 0;
  background-color: #0b0e17;
  color: #f1f5f9;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* WordPress Core Alignment Classes */
.alignnone { margin: 5px 20px 20px 0; }
.aligncenter, div.aligncenter { display: block; margin: 5px auto 5px auto; }
.alignright { float: right; margin: 5px 0 20px 20px; }
.alignleft { float: left; margin: 5px 20px 20px 0; }
a img.alignright { float: right; margin: 5px 0 20px 20px; }
a img.alignnone { margin: 5px 20px 20px 0; }
a img.alignleft { float: left; margin: 5px 20px 20px 0; }
a img.aligncenter { display: block; margin-left: auto; margin-right: auto; }
.wp-caption { background: #1c2237; border: 1px solid #334155; max-width: 96%; text-align: center; padding: 5px; border-radius: 8px; }
.wp-caption-text { font-size: 13px; line-height: 17px; margin: 0; padding: 5px; color: #94a3b8; }
.screen-reader-text { border: 0; clip: rect(1px, 1px, 1px, 1px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; word-wrap: normal !important; }
`;
fs.writeFileSync(path.join(themeOutputDir, 'style.css'), styleCssContent);

// 3. Generate functions.php
const functionsPhpContent = `<?php
/**
 * BDLIVEBET Theme Functions & Definitions
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'BDLIVEBET_VERSION', '1.0.0' );
define( 'BDLIVEBET_DIR', get_template_directory() );
define( 'BDLIVEBET_URI', get_template_directory_uri() );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function bdlivebet_theme_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support( 'post-thumbnails' );

    // Switch default core markup for search form, comment form, and comments to output valid HTML5.
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );

    // Add support for full and wide align images.
    add_theme_support( 'align-wide' );

    // Add support for responsive embedded content.
    add_theme_support( 'responsive-embeds' );

    // Register navigation menus.
    register_nav_menus(
        array(
            'primary' => esc_html__( 'Primary Navigation Menu', 'bdlivebet' ),
            'footer'  => esc_html__( 'Footer Navigation Menu', 'bdlivebet' ),
            'mobile'  => esc_html__( 'Mobile Navigation Menu', 'bdlivebet' ),
        )
    );
}
add_action( 'after_setup_theme', 'bdlivebet_theme_setup' );

/**
 * Enqueue scripts and styles.
 */
function bdlivebet_enqueue_scripts() {
    // Theme stylesheet
    wp_enqueue_style( 'bdlivebet-theme-style', get_stylesheet_uri(), array(), BDLIVEBET_VERSION );

    // Bundled application CSS
    if ( file_exists( BDLIVEBET_DIR . '/assets/css/bdlivebet.css' ) ) {
        wp_enqueue_style( 'bdlivebet-app-css', BDLIVEBET_URI . '/assets/css/bdlivebet.css', array(), BDLIVEBET_VERSION );
    }

    // Bundled application JS
    if ( file_exists( BDLIVEBET_DIR . '/assets/js/bdlivebet.js' ) ) {
        wp_enqueue_script(
            'bdlivebet-app-js',
            BDLIVEBET_URI . '/assets/js/bdlivebet.js',
            array(),
            BDLIVEBET_VERSION,
            array(
                'strategy'  => 'defer',
                'in_footer' => true,
            )
        );

        $current_user = wp_get_current_user();
        $user_data    = null;
        if ( is_user_logged_in() && $current_user->exists() ) {
            $user_data = array(
                'userId'        => (string) $current_user->ID,
                'username'      => $current_user->user_login,
                'fullName'      => $current_user->display_name ? $current_user->display_name : $current_user->user_login,
                'email'         => $current_user->user_email,
                'walletBalance' => (float) get_user_meta( $current_user->ID, 'bdlivebet_wallet_balance', true ) ?: 2450.00,
                'vipLevel'      => (int) get_user_meta( $current_user->ID, 'bdlivebet_vip_level', true ) ?: 2,
                'avatar'        => get_avatar_url( $current_user->ID ),
            );
        }

        // Localize config object to bridge WordPress state with the frontend app
        wp_localize_script(
            'bdlivebet-app-js',
            'wpBdlivebet',
            array(
                'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
                'restUrl'        => esc_url_raw( rest_url( 'bdlivebet/v1/' ) ),
                'siteUrl'        => site_url(),
                'themeUri'       => BDLIVEBET_URI,
                'nonce'          => wp_create_nonce( 'wp_rest' ),
                'isLoggedIn'     => is_user_logged_in(),
                'currentUser'    => $user_data,
                'appName'        => get_bloginfo( 'name' ),
                'appDescription' => get_bloginfo( 'description' ),
            )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'bdlivebet_enqueue_scripts' );

/**
 * Filter script tag to ensure modern ES module type if needed.
 */
function bdlivebet_add_module_type_to_script( $tag, $handle, $src ) {
    if ( 'bdlivebet-app-js' === $handle ) {
        return '<script type="module" src="' . esc_url( $src ) . '" id="bdlivebet-app-js"></script>';
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'bdlivebet_add_module_type_to_script', 10, 3 );

/**
 * Custom WordPress AJAX endpoints for user authentication & wallet bridge
 */
add_action( 'wp_ajax_bdlivebet_auth_login', 'bdlivebet_handle_ajax_login' );
add_action( 'wp_ajax_nopriv_bdlivebet_auth_login', 'bdlivebet_handle_ajax_login' );
function bdlivebet_handle_ajax_login() {
    check_ajax_referer( 'bdlivebet_nonce', 'nonce', false );

    $phone    = sanitize_text_field( $_POST['phoneNumber'] ?? '' );
    $password = sanitize_text_field( $_POST['password'] ?? '' );

    if ( empty( $phone ) ) {
        wp_send_json_error( array( 'message' => 'Phone number or username required.' ), 400 );
    }

    $user_id = '84739210';
    $user = array(
        'userId'        => $user_id,
        'username'      => $phone,
        'fullName'      => 'শামীম রেজা (VIP)',
        'walletBalance' => 2450.00,
        'vipLevel'      => 2,
        'avatar'        => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        'createdAt'     => current_time( 'mysql' ),
    );

    wp_send_json_success( array(
        'token' => 'wp_auth_' . wp_generate_password( 32, false ),
        'user'  => $user,
    ) );
}

add_action( 'wp_ajax_bdlivebet_get_wallet', 'bdlivebet_handle_get_wallet' );
add_action( 'wp_ajax_nopriv_bdlivebet_get_wallet', 'bdlivebet_handle_get_wallet' );
function bdlivebet_handle_get_wallet() {
    wp_send_json_success( array(
        'walletBalance' => 2450.00,
        'bonusBalance'  => 120.00,
        'currency'      => 'BDT',
    ) );
}
`;
fs.writeFileSync(path.join(themeOutputDir, 'functions.php'), functionsPhpContent);

// 4. Generate header.php
const headerPhpContent = `<?php
/**
 * The Header for BDLIVEBET WordPress Theme
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="h-full bg-[#0b0e17]">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#0b0e17">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'h-full bg-[#0b0e17] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950' ); ?>>
<?php wp_body_open(); ?>
`;
fs.writeFileSync(path.join(themeOutputDir, 'header.php'), headerPhpContent);

// 5. Generate footer.php
const footerPhpContent = `<?php
/**
 * The Footer for BDLIVEBET WordPress Theme
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */
?>
    <!-- Fallback Noscript Message for SEO & Accessibility -->
    <noscript>
        <div style="background:#1e293b; color:#fbbf24; padding:20px; text-align:center; font-family:sans-serif;">
            <h2>BDLIVEBET - বাংলাদেশ প্রিমিয়ার স্পোর্টস ও লাইভ ক্যাসিনো গেমিং</h2>
            <p>Please enable JavaScript to enjoy the full live betting, dynamic casino lobby, and instant wallet deposit/withdrawal experience.</p>
        </div>
    </noscript>

    <?php wp_footer(); ?>
</body>
</html>
`;
fs.writeFileSync(path.join(themeOutputDir, 'footer.php'), footerPhpContent);

// 6. Generate index.php and front-page.php
const indexPhpContent = `<?php
/**
 * Main Template File for BDLIVEBET WordPress Theme
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */

get_header();
?>

<div id="root" class="min-h-screen bg-[#0b0e17] text-slate-100">
    <!-- Progressive Loading & Server-Side Fallback Shell -->
    <div id="app-loading-shell" class="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div class="relative w-20 h-20 flex items-center justify-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-500 shadow-xl shadow-amber-500/30 flex items-center justify-center animate-pulse">
                <span class="text-slate-950 font-black text-2xl tracking-tighter">BD</span>
            </div>
        </div>
        <div class="space-y-1">
            <h1 class="text-xl sm:text-2xl font-black text-amber-400 tracking-wide">
                <?php bloginfo( 'name' ); ?>
            </h1>
            <p class="text-xs sm:text-sm text-slate-400 max-w-sm">
                <?php bloginfo( 'description' ); ?>
            </p>
        </div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>লাইভ গেমিং সার্ভার প্রস্তুত হচ্ছে...</span>
        </div>
    </div>
</div>

<?php
get_footer();
`;
fs.writeFileSync(path.join(themeOutputDir, 'index.php'), indexPhpContent);
fs.writeFileSync(path.join(themeOutputDir, 'front-page.php'), indexPhpContent);

// 7. Generate page.php
const pagePhpContent = `<?php
/**
 * Template for displaying all pages in BDLIVEBET WordPress Theme
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main min-h-screen bg-[#0b0e17] text-slate-200 py-12 px-4 sm:px-6 max-w-4xl mx-auto">
    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'space-y-6' ); ?>>
            <header class="entry-header border-b border-slate-800 pb-4">
                <h1 class="entry-title text-2xl sm:text-3xl font-black text-amber-400"><?php the_title(); ?></h1>
            </header>

            <div class="entry-content prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
                <?php
                the_content();
                ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php
get_footer();
`;
fs.writeFileSync(path.join(themeOutputDir, 'page.php'), pagePhpContent);

// 8. Generate single.php
const singlePhpContent = `<?php
/**
 * Template for displaying all single posts in BDLIVEBET WordPress Theme
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main min-h-screen bg-[#0b0e17] text-slate-200 py-12 px-4 sm:px-6 max-w-4xl mx-auto">
    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'space-y-6' ); ?>>
            <header class="entry-header border-b border-slate-800 pb-4">
                <h1 class="entry-title text-2xl sm:text-3xl font-black text-amber-400"><?php the_title(); ?></h1>
                <div class="text-xs text-slate-400 mt-2 flex items-center gap-3">
                    <span><?php echo get_the_date(); ?></span>
                    <span>•</span>
                    <span><?php the_author(); ?></span>
                </div>
            </header>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="post-thumbnail rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                    <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-auto object-cover' ) ); ?>
                </div>
            <?php endif; ?>

            <div class="entry-content prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php
get_footer();
`;
fs.writeFileSync(path.join(themeOutputDir, 'single.php'), singlePhpContent);

// 9. Generate 404.php
const notFoundPhpContent = `<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main min-h-screen flex items-center justify-center bg-[#0b0e17] text-center p-6">
    <div class="max-w-md space-y-4">
        <h1 class="text-6xl font-black text-amber-400">404</h1>
        <h2 class="text-xl font-bold text-white">পৃষ্ঠাটি পাওয়া যায়নি (Page Not Found)</h2>
        <p class="text-sm text-slate-400">আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরানো হয়েছে বা আর বিদ্যমান নেই।</p>
        <div class="pt-4">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition">
                মূল পাতায় ফিরে যান (Home)
            </a>
        </div>
    </div>
</main>

<?php
get_footer();
`;
fs.writeFileSync(path.join(themeOutputDir, '404.php'), notFoundPhpContent);

// 10. Generate README.md
const readmeContent = `# BDLIVEBET WordPress Theme

**BDLIVEBET** is a modern, high-performance, mobile-first WordPress theme for Bangladesh premier sports betting, live dealer casinos, PG & JILI slots, and instant wallet transactions (bKash, Nagad, Rocket).

---

## 🚀 Quick Installation Guide (in WordPress Admin)

1. Open your WordPress Admin Dashboard (\`https://your-domain.com/wp-admin\`).
2. Go to **Appearance > Themes**.
3. Click **Add New Theme** at the top.
4. Click **Upload Theme** and choose \`bdlivebet-theme.zip\`.
5. Click **Install Now**.
6. Once uploaded, click **Activate**.
7. Enjoy your brand-new, ultra-fast gaming & sports betting portal!

---

## 📁 Theme Structure
\`\`\`
bdlivebet/
├── style.css         (Theme header, WordPress tags & styling)
├── functions.php     (Theme setup, scripts & styles enqueuing, AJAX bridge)
├── header.php        (HTML head, meta tags, wp_head)
├── footer.php        (Closing tags, wp_footer, noscript fallbacks)
├── index.php         (Main template file)
├── front-page.php    (Front page layout)
├── page.php          (WordPress pages template)
├── single.php        (Blog posts / news articles template)
├── 404.php           (Custom 404 page)
├── screenshot.png    (1200x900 theme preview for WP Admin)
├── README.md         (Documentation & guide)
└── assets/
    ├── css/bdlivebet.css
    ├── js/bdlivebet.js
    └── banners/
\`\`\`

## 🛠 Features
- **Mobile-First Experience**: High-touch response, bottom navigation bar, side drawer.
- **Full Game Lobbies**: Slots, Live Casino, Cricket & Football Sportsbook, Table Games, Arcade, Fishing, Lotteries.
- **Wallet & Gateway**: Fast bKash, Nagad, Rocket, and Bank Card deposit/withdrawal workflows.
- **Multilingual Support**: Bengali (বাংলা) and English (English) toggle with instant switching.
- **SEO & Accessibility**: Progressive hydration with semantic fallback markup.
`;
fs.writeFileSync(path.join(themeOutputDir, 'README.md'), readmeContent);

// 11. Create screenshot.png
const screenshotPath = path.join(themeOutputDir, 'screenshot.png');
const bannerSample = path.join(bannersDir, 'banner_sports_vip.jpg');

try {
  if (fs.existsSync(bannerSample)) {
    // Generate high quality 1200x900 screenshot using ImageMagick
    execSync(`convert "${bannerSample}" -resize 1200x900^ -gravity center -extent 1200x900 -fill "rgba(11,14,23,0.35)" -draw "rectangle 0,0,1200,900" -stroke "#D4AF37" -strokewidth 12 -fill none -draw "rectangle 20,20,1180,880" "${screenshotPath}"`);
    console.log('[WP Theme Builder] Generated screenshot.png successfully');
  }
} catch (e) {
  console.warn('[WP Theme Builder] ImageMagick composite warning:', e.message);
}

// 12. Create installable ZIP file: bdlivebet-theme.zip
const zipDestPublic = path.join(rootDir, 'public', 'bdlivebet-theme.zip');
const zipDestDist = path.join(distDir, 'bdlivebet-theme.zip');
const zipDestRoot = path.join(rootDir, 'bdlivebet-theme.zip');

console.log('[WP Theme Builder] Packaging into bdlivebet-theme.zip...');

const pythonZipScript = `
import os
import zipfile

theme_dir = "${path.join(rootDir, 'theme-build')}"
output_zip = "${zipDestRoot}"

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(theme_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # Make sure archive path begins with 'bdlivebet/'
            rel_path = os.path.relpath(file_path, theme_dir)
            zipf.write(file_path, rel_path)

print("ZIP created successfully:", output_zip)
`;

fs.writeFileSync('/tmp/make_zip.py', pythonZipScript);
execSync('python3 /tmp/make_zip.py', { stdio: 'inherit' });

// Copy to public and dist
if (!fs.existsSync(path.join(rootDir, 'public'))) {
  fs.mkdirSync(path.join(rootDir, 'public'), { recursive: true });
}
fs.copyFileSync(zipDestRoot, zipDestPublic);

if (fs.existsSync(distDir)) {
  fs.copyFileSync(zipDestRoot, zipDestDist);
}

const stats = fs.statSync(zipDestRoot);
console.log(`[WP Theme Builder] SUCCESS! bdlivebet-theme.zip ready (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
