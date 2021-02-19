<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Brita_Prinz_Theme
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'britaprinz-theme' ); ?></a>

	<header id="masthead" class="site-header">
		<div class="site-branding">

			<?php
			the_custom_logo();

			if ( is_front_page() && is_home() ) :
				?>

				<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>

				<?php
			else :
				?>

				<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>

				<?php
			endif;

			$britaprinz_theme_description = get_bloginfo( 'description', 'display' );

			if ( $britaprinz_theme_description || is_customize_preview() ) :
				?>

				<p class="site-description"><?php echo $britaprinz_theme_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>

			<?php endif; ?>

		</div><!-- .site-branding -->

		<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false" aria-label="menu"><?php esc_html_e( 'Menú', 'britaprinz-theme' ); ?></button>

		<?php do_action( 'wpml_add_language_selector' ); ?>

		<button class="search-button" type="button" aria-controls="search-div" aria-expanded="false" aria-label="Open search form">🔍</button>
	</header><!-- #masthead -->
	<div class="search-div">
		<button class="search-div__close" aria-label="Close search form">&times;</button>

		<?php get_search_form(); ?>

	</div>
	<nav id="site-navigation" class="main-navigation">

		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'menu-1',
				'menu_id'        => 'primary-menu',
			)
		);
		?>

	</nav><!-- #site-navigation -->
