<?php
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
