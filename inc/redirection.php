<?php
/**
 * Brita Prinz Theme redirections.
 * 
 * @package Brita_Prinz_Theme
 */
if ( ! function_exists( 'bp_redirect' ) ) {
	function bp_redirect() {
		if ( is_singular( 'artwork' ) ) {
			wp_redirect( get_post_type_archive_link( 'artwork' ), 301 );
		}

		if ( is_tax( 'artist' ) ) {
			$term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) );
			$slug = $term->slug;
			wp_redirect( esc_url_raw( get_post_type_archive_link( 'artwork' ) . $slug ), 301 );
		}
	}
}

add_action( 'template_redirect', 'bp_redirect' );