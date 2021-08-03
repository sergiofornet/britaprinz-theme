<?php
/**
 * Template part for displaying event info
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<header class="entry-header">
	<h1 class="entry-title event__title">

		<?php
		echo sprintf(
			/* translators: 1: event title, 2: artist */
			'"%1$s" - %2$s',
			esc_html( get_the_title() ),
			esc_html( carbon_get_the_post_meta( 'bp_event_artist' ) ) 
		);
		?>

	</h1>
	<p class="event__date">

		<?php
		echo sprintf( 
			'<span>%s</span> – <span>%s</span>', 
			esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_the_post_meta( 'bp_event_start' ) ) ) ), 
			esc_html( date_i18n( __( 'd F Y', 'britaprinz-theme' ), strtotime( carbon_get_the_post_meta( 'bp_event_end' ) ) ) )
		);
		?>

	</p>
</header><!-- .event-header -->
<div class="entry-content">
	<div class="event__info">

		<?php echo wp_kses_post( wpautop( carbon_get_the_post_meta( 'bp_event_info' ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

	</div>
	<figure class="event__featured-image">

		<?php
		the_post_thumbnail( 'large' );
		?>

		<figcaption><?php esc_html( the_post_thumbnail_caption() ); ?></figcaption>
	</figure>

	<?php the_content(); ?>

</div><!-- .entry-content -->
