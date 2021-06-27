<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Brita_Prinz_Theme
 */

$social  = carbon_get_theme_option( 'bp_theme_social' );
$links = carbon_get_theme_option( 'bp_theme_footer_links' );
$footer_links = array();
foreach( $links as $link ) {
	$link_id = $link['bp_theme_footer_links_list'][0]['id'];
	$footer_links[] = array(
		'url'   => get_the_permalink($link_id),
		'title' => get_the_title($link_id),
	);
}
$contact = carbon_get_theme_option( 'bp_theme_contact' );
?>

	<footer id="colophon" class="site-footer">
		<div class="footer-info">
			<div class="footer-info__title">

				<?php echo esc_html( bloginfo( 'name' ) ); ?>

			</div>
			<address class="footer-info__address">

				<?php echo wpautop( esc_html( $contact ) ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			</address>
		</div><!-- .site-info -->
		<div class="footer-links">

			<?php
			if ( $footer_links ) :
				foreach ( $footer_links as $footer_link ) :
					?>

					<div class="footer-links__link">
						<a href="<?php echo esc_url( $footer_link['url'] ); ?>" title="<?php echo esc_html__( $footer_link['title'], 'britaprinz-theme' ); ?>"><?php echo esc_html__( $footer_link['title'], 'britaprinz-theme' ); ?></a>
					</div>

					<?php
				endforeach;
			endif;
			?>
		</div><!-- .footer-links -->
		<div class="footer__social-links">
			<ul>

				<?php 
				foreach ( $social as $social_item ) :
					?>
		
					<li class="social-links__item social-links__item--<?php echo esc_attr( $social_item['bp_theme_social_label'] ); ?>">
						<a href="<?php echo esc_url( $social_item['bp_theme_social_url'] ); ?>" target="_blank" rel="noopener noreferrer" title="<?php echo esc_attr( $social_item['bp_theme_social_label'] ); ?>">
			
							<?php get_template_part( 'template-parts/svg/bpa', "icon-{$social_item['bp_theme_social_label']}" ); ?>
		
							<span class="screen-reader-text"><?php echo esc_html( $social_item['bp_theme_social_label'] ); ?></span>
						</a>
					</li>
		
					<?php
				endforeach;
				?>

			</ul>
		</div><!-- .social-links -->
	</footer><!-- #colophon -->
</div><!-- #page -->


<?php

do_action( 'bpa_theme_gallery_markup' ); ?>

<?php wp_footer(); ?>

</body>
</html>
