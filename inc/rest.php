<?php
/**
 * Brita Prinz Theme REST config
 * 
 * @package Brita_Prinz_Theme
 */

/**
 * Set up artists search endpoint
 */
function britaprinz_artists_search_endpoint() {
	register_rest_route( 'britaprinz/v1', '/artists/search(?:/(?P<id>([a-zA-Z0-9]|%20)+)+)?', array(
		'methods'	=> WP_REST_Server::READABLE,
		'callback'	=> 'britaprinz_get_artists',
		'permission_callback' => '__return_true',
	) ); 
}
add_action( 'rest_api_init', 'britaprinz_artists_search_endpoint' );

/**
 * Set up artist search query
 * 
 * @return array|Error an array of terms or a 404 error if no terms found
 */
function britaprinz_get_artists( $request ) {
	$search = urldecode( $request['id'] );

	$args = array(
		'taxonomy'		=> 'artist',
		'orderby'		=> 'order_name',
		'order'			=> 'ASC',
		'hide_empty'	=> false,
		"name__like"	=> $search,
		'meta_query'	=> array(
			'order_name'	=> array(
				'key'		=> 'bp_artist_order_name',
				'compare'	=> 'EXISTS',
			),
		),
	);
	
	$query = new WP_Term_Query( $args );
	$terms = $query->terms;
	
	// Create new terms array with 'bp_artist_order_name' field in it.
	// Seems to work. 
	$updated_terms = [];
	foreach ( $terms as $term ) {
		$order = carbon_get_term_meta($term->term_id, 'bp_artist_order_name');
		$array_term = $term->to_array();
		$array_term['order'] = $order;
		$object_term = (object)$array_term;
		array_push( $updated_terms, $object_term );
	}
	
	if ( !empty( $updated_terms ) ) {
		return $updated_terms;
	}
	return new WP_Error( 'no_artist', __( 'Artista desconocido', 'britaprinz-theme' ), array( 'status' => 404 ) );
}

/**
 * Register REST fields
 */
function britaprinz_artworks_rest_fields() {
	register_rest_field( 'artwork', 'artwork_image_src', array(
		'get_callback'		=> 'britaprinz_rest_image',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_image_gallery', array(
		'get_callback'		=> 'britaprinz_rest_gallery',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_techniques', array(
		'get_callback'		=> 'britaprinz_rest_techniques',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_loan', array(
		'get_callback'		=> 'britaprinz_rest_loan',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_sale', array(
		'get_callback'		=> 'britaprinz_rest_sale',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artwork', 'artwork_info', array(
		'get_callback'		=> 'britaprinz_rest_info',
		'update_callback'	=> null,
		'schema'			=> null,
	) );

	register_rest_field( 'artist', 'artist_bio', array(
		'get_callback'		=> 'britaprinz_artist_bio',
		'update_callback'	=> null,
		'schema'			=> null,
	) );
}
add_action( 'rest_api_init', 'britaprinz_artworks_rest_fields' );

/**
 * Add artwork featured image
 * 
 * @return string html image element
 */
function britaprinz_rest_image( $object, $field_name, $request ) {
	$image = wp_get_attachment_image( $object['featured_media'], 'full' );
	return $image;
}

/**
 * Add artwork image gallery
 * 
 * @return array an array of html image elements
 */
function britaprinz_rest_gallery( $object, $field_name, $request ) {
	$gallery_ids = carbon_get_post_meta( $object['id'], 'bp_artwork_gallery' );
	$gallery = [];
	foreach ( $gallery_ids as $id ) {
		$gallery[] = ( wp_get_attachment_image( $id, 'full' ) );
	}

	return $gallery;
}

/**
 * Add artwork techniques
 * 
 * @return array an array 
 */
function britaprinz_rest_techniques( $object, $field_name, $request ) {
	$techniques = carbon_get_post_meta( $object['id'], 'bp_artwork_technique' );
	$featured_techniques = [];
	$other_techniques =  '';
	foreach ( $techniques as $technique_item ) {
		foreach ( $technique_item['bp_artwork_technique_list'] as $technique ) {
			
			$featured_techniques[] = [esc_html( get_the_title( $technique['id'] ) ), esc_url( get_permalink( $technique['id'] ) )];
		}
		
		$other_techniques = $technique_item['bp_artwork_technique_other'] ? 
			esc_html( $technique_item['bp_artwork_technique_other'] ) : '';
	}
	return array(
		'featured_techniques' => $featured_techniques,
		'other_techniques' => $other_techniques,
	);
}

/**
 * Add artwork loan field
 * 
 * @return string a translatable string
 */
function britaprinz_rest_loan( $object, $field_name, $request ) {
	$loan = carbon_get_post_meta( $object['id'], 'bp_artwork_loan' );
	if ( $loan ) {
		$loan_string = __( 'Disponible para préstamo', 'britaprinz-theme' );
		return $loan_string;
	}
}

/**
 * Add artwork sale field
 * 
 * @return string a translatable string
 */
function britaprinz_rest_sale( $object, $field_name, $request ) {
	$sale = carbon_get_post_meta( $object['id'], 'bp_artwork_sale' );
	if ($sale) {
		$sale_string = __( 'Disponible para venta', 'britaprinz-theme' );
		return $sale_string;
	}
}

/**
 * Add artwork info field
 * 
 * @return string HTML content
 */
function britaprinz_rest_info( $object, $field_name, $request ) {
	$info = wpautop( carbon_get_post_meta( $object['id'], 'bp_artwork_info' ) );
	if ( $info ) {
		return $info;
	}
}

/**
 * Add artist bio field
 * 
 * @return string HTML content
 */
function britaprinz_artist_bio( $object, $field_name, $request ) {
	$bio = wpautop( get_term( $object['id'] )->description );
	if ( $bio ) {
		return $bio;
	}
}