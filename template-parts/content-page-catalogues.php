<?php
/**
 * Template part for displaying catalogue links in page_catalogues.php
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'nav_menu_items_catalogues', 'bpa_theme_get_catalogues' );
get_template_part( 'template-parts/nav/secondary', 'award', 'award-menu' );
?>

<div class="award-edition-container container__catalogue" data-state="loaded">
	<button class="award-edition-container__return-button return-button" aria-pressed="false"><</button>
	<article id="post-<?php //the_ID(); ?>" <?php //post_class(); ?>>
		<div class="entry-content catalogue">

			<?php
			$bpa_theme_award_query = new WP_Query( $args );

			if ( $bpa_theme_award_query->have_posts() ) :
				?>

				<?php
				while ( $bpa_theme_award_query->have_posts() ) :
					$bpa_theme_award_query->the_post();
					
					if ( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) :
						
						$bpa_theme_edition_id = get_the_ID();

						$bpa_theme_edition = carbon_get_the_post_meta( 'bp_award_edition' );

						$bpa_theme_edition_cover_image = wp_get_attachment_image( carbon_get_the_post_meta( 'bp_award_catalogue_cover' ), 'medium' );

						$bpa_theme_images_ids = carbon_get_the_post_meta( 'bp_award_catalog_gallery' );
						?>

						<h1 class="catalogue__title">
							<p><?php esc_html_e( 'Catálogo', 'britaprinz-theme' ); ?></p>
							<p><?php echo esc_html( $bpa_theme_edition ); ?></p>
						</h1>

						<?php 
						if ( $bpa_theme_edition_cover_image ) :
							?>

							<figure class="catalogue__cover">

								<?php echo wp_kses( $bpa_theme_edition_cover_image, bpa_theme_image_allowed_html() ); ?>

							</figure>

							<?php
						endif;
						
						echo sprintf(
							'<div class="catalogue__link"><a href="%s" title="%s" target="_blank" rel="noopener noreferrer">%s</a></div>',
							esc_url( wp_get_attachment_url( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) ),
							esc_html( get_the_title() ),
							esc_html__( 'Descargar PDF', 'britaprinz-theme' )
						);

						if ( $bpa_theme_images_ids ) :
							$bpa_theme_gallery = $bpa_theme_images_ids ? implode(
								'', 
								array_map(
									fn( $id ) =>  '<div class="tns-slide"><figure>' . wp_get_attachment_image( $id, 'award-thumbnail' ) . '</figure></div>', 
									$bpa_theme_images_ids
								) 
							) : null;
							?>

							<div class="catalogue__gallery-container">
								<button class="previous-slide"><</button>
								<button class="next-slide">></button>
								<div class="catalogue__gallery">

									<?php
									echo wp_kses( $bpa_theme_gallery, bpa_theme_image_allowed_html() );
									?>

								</div>
							</div>

							<?php
						endif;


					endif;

				endwhile; // End of the loop.
				?>

				<?php
			endif;
			$bpa_theme_award_query->wp_reset_postdata();
			?>
		</div><!-- .entry-content -->
	</article><!-- #post-<?php the_ID(); ?> -->
</div><!--.award-edition-container -->

<?php 
