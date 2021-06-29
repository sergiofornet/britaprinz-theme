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
	register_rest_route( 
		'britaprinz/v1',
		'/artists/search(?:/(?P<id>([a-zA-Z0-9]|%20)+)+)?',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'britaprinz_get_artists',
			'permission_callback' => '__return_true',
		)
	); 
}
add_action( 'rest_api_init', 'britaprinz_artists_search_endpoint' );

/**
 * Set up artist search query
 * 
 * @param String $request Requested URL.
 * @return array|Error an array of terms or a 404 error if no terms found
 */
function britaprinz_get_artists( $request ) {
	$search = urldecode( $request['id'] );

	$args = array(
		'taxonomy'   => 'artist',
		'orderby'    => 'order_name',
		'order'      => 'ASC',
		'hide_empty' => false,
		'name__like' => $search,
		'meta_query' => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'order_name' => array(
				'key'     => 'bp_artist_order_name',
				'compare' => 'EXISTS',
			),
		),
	);
	
	$query = new WP_Term_Query( $args );
	$terms = $query->terms;
	
	// Create new terms array with 'bp_artist_order_name' field in it.
	// Seems to work. 
	$updated_terms = array();
	foreach ( $terms as $term ) {
		$order               = carbon_get_term_meta( $term->term_id, 'bp_artist_order_name' );
		$array_term          = $term->to_array();
		$array_term['order'] = $order;
		$object_term         = (object) $array_term;
		array_push( $updated_terms, $object_term );
	}
	
	if ( ! empty( $updated_terms ) ) {
		return $updated_terms;
	}
	return new WP_Error( 'no_artist', __( 'Artista desconocido', 'britaprinz-theme' ), array( 'status' => 404 ) );
}

/**
 * Register REST fields
 */
