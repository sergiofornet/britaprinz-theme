<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">

		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

	</header><!-- .entry-header -->
	<div class="entry-content">

		<?php the_content(); ?>

		<div>
			<div>
				<div class="home__slider">
					<div class="slides">

						<?php 
						$gallery = carbon_get_the_post_meta( 'bp_home_gallery' );

						foreach ( $gallery as $image ) :
							?>

							<div class="slide">

								<?php echo wp_get_attachment_image( $image, 'full' ); ?>
							</div>

							<?php
						endforeach;
						?>

					</div>
				</div>
				<div>

					<?php echo esc_html( carbon_get_the_post_meta( 'bp_home_gallery_text' ) ); ?>

				</div><!--home-gallery-text-->
			</div><!--home-gallery-->
			<div>

				<?php 
				$featured_content = carbon_get_the_post_meta( 'bp_home_featured' );

				foreach ( $featured_content as $content ) :

					if ( $content['bp_home_featured_post'] ) :
						$content_url   = get_permalink( $content['bp_home_featured_post'][0]['id'] );
						$content_label = $content['bp_home_featured_label'] ?
							$content['bp_home_featured_label'] :
							get_the_title( $content['bp_home_featured_post'][0]['id'] );
						?>

						<div>

							<?php
							echo sprintf(
								'<a href="%s">%s</a>',
								esc_url( $content_url ),
								esc_html( $content_label )
							);
							?>

						</div>

						<?php
					endif;

				endforeach;
				?>

			</div><!--home-featured-content-->
		</div>
		<div>

			<?php echo apply_filters( 'the_content', carbon_get_the_post_meta( 'bp_home_about' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

		</div><!--home-about-->
	</div><!-- .entry-content -->
	<footer class="entry-footer">

	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
