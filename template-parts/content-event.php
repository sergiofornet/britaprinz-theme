<?php
/**
 * Template part for displaying artwork pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">

		<?php
		if ( is_singular() ) :
			the_title( '<h1 class="entry-title">', '</h1>' );
		else :
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;
		?>

	</header><!-- .entry-header -->

	<?php britaprinz_theme_post_thumbnail(); ?>

	<div class="entry-content">

		<?php 
		if ( is_singular() ) :
			?>

			<p><?php echo esc_html( carbon_get_the_post_meta( 'bp_event_artist' ) ); ?></p>
			<div><?php echo wpautop( carbon_get_the_post_meta( 'bp_event_info' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
			<p><?php echo esc_html( date( __( 'd/m/Y', 'britaprinz-theme' ), strtotime( carbon_get_the_post_meta( 'bp_event_start' ) ) ) ); ?></p>
			<p><?php echo esc_html( date( __( 'd/m/Y', 'britaprinz-theme' ), strtotime( carbon_get_the_post_meta( 'bp_event_end' ) ) ) ); ?></p>
			<p><?php echo esc_html( carbon_get_the_post_meta( 'bp_artwork_condition' ) ); ?></p>
			<div>

				<?php 
				$gallery = carbon_get_the_post_meta( 'bp_event_gallery' );

				foreach ( $gallery as $image ) :
					echo wp_get_attachment_image( $image, 'thumbnail' );
				endforeach;
				?>

			</div>

			<?php 
		endif;

		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'britaprinz-theme' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				wp_kses_post( get_the_title() )
			)
		);

		wp_link_pages(
			array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'britaprinz-theme' ),
				'after'  => '</div>',
			)
		);
		?>

	</div><!-- .entry-content -->
	<footer class="entry-footer">

	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
