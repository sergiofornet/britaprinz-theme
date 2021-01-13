<?php
/**
 * Template part for displaying exhibition content in page_*****-exhibition.php
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

		$date_query = new WP_Query( $args );

		if ( $date_query->have_posts() ) :
			?>

			<ul class="events">
			
			<?php
			while ( $date_query->have_posts() ) :
				
				$date_query->the_post();
				?>
				
				<li class="event">
					<div class="event__title">

						<?php 
						the_title( 
							sprintf(
								'<a href="%s" title="%s">',
								esc_url( get_the_permalink() ),
								esc_html( get_the_title() ),
								esc_html( carbon_get_the_post_meta( 'bp_event_artist' ) ) 
							), 
							sprintf(
								' – %s</a>',
								esc_html( carbon_get_the_post_meta( 'bp_event_artist' ) ) 
							) 
						);
						?>
					
					</div>
					<div class="event__date">
						<?php
							echo sprintf( 
								'%s–%s', 
								esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_the_post_meta( 'bp_event_start' ) ) ) ), 
								esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_the_post_meta( 'bp_event_end' ) ) ) )
							);
						?>
					</div>
				</li><!-- .event -->

				<?php
			endwhile; // End of the loop.

			?>

			</ul><!-- .events -->

			<?php
			wp_reset_postdata();

		endif;

		?>
	</div><!-- .entry-content -->

</article><!-- #post-<?php the_ID(); ?> -->
