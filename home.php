<?php
/**
 * The main template file
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
		get_template_part( 'template-parts/nav/secondary', '', 'news-menu' );
		?>

		<div>

		<?php
		if ( have_posts() ) :

			if ( is_home() && ! is_front_page() ) :
				single_post_title();
			endif;

			/* Start the Loop */
			while ( have_posts() ) :
				the_post();
				
				get_template_part( 'template-parts/content', get_post_type() );

			endwhile;

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

		</div>

		<?php
		add_filter( 'next_posts_link_attributes', 'bpa_theme_previous_posts_link_attributes' );
		add_filter( 'previous_posts_link_attributes', 'bpa_theme_next_posts_link_attributes' );
		the_posts_navigation(
			array(
				'prev_text'          => __( 'Anterior', 'britaprinz-theme' ),
				'next_text'          => __( 'Siguiente', 'britaprinz-theme' ),
				'screen_reader_text' => __( 'Posts navigation', 'britaprinz-theme' ),
			)
		);
		?>

	</main><!-- #main -->

<?php
get_footer();
