<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Brita_Prinz_Theme
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function britaprinz_theme_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'britaprinz_theme_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function britaprinz_theme_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'britaprinz_theme_pingback_header' );

/**
 * Get i18n theme option
 * 
 * @param String $option_name Field name.
 * @return any Field content
 */
function britaprinz_get_i18n_theme_option( $option_name ) {
	$suffix = britaprinz_get_i18n_suffix();
	return carbon_get_theme_option( $option_name . $suffix );
}

/**
 * Disable support for comments and trackbacks in post types.
 */ 
function britaprinz_disable_comments_post_types_support() {
	$post_types = get_post_types();
	foreach ( $post_types as $post_type ) {
		if ( post_type_supports( $post_type, 'comments' ) ) {
			remove_post_type_support( $post_type, 'comments' );
			remove_post_type_support( $post_type, 'trackbacks' );
		}
	}
}
add_action( 'admin_init', 'britaprinz_disable_comments_post_types_support' );

/**
 * Close comments on the front-end.
 */ 
function britaprinz_disable_comments_status() {
	return false;
}
add_filter( 'comments_open', 'britaprinz_disable_comments_status', 20, 2 );
add_filter( 'pings_open', 'britaprinz_disable_comments_status', 20, 2 );

/**
 * Hide existing comments.
 * 
 * @param Array $comments Comments array.
 */ 
function britaprinz_disable_comments_hide_existing_comments( $comments ) {
	$comments = array();
	return $comments;
}
add_filter( 'comments_array', 'britaprinz_disable_comments_hide_existing_comments', 10, 2 );

/**
 * Remove comments page in menu.
 */
function britaprinz_disable_comments_admin_menu() {
	remove_menu_page( 'edit-comments.php' );
}
add_action( 'admin_menu', 'britaprinz_disable_comments_admin_menu' );

/**
 * Remove comments page in admin bar.
 */
function britaprinz_disable_admin_bar_comments() {
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu( 'comments' );
}
add_action( 'wp_before_admin_bar_render', 'britaprinz_disable_admin_bar_comments' );

/**
 * Redirect any user trying to access comments page.
 */
function britaprinz_disable_comments_admin_menu_redirect() {
	global $pagenow;

	if ( 'edit-comments.php' === $pagenow ) {
		wp_redirect( admin_url() );
		exit;
	}
}
add_action( 'admin_init', 'britaprinz_disable_comments_admin_menu_redirect' );

/**
 * Remove comments metabox from dashboard.
 */
function britaprinz_disable_comments_dashboard() {
	remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
}
add_action( 'admin_init', 'britaprinz_disable_comments_dashboard' );

/**
 * Remove comments links from admin bar.
 */
function britaprinz_disable_comments_admin_bar() {
	if ( is_admin_bar_showing() ) {
		remove_action( 'admin_bar_menu', 'wp_admin_bar_comments_menu', 60 );
	}
}
add_action( 'init', 'britaprinz_disable_comments_admin_bar' );

/**
 * Disable html in comments.
 */
add_filter( 'pre_comment_content', 'esc_html' );

/**
 * Remove meta tags from wp_header.
 */
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );

/**
 * Remove RSS feeds.
 */
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'feed_links_extra', 3 );

/**
 * Disable login hints.
 */
function britaprinz_login_errors() {
	return 'nop';
}
add_filter( 'login_errors', 'britaprinz_login_errors' );

/** 
 * Disable url guess.
 * 
 * @param String $url URL.
 */
function britaprinz_stop_guessing( $url ) {
	if ( is_404() ) {
		return false;
	}
	return $url;
}
add_filter( 'redirect_canonical', 'britaprinz_stop_guessing' );

/**
 * Remove WP emojis.
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

/**
 * Disable access to author pages
 */
function britaprinz_disable_author_page() {
	global $wp_query;
	
	if ( is_author() ) {
		// Show a 404 page.
		$wp_query->set_404();
		status_header( 404 );

	}
}
add_action( 'template_redirect', 'britaprinz_disable_author_page' );

/**
 * Modify default queries
 * 
 * @param WPQuery $query WP Query.
 */
