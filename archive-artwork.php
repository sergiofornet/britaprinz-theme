<?php
/**
 * The template for displaying artwork archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

	<main id="primary" class="site-main site-main--half">

		<?php if ( have_posts() ) : ?>

			<div class="collection" data-state="closed">
				<header class="page-header collection__header">

					<?php
					get_template_part( 'template-parts/nav/secondary', '', 'artwork-menu' );
					?>

					<div class="collection__search-container">
						<input type="search" class="artist-search collection__search" autocomplete="off">
					</div>
				</header><!-- .page-header -->
				<div class="artists collection__artists">
					<div class="artists__list" style=""></div>
					<div class="artists__initials">

						<?php
						$bpa_theme_initials   = array();
						$bpa_theme_post_terms = get_terms( 
							array( 
								'taxonomy'   => 'artist',
								'hide_empty' => false,
							)
						);

						foreach ( $bpa_theme_post_terms as $bpa_theme_post_term ) :
							$bpa_theme_term_id    = $bpa_theme_post_term->term_id;
							$bpa_theme_artist     = carbon_get_term_meta( $bpa_theme_term_id, 'bp_artist_order_name' );
							$bpa_theme_initials[] = strtolower( trim( $bpa_theme_artist )[0] ); // phpcs:ignore PHPCompatibility.Syntax.NewFunctionArrayDereferencing.Found
						endforeach;

						$bpa_theme_unique_initials = array_unique( $bpa_theme_initials );
						sort( $bpa_theme_unique_initials );

						foreach ( $bpa_theme_unique_initials as $bpa_theme_initial ) :
							?>

							<div class="initial">
								<button class="initial__button" data-target="<?php echo esc_attr( $bpa_theme_initial ); ?>"><?php echo esc_html( $bpa_theme_initial ); ?></button>
							</div>

							<?php
						endforeach;
						?>

					</div>
				</div>
				<div class="artworks collection__artworks" data-state='unloaded'>
				</div>
			</div>

			<?php
			add_action(
				'bpa_theme_gallery_markup',
				function() { // phpcs:ignore PHPCompatibility.FunctionDeclarations.NewClosure.Found
					$markup = "
						<div class='artwork-gallery hidden'>
							<div class='artwork-gallery__close'>
								<button class='close'>&times;</button>
							</div>
							<div class='artwork-gallery__slider'></div>
						</div>
					";
					echo wp_kses_post( $markup );
				},
				10,
				2
			);

		else :
			get_template_part( 'template-parts/content', 'none' );
		endif;
		?>

	</main><!-- #main -->

<?php
get_footer();
