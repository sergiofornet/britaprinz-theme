<?php
/**
 * Template part for displaying Award post type pages
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

	<div class="entry-content award">

		<?php 
		if ( is_singular() ) :
			
			if ( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) :
				?>

				<div class="award__catalogue"><a href="<?php echo esc_url( wp_get_attachment_url( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Catálogo', 'britaprinz-theme' ); ?></a></div>

				<?php
			endif;
			
			if ( carbon_get_the_post_meta( 'bp_award_se' ) ) :
				?>

				<ul class="award__special-edition">
				
				<?php
				foreach( carbon_get_the_post_meta( 'bp_award_se' ) as $edition ) :
					?>

					<li class="special-edition">
						<div class="special-edition__year"><?php echo esc_html( $edition['bp_award_se_year'] ); ?></div>

						<div class="special-edition__winners">
							<?php echo wpautop( esc_html( $edition['bp_award_se_winners'] ) ); ?>
						</div>

					</li>

					<?php
				endforeach;
				?>

				</ul>
				
				<?php
			
			else:

				if ( carbon_get_the_post_meta( 'bp_award' ) ) :
					foreach ( carbon_get_the_post_meta( 'bp_award' ) as $index => $award ) :
						?>

						<div class="award__category award__category-<?php echo esc_attr($index + 1); ?>">
							<p class="category__name"><?php echo esc_html( $award['bp_award_category'] ); ?></p>
							<p class="category__artwork"><?php echo esc_html( $award['bp_award_title'] ); ?></p>
							<p class="category__artist"><?php echo esc_html( $award['bp_award_artist'] ); ?></p>
							<p class="category__size"><?php echo esc_html( $award['bp_award_size'] ); ?></p>
							<p class="category__technique"><?php echo esc_html( $award['bp_award_technique'] ); ?></p>
						</div>

						<?php

					endforeach;
				endif; 
				?>
				
				<p><?php echo esc_html( carbon_get_the_post_meta( 'bp_award_mentions' ) ); ?></p>
				<p><?php echo esc_html( carbon_get_the_post_meta( 'bp_award_selected' ) ); ?></p>
				<p><?php echo esc_html( carbon_get_the_post_meta( 'bp_award_edition' ) ); ?></p>

			<?php 
			endif;
		endif;
		?>
		
		<?php
		// the_content(
		// 	sprintf(
		// 		wp_kses(
		// 			/* translators: %s: Name of current post. Only visible to screen readers */
		// 			__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'britaprinz-theme' ),
		// 			array(
		// 				'span' => array(
		// 					'class' => array(),
		// 				),
		// 			)
		// 		),
		// 		wp_kses_post( get_the_title() )
		// 	)
		// );

		// wp_link_pages(
		// 	array(
		// 		'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'britaprinz-theme' ),
		// 		'after'  => '</div>',
		// 	)
		// );
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php 
			// britaprinz_theme_entry_footer(); 
		?>
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
