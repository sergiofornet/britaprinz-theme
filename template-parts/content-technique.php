<?php
/**
 * Template part for displaying Technique post type pages
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

			?>
			 
			<div>
			
				<?php 
				$artists = carbon_get_the_post_meta('bp_technique_artist');

				if ( $artists ) :
					foreach( $artists as $artist ) :
						$artist_link = get_term_link( get_term( $artist['id'], $taxonomy) );
						$artist_name = get_term( $artist['id'], $taxonomy)->name;
						$artist_slug = get_term( $artist['id'], $taxonomy)->slug;

						?>
						
						<a href="<?php echo esc_url( get_post_type_archive_link( 'artwork' ) . $artist_slug ); ?>"><?php echo esc_html( $artist_name ) ?></a>

						<?php
					endforeach;
				endif;
				?>
			
			</div>
			<div>

				<?php 
				$gallery = carbon_get_the_post_meta('bp_artwork_gallery');

				foreach ($gallery as $image) :
					echo wp_get_attachment_image( $image, 'thumbnail' );
				endforeach;
				?>

			</div>
		
		<?php endif;?>
		
		<?php
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
