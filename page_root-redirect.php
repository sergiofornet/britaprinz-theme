<?php
/**
 * Template Name: Root redirect
 *
 * Template for home page redirection
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

wp_safe_redirect( home_url() );
exit;
