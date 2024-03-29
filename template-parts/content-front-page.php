<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

wp_nav_menu(
	array(
		'theme_location'  => 'home-menu',
		'menu_id'         => 'home-menu',
		'menu_class'      => 'menu home-menu',
		'container'       => 'nav',
		'container_class' => 'container--home-menu',
	)
);

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="entry-content circle-container">

		<?php the_content(); ?>

		<div class="circle">

				<?php 
				$bpa_theme_featured_content = carbon_get_the_post_meta( 'bp_home_featured' );

				foreach ( $bpa_theme_featured_content as $bpa_theme_content ) :

					if ( $bpa_theme_content['bp_home_featured_post'] ) :
						$bpa_theme_content_url   = get_permalink( $bpa_theme_content['bp_home_featured_post'][0]['id'] );
						$bpa_theme_content_label = $bpa_theme_content['bp_home_featured_label'] ?
							$bpa_theme_content['bp_home_featured_label'] :
							get_the_title( $bpa_theme_content['bp_home_featured_post'][0]['id'] );
						?>

						<div class="circle__item">

							<?php
							echo sprintf(
								'<a href="%s">%s</a>',
								esc_url( $bpa_theme_content_url ),
								esc_html( $bpa_theme_content_label )
							);
							?>

						</div>

						<?php
					endif;

				endforeach;
				?>

		</div>
	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
