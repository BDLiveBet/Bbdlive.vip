<?php
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
