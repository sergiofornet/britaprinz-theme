<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_header();

$bpa_theme_sidebar = carbon_get_the_post_meta( 'bp_page_menu' ) === 'undefined' ? null : carbon_get_the_post_meta( 'bp_page_menu' );
?>

	<main id="primary" class="site-main site-main<?php echo $bpa_theme_sidebar ? '--sidebar' : ''; ?>">

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content', 'page', array( 'sidebar' => $bpa_theme_sidebar ) );
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
