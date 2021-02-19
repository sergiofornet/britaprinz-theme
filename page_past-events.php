<?php
/**
 * Template Name: Exposiciones pasadas
 *
 * Template for past Events page
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">

		<?php
		while ( have_posts() ) :
			
			the_post();

			$today = date( 'Y-m-d' );

			$args = array(
				'posts_per_page' => 20,
				'post_type'      => 'event',
				'order'          => 'DESC',
				'orderby'        => 'end_date',
				'paged'          => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'end_date' => array(
						'key'     => 'bp_event_end',
						'value'   => $today,
						'compare' => '<',
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
