<?php
/**
 * Template part for displaying Technique post type pages
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php 
	get_template_part( 'template-parts/nav/secondary', '', 'technique-menu' );
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

			$artwork = carbon_get_the_post_meta( 'bp_technique_artwork' ) ? carbon_get_the_post_meta( 'bp_technique_artwork' ) : null;
			
			if ( $artwork) :
				$artwork_id      = $artwork[0]['id'];
				$artwork_title   = get_the_title( $artwork_id );

				$artwork_gallery = carbon_get_post_meta( $artwork_id, 'bp_artwork_gallery' );

				$artist          = get_the_terms( $artwork_id, 'artist' );
				$artist_name     = $artist[0]->name;
				$artist_link     = get_term_link( $artist[0]->term_id, 'artist' );
				$artist_slug     = $artist[0]->slug;

				?>

				<div class="technique__artwork">

				<?php
				foreach ( $artwork_gallery as $image ) :
					?>
					
					<figure>
						<?php echo wp_get_attachment_image( $image, 'thumbnail' ); ?>
					</figure>

					<?php
				endforeach;
				?>

				</div>
				<p class="technique__artist">
					<span class="artist__name"><?php esc_html_e( $artwork_title, 'britaprinz-theme' ); ?> - </span>
					<span class="artist__link">
						<a href="<?php echo esc_url( $artist_link ); ?>"><?php echo esc_html( $artist_name ); ?></a>
					</span>
				</p><!-- Artist -->
		
				<?php 
			endif;
		endif;
		
		wp_link_pages(
			array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'britaprinz-theme' ),
				'after'  => '</div>',
			)
		);
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php britaprinz_theme_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
