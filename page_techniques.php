<?php // phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * Template Name: Técnicas de grabado
 *
 * Template for 'techniques' page
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--sidebar">

		<?php
		while ( have_posts() ) :
			
			the_post();

			$bpa_theme_args = array(
				'post_type'   => 'technique',
				'order'       => 'ASC',
				'orderby'     => 'title',
			);

			get_template_part( 'template-parts/content', 'page-techniques', $bpa_theme_args );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
