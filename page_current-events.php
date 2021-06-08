<?php
/**
 * Template Name: Exposiciones actuales
 * 
 * Template for current Events page
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
				'post_type'  => 'event',
				'order'      => 'DESC',
				'orderby'    => 'start_date',
				'meta_query' => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation'   => 'AND',
					'start_date' => array(
						'key'     => 'bp_event_start',
						'value'   => $today,
						'compare' => '<=',
						'type'    => 'DATE',
					),
					'end_date'   => array(
						'key'     => 'bp_event_end',
						'value'   => $today,
						'compare' => '>=',
						'type'    => 'DATE',
					),
				),
			);

			get_template_part( 'template-parts/content', 'page-current-event', $args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
