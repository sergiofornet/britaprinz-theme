<?php
/**
 * Template part for displaying exhibition content in page_current-exhibition.php
 *
 * @package Brita_Prinz_Theme
 */

// Secondary nav
get_template_part( 'template-parts/nav/secondary', '', 'event-menu' ); 

// Event template
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

		<?php
		$date_query = new WP_Query( $args );
		
		if ( $date_query->have_posts() ) :
			?>

			<?php
			while ( $date_query->have_posts() ) :
				
				$date_query->the_post();
				
				get_template_part( 'template-parts/events/event', '' );

			endwhile; // End of the loop.

			
		else:
			?>
			<div class="entry-content">

				<?php
				echo apply_filters( 'the_content', ( britaprinz_get_i18n_theme_option( 'bp_event_none' ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>

			</div>
			
			<?php
		endif;
		$date_query->wp_reset_postdata();
		?>

</article><!-- #post-<?php the_ID(); ?> -->
