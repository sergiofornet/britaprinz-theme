<?php
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

			$today = date( 'Y-m-d' );

			$args = array(
				'posts_per_page' => 15,
				'post_type'   => 'event',
				'order'       => 'ASC',
				'orderby'     => 'start_date',
				'meta_query'  => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'start_date' => array(
						'key'     => 'bp_event_start',
						'value'   => $today,
						'compare' => '>',
						'type'    => 'DATE',
					),
				),
			);

			get_template_part( 'template-parts/content', 'page-events', $args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
