<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function bpa_theme_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	// Adds a class of "contact" on contact pages.
	if ( true === is_page( array( 'contact', 'contacto' ) ) ) {
		$classes[] = 'contact';
	}

	return $classes;
}
add_filter( 'body_class', 'bpa_theme_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function bpa_theme_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'bpa_theme_pingback_header' );

/**
 * Get i18n theme option
 * 
 * @param String $option_name Field name.
 * @return any Field content
 */
function bpa_theme_get_i18n_theme_option( $option_name ) {
	$suffix = britaprinz_get_i18n_suffix();
	return carbon_get_theme_option( $option_name . $suffix );
}

/**
 * Disable support for comments and trackbacks in post types.
 */ 
function bpa_theme_disable_comments_post_types_support() {
	$post_types = get_post_types();
	foreach ( $post_types as $post_type ) {
		if ( post_type_supports( $post_type, 'comments' ) ) {
			remove_post_type_support( $post_type, 'comments' );
			remove_post_type_support( $post_type, 'trackbacks' );
		}
	}
}
add_action( 'admin_init', 'bpa_theme_disable_comments_post_types_support' );

/**
 * Close comments on the front-end.
 */ 
function bpa_theme_disable_comments_status() {
	return false;
}
add_filter( 'comments_open', 'bpa_theme_disable_comments_status', 20, 2 );
add_filter( 'pings_open', 'bpa_theme_disable_comments_status', 20, 2 );

/**
 * Hide existing comments.
 * 
 * @param Array $comments Comments array.
 */ 
function bpa_theme_disable_comments_hide_existing_comments( $comments ) {
	$comments = array();
	return $comments;
}
add_filter( 'comments_array', 'bpa_theme_disable_comments_hide_existing_comments', 10, 2 );

/**
 * Remove comments page in menu.
 */
function bpa_theme_disable_comments_admin_menu() {
	remove_menu_page( 'edit-comments.php' );
}
add_action( 'admin_menu', 'bpa_theme_disable_comments_admin_menu' );

/**
 * Remove comments page in admin bar.
 */
function bpa_theme_disable_admin_bar_comments() {
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu( 'comments' );
}
add_action( 'wp_before_admin_bar_render', 'bpa_theme_disable_admin_bar_comments' );

/**
 * Redirect any user trying to access comments page.
 */
function bpa_theme_disable_comments_admin_menu_redirect() {
	global $pagenow;

	if ( 'edit-comments.php' === $pagenow ) {
		wp_safe_redirect( admin_url() );
		exit;
	}
}
add_action( 'admin_init', 'bpa_theme_disable_comments_admin_menu_redirect' );

/**
 * Remove comments metabox from dashboard.
 */
function bpa_theme_disable_comments_dashboard() {
	remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
}
add_action( 'admin_init', 'bpa_theme_disable_comments_dashboard' );

/**
 * Remove comments links from admin bar.
 */
function bpa_theme_disable_comments_admin_bar() {
	if ( is_admin_bar_showing() ) {
		remove_action( 'admin_bar_menu', 'wp_admin_bar_comments_menu', 60 );
	}
}
add_action( 'init', 'bpa_theme_disable_comments_admin_bar' );

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
function bpa_theme_login_errors() {
	return 'nop';
}
add_filter( 'login_errors', 'bpa_theme_login_errors' );

/** 
 * Disable url guess.
 * 
 * @param String $url URL.
 */
function bpa_theme_stop_guessing( $url ) {
	if ( is_404() ) {
		return false;
	}
	return $url;
}
add_filter( 'redirect_canonical', 'bpa_theme_stop_guessing' );

/**
 * Remove WP emojis.
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

/**
 * Disable access to author pages
 */
function bpa_theme_disable_author_page() {
	global $wp_query;
	
	if ( is_author() ) {
		// Show a 404 page.
		$wp_query->set_404();
		status_header( 404 );

	}
}
add_action( 'template_redirect', 'bpa_theme_disable_author_page' );

/**
 * Modify default queries
 * 
 * @param WPQuery $query WP Query.
 */
function bpa_theme_modify_queries( $query ) {
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

	if ( ! is_admin() && $query->is_main_query() && is_post_type_archive( 'project' ) ) {
		$query->set(
			'orderby',
			array(
				'date'  => 'DESC',
				'title' => 'ASC',
			)
		);
		$query->set( 
			'meta_query',
			array(
				'date' => array(
					'key' => 'bp_project_date',
				),
			)
		);
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
	
add_action( 'pre_get_posts', 'bpa_theme_modify_queries' );

/**
 * Set Yoast metabox priority to 'low'
 */
function bpa_theme_yoast_priority() { 
	return 'low';
}

if ( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ) {
	add_filter( 'wpseo_metabox_prio', 'bpa_theme_yoast_priority' );
}

/**
 * Create Award winners menu subitem.
 * 
 * @return string $winners_output  An HTML string containing winners subitem.
 */
function bpa_theme_get_winners() {
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
function bpa_theme_get_catalogues() {
	$args = array(
		'post_type'      => 'award',
		'order'          => 'DESC',
		'orderby'        => 'edition',
		'posts_per_page' => -1, 
		'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
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

			$edition            = esc_html( carbon_get_the_post_meta( 'bp_award_edition' ) );
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
function bpa_theme_archive_title( $title ) {
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
add_filter( 'get_the_archive_title', 'bpa_theme_archive_title' );

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

/**
 * Return an array o allowed img attributes
 * 
 * @return array
 */
function bpa_theme_image_allowed_html() {
	return array(
		'img'    => array(
			'src'     => true,
			'srcset'  => true,
			'sizes'   => true,
			'class'   => true,
			'id'      => true,
			'width'   => true,
			'height'  => true,
			'alt'     => true,
			'align'   => true,
			'loading' => true,
		),
		'figure' => array(),
		'div'    => array(),
	);
}

/**
 * Add a full size image url via data attributes
 * 
 * @param Array $atts - an array of attribures.
 * @param Post  $attachment - An image post object.
 * @return $atts
 */
function bpa_theme_filter_gallery_attrs( $atts, $attachment ) {
	$full_size         = wp_get_attachment_image_src( $attachment->ID, 'full' );
	$atts['data-full'] = $full_size[0];
	return $atts;
}

/**
 * Disable search results and trigger a 404 error
 * 
 * @param String  $query - The search query.
 * @param Boolean $error - True if no search results.
 */
function bpa_theme_filter_query( $query, $error = true ) {
	if ( is_search() ) {
		$query->is_search       = false;
		$query->query_vars['s'] = false;
		$query->query['s']      = false;

		if ( true === $error ) {
			$query->is_404 = true;
		}
	}
}
add_action( 'parse_query', 'bpa_theme_filter_query' );
add_filter( 'get_search_form', '__return_null' );

/**
 * Disable search widget
 */
function bpa_theme_disable_search_widget() {
	unregister_widget( 'WP_Widget_Search' );
}
add_action( 'widgets_init', 'bpa_theme_disable_search_widget' );

/**
 * Add critical font preload
 */
function bpa_theme_font_preload() {
	?>

	<!-- Preload critical fonts -->
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/fonts/raleway-v22-latin-100.woff2" crossorigin="anonymous" as="font" type="font/woff2">
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/fonts/raleway-v22-latin-regular.woff2" crossorigin="anonymous" as="font" type="font/woff2">
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/fonts/raleway-v22-latin-300.woff2" crossorigin="anonymous" as="font" type="font/woff2">
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/fonts/raleway-v22-latin-500.woff2" crossorigin="anonymous" as="font" type="font/woff2">
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/fonts/raleway-v22-latin-600.woff2" crossorigin="anonymous" as="font" type="font/woff2">

	<?php
}
add_action( 'wp_head', 'bpa_theme_font_preload', 10 );

/**
 * Disable wpcf7 load globally and enable it only on contact pages.
 */ 
function bpa_theme_disable_wpcf7() {
	if ( false === is_page( array( 'contact', 'contacto' ) ) ) {
		add_filter( 'wpcf7_load_js', '__return_false' );
		add_filter( 'wpcf7_load_css', '__return_false' );
	}
}

add_action( 'wp', 'bpa_theme_disable_wpcf7' );

/**
 * Disable recaptcha scripts globally and enable them only on contact pages
 */
function bpa_theme_dequeue_recaptcha() {
	if ( false === is_page( array( 'contact', 'contacto' ) ) ) {
		wp_dequeue_script( 'google-recaptcha' );
		wp_dequeue_script( 'wpcf7-recaptcha' );
	}
}
add_action( 'wp_print_scripts', 'bpa_theme_dequeue_recaptcha' );
