<?php
/**
 * The template for displaying the footer
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Brita_Prinz_Theme
 */

$bpa_theme_social       = carbon_get_theme_option( 'bp_theme_social' );
$bpa_theme_links        = bpa_theme_get_i18n_theme_option( 'bp_theme_footer_links' );
$bpa_theme_footer_links = array();
foreach ( $bpa_theme_links as $bpa_theme_link ) {
	$bpa_theme_link_id        = $bpa_theme_link['bp_theme_footer_links_list'][0]['id'];
	$bpa_theme_footer_links[] = array(
		'url'   => get_the_permalink( $bpa_theme_link_id ),
		'title' => get_the_title( $bpa_theme_link_id ),
	);
}

$bpa_theme_contact = carbon_get_theme_option( 'bp_theme_contact' );
?>

	<footer id="colophon" class="site-footer">
		<div class="footer-info">
			<div class="footer-info__title">

				<?php echo esc_html( bloginfo( 'name' ) ); ?>

			</div>
			<address class="footer-info__address">

				<?php echo wpautop( esc_html( $bpa_theme_contact ) ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			</address>
		</div><!-- .site-info -->
		<div class="footer-links">

			<?php
			if ( $bpa_theme_footer_links ) :
				foreach ( $bpa_theme_footer_links as $bpa_theme_footer_link ) :
					?>

					<div class="footer-links__link">

						<?php
						echo sprintf(
							'<a href="%1$s" title="%2$s">%3$s</a>',
							esc_url( $bpa_theme_footer_link['url'] ),
							esc_attr( $bpa_theme_footer_link['title'] ),
							esc_html( $bpa_theme_footer_link['title'] )
						)
						?>

					</div>

					<?php
				endforeach;
			endif;
			?>
		</div><!-- .footer-links -->
		<div class="footer__social-links">
			<ul>

				<?php 
				foreach ( $bpa_theme_social as $bpa_theme_social_item ) :
					?>

					<li class="social-links__item social-links__item--<?php echo esc_attr( $bpa_theme_social_item['bp_theme_social_label'] ); ?>">
						<a
							href="<?php echo esc_url( $bpa_theme_social_item['bp_theme_social_url'] ); ?>"
							target="_blank" rel="noopener noreferrer"
							title="<?php echo esc_attr( $bpa_theme_social_item['bp_theme_social_label'] ); ?>"
						>

							<?php get_template_part( 'template-parts/svg/bpa', "icon-{$bpa_theme_social_item['bp_theme_social_label']}" ); ?>

							<span class="screen-reader-text">

								<?php echo esc_html( $bpa_theme_social_item['bp_theme_social_label'] ); ?>

							</span>
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
do_action( 'bpa_theme_gallery_markup' ); 
wp_footer();
?>

</body>
</html>
