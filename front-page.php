<?php
/**
 * The template for displaying home page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
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

			get_template_part( 'template-parts/content', 'front-page' );

		endwhile; // End of the loop.
		?>


	</main><!-- #main -->

<?php
get_footer();
