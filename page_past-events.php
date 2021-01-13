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
				'post_type'   => 'event',
				'order'       => 'DESC',
				'orderby'     => 'end_date',
				'meta_query'  => array(
					'end_date' => array(
						'key'     => 'bp_event_end',
						'value'   => $today,
						'compare' => '<',
						'type'    => 'DATE'
					),
				),
			);

			get_template_part( 'template-parts/content', 'page-events', $args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
