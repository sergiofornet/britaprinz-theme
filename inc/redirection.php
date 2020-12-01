<?php
/**
 * Brita Prinz Theme redirections.
 * 
 * @package Brita_Prinz_Theme
 */
if ( ! function_exists( 'britaprinz_redirect' ) ) {
	function britaprinz_redirect() {
		if ( is_tax( 'artist' ) ) {
			$term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) );
			$slug = $term->slug;
			wp_redirect( esc_url_raw( get_post_type_archive_link( 'artwork' ) . $slug ), 301 );
		}
	}
}
add_action( 'template_redirect', 'britaprinz_redirect' );

/**
 * Redirect nonexistent artist queries to Artwork archive page
 */
function britaprinz_artwork_redirect( $query_var, $artist_id ) {
	if ( $query_var && !$artist_id ) {
		wp_redirect( esc_url_raw( get_post_type_archive_link( 'artwork' ) ), 301 );
	}
}
add_action( 'artwork_redirect', 'britaprinz_artwork_redirect', 10, 2 );