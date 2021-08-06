<?php // phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * Template Name: Exposiciones actuales
 * 
 * Template for current Events page
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

	<main id="primary" class="site-main site-main--sidebar">

		<?php
		while ( have_posts() ) :
			the_post();

			$bpa_theme_today = date( 'Y-m-d' );

			$bpa_theme_args = array(
				'post_type'  => 'event',
				'order'      => 'DESC',
				'orderby'    => 'start_date',
				'meta_query' => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation'   => 'AND',
					'start_date' => array(
						'key'     => 'bp_event_start',
						'value'   => $bpa_theme_today,
						'compare' => '<=',
						'type'    => 'DATE',
					),
					'end_date'   => array(
						'key'     => 'bp_event_end',
						'value'   => $bpa_theme_today,
						'compare' => '>=',
						'type'    => 'DATE',
					),
				),
			);

			get_template_part( 'template-parts/content', 'page-current-event', $bpa_theme_args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
