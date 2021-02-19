<?php
/**
 * Template Name: Técnicas de grabado
 *
 * Template for 'techniques' page
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">

		<?php
		while ( have_posts() ) :
			
			the_post();

			$args = array(
				'post_type'   => 'technique',
				'order'       => 'ASC',
				'orderby'     => 'title',
			);

			get_template_part( 'template-parts/content', 'page-techniques', $args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
