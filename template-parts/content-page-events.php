<?php
/**
 * Template part for displaying exhibition content in page_*****-exhibition.php
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php get_template_part( 'template-parts/nav/secondary', '', 'event-menu' ); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php
	$date_query = new WP_Query( $args );
	
	if ( $date_query->have_posts() ) : 
		$event_years = array();
		foreach ( $date_query->get_posts() as $event ) :
			$event_year = date( 'Y', strtotime( carbon_get_post_meta( $event->ID, 'bp_event_start' ) ) );
			if ( !$event_year ) {
				continue;
			}
			$event_years[ $event_year ][] = $event; 
		endforeach;
		?>

		<header class="entry-header">
	
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	
		</header><!-- .entry-header -->
		<div class="entry-content">
			<ul class="events">

			<?php foreach ( $event_years as $event_year => $events ) : ?>
				<li class="year">
					<span class="year__label"><?php echo $event_year; ?></span>
					<ul class="year__events">
						<?php foreach ( $events as $event ) : ?>
							<li class="event">
								<a href="<?php echo esc_url( get_permalink( $event->ID ) ); ?>" title="<?php echo esc_attr( get_the_title( $event->ID ) ) ?>">
									<div class="event__title">

										<?php
										echo esc_html( get_the_title( $event->ID ) );
										?>

									</div>
									<div class="event__artist">
									
										<?php echo esc_html( carbon_get_post_meta( $event->ID, 'bp_event_artist' ) ); ?>

									</div>
									<div class="event__date">

										<?php
											echo sprintf( 
												'%s–%s', 
												esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_post_meta( $event->ID, 'bp_event_start' ) ) ) ), 
												esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_post_meta( $event->ID, 'bp_event_end' ) ) ) )
											);
										?>

									</div>
								</a>
							</li><!-- .event -->

						<?php endforeach; ?>

					</ul>
				</li>

				<?php endforeach; // End of the loop. ?>

			</ul><!-- .events -->

			<?php
			if ( $date_query->query_vars['paged'] ) :
				?>

				<?php
				get_template_part( 'template-parts/events/event', 'navigation', array( 'date_query' => $date_query, 'order' => $args['order'] ) );
				?>

				<?php
			endif;
			?>

		</div><!-- .entry-content -->

		<?php
		$date_query->wp_reset_postdata();
	else :
		?>

		<div class="entry-content">
		
			<?php
			echo apply_filters( 'the_content', ( britaprinz_get_i18n_theme_option( 'bp_event_none' ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		
		</div>

		<?php
	endif;
	?>

</article><!-- #post-<?php the_ID(); ?> -->
