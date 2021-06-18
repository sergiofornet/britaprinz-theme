<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--sidebar">

		<?php
		get_template_part( 'template-parts/nav/secondary', '', "news-menu" );
		?>

		<div>

		<?php
		if ( have_posts() ) :

			if ( is_home() && ! is_front_page() ) :
				?>
				<!-- <header>
					<h1 class="page-title"><?php single_post_title(); ?></h1>
				</header> -->
				<?php
			endif;

			/* Start the Loop */
			while ( have_posts() ) :
				the_post();

				/*
				 * Include the Post-Type-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
				 */
				get_template_part( 'template-parts/content', get_post_type() );

			endwhile;

			the_posts_navigation(
				array(
					'prev_text'          => __( 'Anterior', 'britaprinz-theme' ),
					'next_text'          => __( 'Siguiente', 'britaprinz-theme' ),
					'screen_reader_text' => __( 'Posts navigation', 'britaprinz-theme' )
				)
			);

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>
		
		</div>


	</main><!-- #main -->

<?php
get_footer();
