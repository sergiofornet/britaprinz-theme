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

			<header class="page-header">
				<h1 class="page-title">

					<?php echo post_type_archive_title(); ?>

				</h1>
			</header><!-- .page-header -->
			<input type="search" class="artist-search" autocomplete="off">
			<div style="display: grid; grid-template-columns: 1fr 1fr;">
				<div class="artists" style="display: grid; grid-template-columns: 9fr 1fr; height:100vh">
					<div class="artists__list" style="height: 100vh; overflow-y: scroll;"></div>
					<div class="artists__initials">

						<?php
						foreach ( range( 'a', 'z' ) as $initial ) :
							?>

							<div class="initial">
								<button class="initial__button" data-target="<?php echo esc_attr( $initial ); ?>"><?php echo esc_html( $initial ); ?></button>
							</div>

							<?php
						endforeach;
						?>

					</div>
				</div>
				<div class="artworks"></div>
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
