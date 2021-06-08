<?php
/**
 * Template part for displaying artwork pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

$bpa_theme_event_post_type = get_post_type();

if ( is_singular() ) :
	get_template_part( 'template-parts/nav/secondary', '', "{$bpa_theme_event_post_type}-menu" );
endif;

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php get_template_part( 'template-parts/events/event', '' ); ?>

</article><!-- #post-<?php the_ID(); ?> -->
