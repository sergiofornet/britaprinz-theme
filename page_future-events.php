<?php // phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * Template Name: Exposiciones futuras
 *
 * Template for future Events page
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--sidebar">

		<?php
		while ( have_posts() ) :
			the_post();

			$bpa_theme_today = date( 'Y-m-d' );

			$bpa_theme_args = array(
				'posts_per_page' => 15,
				'post_type'      => 'event',
				'order'          => 'ASC',
				'orderby'        => 'start_date',
				'paged'          => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'start_date' => array(
						'key'     => 'bp_event_start',
						'value'   => $bpa_theme_today,
						'compare' => '>',
						'type'    => 'DATE',
					),
				),
			);

			get_template_part( 'template-parts/content', 'page-events', $bpa_theme_args );

		endwhile; // End of the loop.
		?>

		<?php do_action( 'bpa_theme_events_navigation' ); ?>

	</main><!-- #main -->

<?php
get_footer();
