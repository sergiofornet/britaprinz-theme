<?php
/**
 * Template part for displaying Technique post type pages
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php 
	get_template_part( 'template-parts/nav/secondary', '', 'technique-menu' );
	?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header technique-header">

		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

	</header><!-- .entry-header -->
	<div class="entry-content technique-content">

		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'britaprinz-theme' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
			wp_kses_post( get_the_title() )
			)
		);
		?>

	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
