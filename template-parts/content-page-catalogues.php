<?php
/**
 * Template part for displaying catalogue links in page_catalogues.php
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php
	add_filter( 'nav_menu_items_catalogues', 'britaprinz_theme_get_catalogues' );
	get_template_part( 'template-parts/nav/secondary', 'award', 'award-menu' );	
?>

<div class="award-edition-container" data-state="loaded">
	<button class="award-edition-container__return-button return-button" aria-pressed="false"><</button>
	<article id="post-<?php //the_ID(); ?>" <?php //post_class(); ?>>
		<div class="entry-content catalogue">

			<?php
			// the_content();
			$award_query = new WP_Query( $args );

			if ( $award_query->have_posts() ) :
				?>

				<?php
				while ( $award_query->have_posts() ) :
					$award_query->the_post();
					
					if ( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) :
						
						$edition_id = get_the_ID();

						$edition = carbon_get_the_post_meta( 'bp_award_edition' );

						$edition_cover_image = wp_get_attachment_image( carbon_get_the_post_meta( 'bp_award_catalogue_cover' ), 'medium' );
						?>

						<h1 class="catalogue__title">
							<p><?php esc_html_e( 'Catálogo', 'britaprinz-theme' ); ?></p>
							<p><?php echo esc_html( $edition ); ?></p>
						</h1>

						<?php 
						if ($edition_cover_image) :
							?>

							<figure class="catalogue__cover">

								<?php echo $edition_cover_image; ?>

							</figure>

							<?php
						endif;
						
						echo sprintf(
							'<div class="catalogue__link"><a href="%s" title="%s" target="_blank" rel="noopener noreferrer">%s</a></div>',
							esc_url( wp_get_attachment_url( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) ),
							esc_html( get_the_title() ),
							esc_html__( 'Descargar PDF', 'britaprinz-theme' )
						);
						?>

						<div class="catalogue__gallery-toggle">
							<button class="gallery-toggle"><?php esc_html_e( 'Ver catálogo', 'britaprinz-theme'); ?></button>
						</div>

						<?php
						$images_ids = carbon_get_the_post_meta( 'bp_award_catalog_gallery' );

						$gallery = $images_ids ? implode(
							'', 
							array_map(
								fn( $id ) =>  '<div class="swiper-slide"><figure>' . wp_get_attachment_image( $id, 'large' ) . '</figure></div>', 
								$images_ids
							) 
						) : null;

						/** TODO:
						 * Gallery:
						 * 1. think
						 * 2. test
						 */
						// add_action(
						// 	'bpa_theme_gallery_markup',
						// 	function() use ( $gallery, $edition_id ) {
						// 		$markup = "
						// 			<div class='award-gallery swiper-container hidden' data-edition='{$edition_id}'>
						// 				<div class='award-gallery__close'>
						// 					<button class='close'>&times;</button>
						// 				</div>
						// 				<div class='award-gallery__slider swiper-wrapper'>{$gallery}</div>
						// 				<div class='swiper-button-prev'></div>
						// 				<div class='swiper-button-next'></div>
						// 			</div><!--.edition-gallery -->
						// 		";
						// 		echo $markup;
						// 	}, 
						// 	10,
						// 	2
						// );

					endif;

				endwhile; // End of the loop.
				?>

				<?php
			endif;
			$award_query->wp_reset_postdata();
			?>
		</div><!-- .entry-content -->
	</article><!-- #post-<?php the_ID(); ?> -->
</div><!--.award-edition-container -->

<?php 
