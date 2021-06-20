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
			?>

			<div class="technique-content__steps">

				<?php
				foreach ( $bpa_theme_technique_steps as $bpa_theme_step ) :
					$bpa_theme_step_text = $bpa_theme_step['bp_technique_steps_text'];
					$bpa_theme_step_image_id = $bpa_theme_step['bp_technique_steps_image'];
					?>

					<figure class="step">

						<?php 
						echo wp_get_attachment_image( $bpa_theme_step_image_id, 'medium' ); 
						?>

						<figcaption><?php echo esc_html( $bpa_theme_step_text ); ?></figcaption>
					</figure>

					<?php
				endforeach;
				?>

			</div><!-- .technique-content__steps -->

			<?php
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
					?>
					
					<div class="artwork-gallery hidden">
						<div class="artwork-gallery__close">
							<button class="close">&times;</button>
						</div>
						<div class="artwork-gallery__slider">

							<?php
							foreach ( $bpa_theme_artworks as $bpa_theme_artwork ) :
								$bpa_theme_artwork_id    = $bpa_theme_artwork['id'];
								$bpa_theme_artwork_title = get_the_title( $bpa_theme_artwork_id );
								$bpa_theme_artwork_year  = carbon_get_post_meta( $bpa_theme_artwork_id, 'bp_artwork_year' );
								$bpa_theme_artwork_copy  = carbon_get_post_meta( $bpa_theme_artwork_id, 'bp_artwork_copy' );
								$bpa_theme_artwork_image = get_the_post_thumbnail( $bpa_theme_artwork_id, 'medium' );
								
								$bpa_theme_artist      = get_the_terms( $bpa_theme_artwork_id, 'artist' );
								$bpa_theme_artist_name = $bpa_theme_artist[0]->name;
								$bpa_theme_artist_link = get_term_link( $bpa_theme_artist[0]->term_id, 'artist' );
								$bpa_theme_artist_slug = $bpa_theme_artist[0]->slug;
								
								if ( $bpa_theme_artwork_image ) :
									?>

									<div>
									<figure>

										<?php echo $bpa_theme_artwork_image; ?>

										<figcaption>

											<?php 
											echo sprintf(
												'<strong><a href="%1$s">%2$s</a></strong><br>%3$s<br>%4$s<br>%5$s',
												esc_url( $bpa_theme_artist_link ),
												esc_html( $bpa_theme_artist_name ),
												esc_html( $bpa_theme_artwork_title ),
												esc_html( $bpa_theme_artwork_year ),
												esc_html( $bpa_theme_artwork_copy )
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
				}, 
				10,
				2
			);
		endif;
		?>

	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
