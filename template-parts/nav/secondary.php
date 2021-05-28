<?php
/**
 * Template part for secondary navs
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

// $args -> menu theme location passed in by get_template_part 
if ( 'undefined' !== $args && has_nav_menu( $args ) ) :
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
endif;

