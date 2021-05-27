<?php
/**
 * Template part for secondary navs
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

if ( 'undefined' !== $args ) {
	?>

	<nav class="secondary">

		<?php 
		wp_nav_menu(
			array(
				'theme_location'  => $args,
				'container_class' => "menu-{$args}-container",
				'menu_class'      => 'sidebar-menu',
			)
		);
		?>

	</nav>

	<?php
}

