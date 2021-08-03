<?php
/**
 * Template part for displaying exhibition content in page_current-exhibition.php
 *
 * @package Brita_Prinz_Theme
 */

// Secondary nav.
get_template_part( 'template-parts/nav/secondary', '', 'event-menu' ); 

// Event template.
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

		<?php
		$bpa_theme_date_query = new WP_Query( $args );
		
		if ( $bpa_theme_date_query->have_posts() ) :
			?>

			<?php
			while ( $bpa_theme_date_query->have_posts() ) :
				
				$bpa_theme_date_query->the_post();
				
				get_template_part( 'template-parts/events/event', '' );

			endwhile; // End of the loop.

			
		else :
			?>
			<div class="entry-content">

				<?php
				echo wp_kses_post(
					apply_filters(
						'the_content', // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
						bpa_theme_get_i18n_theme_option( 'bp_event_none' )
					)
				);
				?>

			</div>

			<?php
		endif;
		$bpa_theme_date_query->wp_reset_postdata();
		?>

</article><!-- #post-<?php the_ID(); ?> -->
