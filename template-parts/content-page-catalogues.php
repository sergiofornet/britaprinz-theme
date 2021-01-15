<?php
/**
 * Template part for displaying catalogue links in page_catalogues.php
 *
 * @package Brita_Prinz_Theme
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php 

		the_content();

		$award_query = new WP_Query( $args );

		if ( $award_query->have_posts() ) :
			?>

			<ul>
			
			<?php
			while ( $award_query->have_posts() ) :
				
				$award_query->the_post();
				
				if ( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) :
				?>
					
					<li>

						<?php 
						the_title( sprintf(
							'<a href="%s" title="%s" target="_blank" rel="noopener noreferrer">',
							esc_url( wp_get_attachment_url( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) ),
							esc_html( get_the_title() )
						), '</a>');
						?>
						
					</li>

				<?php
				endif;
			endwhile; // End of the loop.

			?>

			</ul>

			<?php
			wp_reset_postdata();

		endif;

		?>
	</div><!-- .entry-content -->

</article><!-- #post-<?php the_ID(); ?> -->
