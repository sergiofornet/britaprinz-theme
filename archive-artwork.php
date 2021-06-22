<?php
/**
 * The template for displaying artwork archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">

		<?php if ( have_posts() ) : ?>

			<div class="collection">
				<header class="page-header collection__header">
					
					<?php
					get_template_part( 'template-parts/nav/secondary', '', 'artwork-menu' );	
					?>

					<input type="search" class="artist-search
					collection__search" autocomplete="off">
				</header><!-- .page-header -->
				<div class="artists collection__artists">
					<div class="artists__list" style=""></div>
					<div class="artists__initials">

						<?php
						$bpa_theme_initials = array();
						while ( have_posts() ) :
							the_post();
							$bpa_theme_term_id = get_the_terms( $post->ID, 'artist' )[0]->term_id;
							$bpa_theme_artist = carbon_get_term_meta( $bpa_theme_term_id, 'bp_artist_order_name' );
							$bpa_theme_initials[] = trim( $bpa_theme_artist )[0];
						endwhile;

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
				<div class="artworks collection__artworks">
				</div>
			</div>
			<div class="artwork-gallery hidden">
				<div class="artwork-gallery__close">
					<button class="close">&times;</button>
				</div>
				<div class="artwork-gallery__slider"></div>
			</div>

			<?php
		else :
			get_template_part( 'template-parts/content', 'none' );
		endif;
		?>

	</main><!-- #main -->

<?php
get_footer();
