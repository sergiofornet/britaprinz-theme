<?php
/**
 * The template for displaying Project archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--sidebar">

		<?php 
		$bpa_theme_archive_project_post_type = get_post_type();
		get_template_part( 'template-parts/nav/secondary', '', "{$bpa_theme_archive_project_post_type}-menu" );
		
		if ( have_posts() ) :
		?>
			<div id="projects" class="projects">

				<header class="page-header">
					<?php
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					?>
				</header><!-- .page-header -->
				<div class="entry-content">

					<?php 
				
					// echo apply_filters( 'the_content', ( britaprinz_get_i18n_theme_option( 'bp_technique_history' ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

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
					?>

				</div>

				<?php
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
				'screen_reader_text' => __( 'Projects navigation', 'britaprinz-theme' ),
			)
		);
		?>

	</main><!-- #main -->

<?php
get_footer();
