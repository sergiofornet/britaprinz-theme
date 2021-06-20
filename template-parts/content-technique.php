<?php
/**
 * Template part for displaying Technique post type pages
 *
 * @package Brita_Prinz_Theme
 */

$bpa_theme_technique_steps = carbon_get_the_post_meta( 'bp_technique_steps' );
$bpa_theme_artworks = carbon_get_the_post_meta( 'bp_technique_artwork' ) ? carbon_get_the_post_meta( 'bp_technique_artwork' ) : null;
$bpa_theme_artworks_link = carbon_get_the_post_meta( 'bp_technique_related_text' ) ? carbon_get_the_post_meta( 'bp_technique_related_text' ) : null;

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

		if ( $bpa_theme_technique_steps ) :
			get_template_part( 'template-parts/technique/technique', 'steps', $bpa_theme_technique_steps );
		endif;

		if ( $bpa_theme_artworks && $bpa_theme_artworks_link ) :
			?>

			<div class="technique-content__related-artworks">
				<button class="related-artworks__toggle"><?php echo esc_html( $bpa_theme_artworks_link ); ?></button>
			</div><!-- .technique-content__related-artworks -->

			<?php
			add_action(
				'bpa_theme_gallery_markup',
				function() use ( $bpa_theme_artworks ) {
					get_template_part( 'template-parts/technique/technique', 'gallery', $bpa_theme_artworks );
				}, 
				10,
				2
			);
		endif;
		?>

	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
