<?php
/**
 * Template part for displaying exhibition content in page_*****-exhibition.php
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_template_part( 'template-parts/nav/secondary', '', 'event-menu' );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php
	$bpa_theme_date_query = new WP_Query( $args );
	
	if ( $bpa_theme_date_query->have_posts() ) : 
		$bpa_theme_event_years = array();
		foreach ( $bpa_theme_date_query->get_posts() as $bpa_theme_event ) :
			$bpa_theme_event_year = date( 'Y', strtotime( carbon_get_post_meta( $bpa_theme_event->ID, 'bp_event_start' ) ) );
			if ( ! $bpa_theme_event_year ) {
				continue;
			}

			$bpa_theme_event_years[ $bpa_theme_event_year ][] = $bpa_theme_event; 
		endforeach;
		?>

		<header class="entry-header">

			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

		</header><!-- .entry-header -->
		<div class="entry-content">
			<ul class="events">

			<?php foreach ( $bpa_theme_event_years as $bpa_theme_event_year => $bpa_theme_events ) : ?>

				<li class="year">
					<span class="year__label">

						<?php echo esc_html( $bpa_theme_event_year ); ?>

					</span>
					<ul class="year__events">

						<?php foreach ( $bpa_theme_events as $bpa_theme_event ) : ?>

							<li class="event">
								<a href="<?php echo esc_url( get_permalink( $bpa_theme_event->ID ) ); ?>" title="<?php echo esc_attr( get_the_title( $bpa_theme_event->ID ) ); ?>">
									<div class="event__title">

										<?php
										echo esc_html( get_the_title( $bpa_theme_event->ID ) );
										?>

									</div>
									<div class="event__artist">

										<?php echo esc_html( carbon_get_post_meta( $bpa_theme_event->ID, 'bp_event_artist' ) ); ?>

									</div>
									<div class="event__date">

										<?php
										echo sprintf( 
											'%s–%s', 
											esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_post_meta( $bpa_theme_event->ID, 'bp_event_start' ) ) ) ), 
											esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_post_meta( $bpa_theme_event->ID, 'bp_event_end' ) ) ) )
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
			if ( $bpa_theme_date_query->query_vars['paged'] ) :
				?>

				<?php
				get_template_part(
					'template-parts/events/event',
					'navigation',
					array(
						'date_query' => $bpa_theme_date_query,
						'order'      => $args['order'],
					)
				);
				?>

				<?php
			endif;
			?>

		</div><!-- .entry-content -->

		<?php
		$bpa_theme_date_query->wp_reset_postdata();
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
	?>

</article><!-- #post-<?php the_ID(); ?> -->
