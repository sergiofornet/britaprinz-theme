<?php
/**
 * Template part for displaying technique gallery slide
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

$bpa_theme_artwork = $args;

if ( $bpa_theme_artwork ) : 
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
endif;
