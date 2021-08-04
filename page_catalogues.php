<?php // phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * Template Name: Catálogos
 *
 * Template for 'catalogues' page
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

	<main id="primary" class="site-main site-main--half">
		<div class="award-container" data-state="unloaded">

		<?php
		while ( have_posts() ) :
			
			the_post();

			$bpa_theme_args = array(
				'post_type'      => 'award',
				'order'          => 'DESC',
				'orderby'        => 'edition',
				'posts_per_page' => 1,
				'post_status'    => 'publish',
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'edition' => array(
						'key' => 'bp_award_edition',
					),
				),
			);

			get_template_part( 'template-parts/content', 'page-catalogues', $bpa_theme_args );

		endwhile; // End of the loop.
		?>

		</div>
	</main><!-- #main -->

<?php
get_footer();
