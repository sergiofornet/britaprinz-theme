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
		wp_nav_menu(
			array(
				'container'            => 'nav',
				'container_id'         => "{$args}-container",
				'container_class'      => "{$args}-container secondary-navigation",
				'container_aria_label' => 'Secondary navigation',
				'menu_id'              => "{$args}",
				'menu_class'           => "{$args} menu nav-menu",
				'fallback_cb'          => false,
				'walker'               => new Bpa_Theme_Walker_Nav_Menu(),
				'theme_location'       => $args,
			)
		);
endif;
