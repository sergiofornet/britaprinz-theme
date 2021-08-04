<?php
/**
 * Template part for displaying technique galleries
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$bpa_theme_artworks = $args;

if ( $bpa_theme_artworks ) : 
	?>

	<div class="artwork-gallery hidden">
		<div class="artwork-gallery__close">
			<button class="close">&times;</button>
		</div>
		<div class="artwork-gallery__slider">
			<div class="slides">

			<?php
			foreach ( $bpa_theme_artworks as $bpa_theme_artwork ) :
				get_template_part( 'template-parts/technique/technique', 'gallery-slide', $bpa_theme_artwork );
			endforeach;
			?>

			</div>
		</div>
	</div>

	<?php
endif;
