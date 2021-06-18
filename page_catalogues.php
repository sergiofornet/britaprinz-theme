<?php
/**
 * Template Name: Catálogos
 *
 * Template for 'catalogues' page
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--half">

		<?php
		while ( have_posts() ) :
			
			the_post();

			$args = array(
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

			get_template_part( 'template-parts/content', 'page-catalogues', $args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
