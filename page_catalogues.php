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

	<main id="primary" class="site-main">

		<?php
		while ( have_posts() ) :
			
			the_post();

			$args = array(
				'post_type'		=> 'award',
				'order'			=> 'DESC',
				'orderby'		=> 'edition',
				'meta_query'	=> array(
					'edition'	=> array(
						'key'	=> 'bp_award_edition',
					)
				),
			);

			get_template_part( 'template-parts/content', 'page-catalogues', $args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
