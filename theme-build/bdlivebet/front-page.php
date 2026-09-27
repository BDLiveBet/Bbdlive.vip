<?php
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
