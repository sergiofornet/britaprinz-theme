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
		<div class="site-info">
			<div>

				<?php echo esc_html( bloginfo( 'name' ) ); ?>

			</div>
			<address>

				<?php echo wpautop( esc_html( $contact ) ); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			</address>
		</div><!-- .site-info -->
		<div class="social-links">
			<ul>

				<?php 
				foreach ( $social as $social_item ) :
					printf( 
						'<li><a href="%1$s" class="" target="_blank" rel="noopener noreferrer" title="%2$s">%2$s</a></li>', 
						esc_url( $social_item['bp_theme_social_url'] ),
						esc_html( $social_item['bp_theme_social_label'] )
					);
				endforeach;
				?>

			</ul>
		</div><!-- .social-links -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