function britaprinz_rest_fields() {
	register_rest_field(
		'artwork',
		'bp_artwork_year',
		array(
			'get_callback'    => 'britaprinz_artwork_year',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'bp_artwork_copy',
		array(
			'get_callback'    => 'britaprinz_artwork_copy',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'bp_artwork_paper',
		array(
			'get_callback'    => 'britaprinz_artwork_paper',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'bp_artwork_condition',
		array(
			'get_callback'    => 'britaprinz_artwork_condition',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'bp_artwork_size',
		array(
			'get_callback'    => 'britaprinz_artwork_size',
			'update_callback' => null,
			'schema'          => null,
		) 
	);


	register_rest_field(
		'artwork',
		'bp_artwork_size_image',
		array(
			'get_callback'    => 'britaprinz_artwork_size_image',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'artwork_image_src',
		array(
			'get_callback'    => 'britaprinz_artwork_image',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'artwork_image_gallery',
		array(
			'get_callback'    => 'britaprinz_artwork_gallery',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'artwork_techniques',
		array(
			'get_callback'    => 'britaprinz_artwork_techniques',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'artwork_loan',
		array(
			'get_callback'    => 'britaprinz_artwork_loan',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'artwork_sale',
		array(
			'get_callback'    => 'britaprinz_artwork_sale',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artwork',
		'artwork_info',
		array(
			'get_callback'    => 'britaprinz_artwork_info',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'artist',
		'artist_bio',
		array(
			'get_callback'    => 'britaprinz_artist_bio',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'award',
		'award_catalogue',
		array(
			'get_callback'    => 'britaprinz_award_catalogue',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'award',
		'award',
		array(
			'get_callback'    => 'britaprinz_award',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'award',
		'award_se',
		array(
			'get_callback'    => 'britaprinz_award_special_edition',
			'update_callback' => null,
			'schema'          => null,
		) 
	);

	register_rest_field(
		'award',
		'award_catalog_gallery',
		array(
			'get_callback'    => 'britaprinz_award_catalog_gallery',
			'update_callback' => null,
			'schema'          => null,
		) 
	);
}
add_action( 'rest_api_init', 'britaprinz_rest_fields' );

/**
 * Add artwork year
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string Artwork year.
 */
function britaprinz_artwork_year( $object, $field_name, $request ) {
	$year = esc_html( carbon_get_post_meta( $object['id'], 'bp_artwork_year' ) );
	return $year;
}

/**
 * Add artwork copy
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string Artwork copy.
 */
function britaprinz_artwork_copy( $object, $field_name, $request ) {
	$copy = esc_html( carbon_get_post_meta( $object['id'], 'bp_artwork_copy' ) );
	return $copy;
}

/**
 * Add artwork paper
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string Artwork paper.
 */
function britaprinz_artwork_paper( $object, $field_name, $request ) {
	$paper = esc_html( carbon_get_post_meta( $object['id'], 'bp_artwork_paper' ) );
	return $paper;
}

/**
 * Add artwork condition
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string Artwork condition.
 */
function britaprinz_artwork_condition( $object, $field_name, $request ) {
	$condition = esc_html( carbon_get_post_meta( $object['id'], 'bp_artwork_condition' ) );
	return $condition;
}

/**
 * Add artwork size
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string Artwork size.
 */
function britaprinz_artwork_size( $object, $field_name, $request ) {
	$size = esc_html( carbon_get_post_meta( $object['id'], 'bp_artwork_size' ) );
	return $size;
}

/**
 * Add artwork size image
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string Artwork size image.
 */
function britaprinz_artwork_size_image( $object, $field_name, $request ) {
	$size_image = esc_html( carbon_get_post_meta( $object['id'], 'bp_artwork_size_image' ) );
	return $size_image;
}

/**
 * Add artwork featured image
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string HTML image element.
 */
function britaprinz_artwork_image( $object, $field_name, $request ) {
	$image = wp_get_attachment_image( $object['featured_media'], 'artwork-thumbnail' );
	return $image;
}

/**
 * Add artwork image gallery
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return array An array of html image elements.
 */
function britaprinz_artwork_gallery( $object, $field_name, $request ) {
	$images_ids = carbon_get_post_meta( $object['id'], 'bp_artwork_gallery' );

	$gallery = $images_ids ? array_map(
		fn( $id ) => array(
			'image'   => wp_get_attachment_image( $id, 'full' ),
			'caption' => wp_get_attachment_caption( $id ),
		), 
		$images_ids
	) : null;

	return $gallery;
}

/**
 * Add artwork techniques
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return array An array of techniques.
 */
function britaprinz_artwork_techniques( $object, $field_name, $request ) {
	$techniques          = carbon_get_post_meta( $object['id'], 'bp_artwork_technique' );
	$featured_techniques = array();
	$other_techniques    = '';
	foreach ( $techniques as $technique_item ) {
		foreach ( $technique_item['bp_artwork_technique_list'] as $technique ) {
			
			$featured_techniques[] = array( 
				esc_html( get_the_title( $technique['id'] ) ),
				esc_url( get_permalink( $technique['id'] ) ),
			);
		}
		
		$other_techniques = $technique_item['bp_artwork_technique_other'] ? 
			esc_html( $technique_item['bp_artwork_technique_other'] ) : '';
	}
	return array(
		'featured_techniques' => $featured_techniques,
		'other_techniques'    => $other_techniques,
	);
}

/**
 * Add artwork loan field
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string A translatable string.
 */
function britaprinz_artwork_loan( $object, $field_name, $request ) {
	$loan = carbon_get_post_meta( $object['id'], 'bp_artwork_loan' );
	if ( $loan ) {
		$loan_string = __( 'Disponible para préstamo', 'britaprinz-theme' );
		return $loan_string;
	}
}

/**
 * Add artwork sale field
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string A translatable string.
 */
function britaprinz_artwork_sale( $object, $field_name, $request ) {
	$sale = carbon_get_post_meta( $object['id'], 'bp_artwork_sale' );
	if ( $sale ) {
		$sale_string = __( 'Disponible para venta', 'britaprinz-theme' );
		return $sale_string;
	}
}

/**
 * Add artwork info field
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string HTML content
 */
function britaprinz_artwork_info( $object, $field_name, $request ) {
	$info = wpautop( carbon_get_post_meta( $object['id'], 'bp_artwork_info' ) );
	if ( $info ) {
		return $info;
	}
}

/**
 * Add artist bio field
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string HTML content
 */
function britaprinz_artist_bio( $object, $field_name, $request ) {
	$bio = wpautop( carbon_get_term_meta( get_term( $object['id'] )->term_id, 'bp_artist_bio' ));
	if ( $bio ) {
		return $bio;
	}
}

/**
 * Add award catalogue url field
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string HTML content
 */
function britaprinz_award_catalogue( $object, $field_name, $request ) {
	$pdf = wp_get_attachment_url( carbon_get_post_meta( $object['id'], 'bp_award_catalogue' ) );
	if ( $pdf ) {
		return esc_url( $pdf );
	}
}

/**
 * Add award image field
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string HTML content
 */
function britaprinz_award( $object, $field_name, $request ) {
	$award = carbon_get_post_meta( $object['id'], 'bp_award' );
	foreach ( $award as &$prize ) {
		$prize_img_thumbnail               = wp_get_attachment_image( $prize['bp_award_image'], 'award-thumbnail' );
		$prize_img                         = wp_get_attachment_image( $prize['bp_award_image'], 'full' );
		$prize['bp_award_image_thumbnail'] = $prize_img_thumbnail;
		$prize['bp_award_image_rendered']  = $prize_img;
	}
	if ( $award ) {
		return $award;
	}
}

/**
 * Add award special editions
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return string HTML content
 */
function britaprinz_award_special_edition( $object, $field_name, $request ) {
	$is_special_edition = carbon_get_post_meta( $object['id'], 'bp_award_se_toggle' );
	if ( $is_special_edition ) {
		$award_se = carbon_get_post_meta( $object['id'], 'bp_award_se' );
		foreach ( $award_se as &$edition ) {
			$edition['bp_award_se_winners'] = wpautop( $edition['bp_award_se_winners'] );
		}
		return $award_se;
	}
}

/**
 * Add catalogue image gallery
 * 
 * @param Object $object Field content.
 * @param String $field_name Field name.
 * @param String $request Requested URL.
 * @return array An array of html image elements.
 */
function britaprinz_award_catalog_gallery( $object, $field_name, $request ) {
	$gallery_ids = carbon_get_post_meta( $object['id'], 'bp_award_catalog_gallery' );
	$gallery     = array();
	foreach ( $gallery_ids as $id ) {
		$gallery[] = ( wp_get_attachment_image( $id, 'full' ) );
	}

	return $gallery;
}
