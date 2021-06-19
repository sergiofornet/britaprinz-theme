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

		$artworks_link = carbon_get_the_post_meta( 'bp_technique_related_text' ) ? carbon_get_the_post_meta( 'bp_technique_related_text' ) : null;
		$artworks = carbon_get_the_post_meta( 'bp_technique_artwork' ) ? carbon_get_the_post_meta( 'bp_technique_artwork' ) : null;


		if ( $artworks && $artworks_link ) :
			?>

			<div class="related_artworks">
				<button class="related-artworks__toggle"><?php echo esc_html( $artworks_link ); ?></button>
			</div>

			<div class="artwork-gallery hidden">
				<div class="artwork-gallery__close">
					<button class="close">&times;</button>
				</div>
				<div class="artwork-gallery__slider">

					<?php
					foreach ( $artworks as $artwork ) :
						$artwork_id    = $artwork['id'];
						$artwork_title = get_the_title( $artwork_id );
						$artwork_year  = carbon_get_post_meta( $artwork_id, 'bp_artwork_year' );
						$artwork_copy  = carbon_get_post_meta( $artwork_id, 'bp_artwork_copy' );
						$artwork_image = get_the_post_thumbnail( $artwork_id, 'thumbnail' );
						
						$artist        = get_the_terms( $artwork_id, 'artist' );
						$artist_name   = $artist[0]->name;
						$artist_link   = get_term_link( $artist[0]->term_id, 'artist' );
						$artist_slug   = $artist[0]->slug;
						
						if ( $artwork_image ) :
							?>
							<div>
							<figure>

								<?php echo $artwork_image; ?>

								<figcaption>

									<?php 
									echo sprintf(
										'<strong><a href="%1$s">%2$s</a></strong><br>%3$s<br>%4$s<br>%5$s',
										esc_url( $artist_link ),
										esc_html( $artist_name ),
										esc_html( $artwork_title ),
										esc_html( $artwork_year ),
										esc_html( $artwork_copy )
									);
									?>

								</figcaption>
							</figure>
							</div>

							<?php
						endif;
					endforeach;
					?>
				</div>
			</div>
			<?php
		endif;
		?>

	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
