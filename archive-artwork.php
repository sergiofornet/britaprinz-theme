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
					<h1 class="page-title">
	
						<?php echo post_type_archive_title(); ?>
	
					</h1>
					<input type="search" class="artist-search
					collection__search" autocomplete="off">
				</header><!-- .page-header -->
				<div class="artists collection__artists">
					<div class="artists__list" style=""></div>
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
