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

	<?php //britaprinz_theme_post_thumbnail(); ?>

	<div class="entry-content">
		
		<?php the_content(); ?>

		<div>
			<div>
				<div>
				
					<?php 
					$gallery = carbon_get_the_post_meta('bp_home_gallery');
					foreach ($gallery as $image) :
						echo wp_get_attachment_image( $image, 'thumbnail' );
					endforeach;
					?>
				
				</div>
				<div>
				
					<?php echo esc_html( carbon_get_the_post_meta( 'bp_home_gallery_text' ) ); ?>
				
				</div><!--home-gallery-text-->
			</div><!--home-gallery-->
			<div>
			
				<?php 
					$featured_content = carbon_get_the_post_meta('bp_home_featured');

					foreach ( $featured_content as $content ) :
						?>

						<div>

							<?php
							echo sprintf(
								'<a href="%s">%s</a>',
								esc_url( get_permalink( $content['bp_home_featured_post'][0]['id'] ) ),
								esc_html( $content['bp_home_featured_label'] )
							);
							?>

						</div>

						<?php
					endforeach;
				?>
			
			</div><!--home-featured-content-->
		</div>
		<div>
		
			<?php echo apply_filters( 'the_content', carbon_get_the_post_meta( 'bp_home_about' ) ); ?>
			
		</div><!--home-about-->

	
	</div><!-- .entry-content -->

	<?php if ( get_edit_post_link() ) : ?>
		<footer class="entry-footer">
			<?php
			// edit_post_link(
			// 	sprintf(
			// 		wp_kses(
			// 			/* translators: %s: Name of current post. Only visible to screen readers */
			// 			__( 'Edit <span class="screen-reader-text">%s</span>', 'britaprinz-theme' ),
			// 			array(
			// 				'span' => array(
			// 					'class' => array(),
			// 				),
			// 			)
			// 		),
			// 		wp_kses_post( get_the_title() )
			// 	),
			// 	'<span class="edit-link">',
			// 	'</span>'
			// );
			?>
		</footer><!-- .entry-footer -->
	<?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->