function britaprinz_modify_queries( $query ) {
	if ( ! is_admin() && $query->is_main_query() && is_post_type_archive( 'award' ) ) {
		$query->set( 'posts_per_page', -1 );
		$query->set( 'order', 'DESC' );
		$query->set( 'orderby', 'date' );
		$query->set( 
			'meta_query',
			array(
				'date' => array(
					'key' => 'bp_award_edition',
				),
			)
		);
	}
		
	if ( is_post_type_archive( 'project' ) ) {
		$query->set( 'order', 'ASC' );
		$query->set( 'orderby', 'title' );
		$query->set( 'posts_per_page', 15 );
		$query->set(
			'paged',
			get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1
		);
	}
		
	if ( is_post_type_archive( 'artwork' ) ) {
		$query->set( 'order', 'ASC' );
		$query->set( 'orderby', 'title' );
	}
};
	
add_action( 'pre_get_posts', 'britaprinz_modify_queries' );

/**
 * Set Yoast metabox priority to 'low'
 */
function britaprinz_theme_yoast_priority() { 
	return 'low';
}

if ( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ) {
	add_filter( 'wpseo_metabox_prio', 'britaprinz_theme_yoast_priority' );
}

/**
 * Create Award winners menu subitem.
 * 
 * @return string $winners_output  An HTML string containing winners subitem.
 */
function britaprinz_theme_get_winners() {
	$winners_output = '<ul class="winners-submenu">';

	// Must use inside the loop.
	while ( have_posts() ) :
		the_post();

		$edition = esc_html( carbon_get_the_post_meta( 'bp_award_edition' ) );

		$edition_id      = esc_html( get_the_ID() );
		$edition_item    = "
		<li id='winners-item-{$edition_id}' class='edition-item edition-item--{$edition_id}'>
			<button class='edition-item__button' data-edition='{$edition_id}' data-active='false' aria-pressed='false'>{$edition}</button>
		</li>";
		$winners_output .= $edition_item;
		
	endwhile;

	$winners_output .= '</ul>';
	return $winners_output;
}

/**
 * Create Award catalogues menu subitem.
 * 
 * @return string $catalogues_output  An HTML string containnin catalogues subitem.
 */
function britaprinz_theme_get_catalogues() {
	$args = array(
		'post_type'  => 'award',
		'order'      => 'DESC',
		'orderby'    => 'edition',
		'meta_query' => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'edition' => array(
				'key' => 'bp_award_edition',
			),
		),
	);

	$award_query = new WP_Query( $args );

	$catalogues_output = '<ul class="catalogues-submenu">';
	while ( $award_query->have_posts() ) :
		$award_query->the_post();
		
		if ( carbon_get_the_post_meta( 'bp_award_catalogue' ) ) :

			$edition            = esc_html( get_the_title() );
			$edition_id         = esc_html( get_the_ID() );
			$catalogues_output .= "
				<li id='award-catalogue-{$edition_id}' class='edition-item edition-item--{$edition_id}'>
					<button class='edition-item__button' data-edition='{$edition_id}' data-active='false'>{$edition}</button>
				</li>
			";
		endif;
		
	endwhile; // End of the loop.

	$catalogues_output .= '</ul>';
	$award_query->wp_reset_postdata();

	return $catalogues_output;
}

/**
 * Modify archives titles
 * 
 * @param string $title - the archive title.
 * @return string $title  
 */
function britaprinz_theme_archive_title( $title ) {
	if ( is_category() ) {
		$title = single_cat_title( '', false );
	} elseif ( is_tag() ) {
		$title = single_tag_title( '', false );
	} elseif ( is_author() ) {
		$title = '<span class="vcard">' . get_the_author() . '</span>';
	} elseif ( is_post_type_archive() ) {
		$title = post_type_archive_title( '', false );
	} elseif ( is_tax() ) {
		$title = single_term_title( '', false );
	}

	return $title;
}
add_filter( 'get_the_archive_title', 'britaprinz_theme_archive_title' );

/**
 * Add attributes to next posts links
 * 
 * @return string next posts link attributes  
 */
function bpa_theme_next_posts_link_attributes() {
	return 'class="next"';
}

/**
 * Add attributes to previous posts links
 * 
 * @return string previous posts link attributes  
 */
function bpa_theme_previous_posts_link_attributes() {
	return 'class="previous"';
}
