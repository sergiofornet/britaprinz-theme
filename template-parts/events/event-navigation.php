<?php
/**
 * Template part for displaying exhibition navigation
 *
 * @package Brita_Prinz_Theme
 */

$bpa_theme_date_query = $args['date_query'];
$bpa_theme_order      = $args['order'];

add_action(
	'bpa_theme_events_navigation',
	// phpcs:ignore PHPCompatibility.FunctionDeclarations.NewClosure.Found
	function() use ( $bpa_theme_date_query, $bpa_theme_order ) {
		?>

		<nav class="navigation posts-navigation" role="navigation" aria-label="Posts navigation">
			<h2 class="screen-reader-text">Posts navigation</h2>
			<div class="nav-links">

				<?php
				if ( 'DESC' === $bpa_theme_order ) :
					add_filter( 'next_posts_link_attributes', 'bpa_theme_previous_posts_link_attributes' );
					add_filter( 'previous_posts_link_attributes', 'bpa_theme_next_posts_link_attributes' );
					?>

					<div class="nav-previous">

						<?php
						next_posts_link( __( 'Anterior', 'britaprinz-theme' ), $bpa_theme_date_query->max_num_pages );
						?>

					</div>
					<div class="nav-next">

						<?php
						previous_posts_link( __( 'Siguiente', 'britaprinz-theme' ) );
						?>
					</div>	

					<?php
				else :
					add_filter( 'next_posts_link_attributes', 'bpa_theme_next_posts_link_attributes' );
					add_filter( 'previous_posts_link_attributes', 'bpa_theme_previous_posts_link_attributes' );
					?>

					<div class="nav-previous">	

						<?php
						previous_posts_link( __( 'Anterior', 'britaprinz-theme' ) );
						?>

					</div>
					<div class="nav-next">
	
						<?php
						next_posts_link( __( 'Siguiente', 'britaprinz-theme' ), $bpa_theme_date_query->max_num_pages );
						?>

				</div>

				<?php endif; ?>

			</div>
		</nav><!-- .events-navigation -->
		<?php
	}, 
	10,
	2
);
