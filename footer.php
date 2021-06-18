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
