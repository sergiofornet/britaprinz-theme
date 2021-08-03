<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--sidebar">

		<?php if ( have_posts() ) : ?>

			<header class="page-header">

				<?php
				the_archive_title( '<h1 class="page-title">', '</h1>' );
				the_archive_description( '<div class="archive-description">', '</div>' ); // must review
				?>
				
			</header><!-- .page-header -->

			<?php
			/* Start the Loop */
			while ( have_posts() ) :
				the_post();
				
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

	</main><!-- #main -->

<?php
get_footer();
