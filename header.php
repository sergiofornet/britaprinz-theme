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
		<div class="header__logo">

			<?php
			if ( is_front_page() || is_home() ) :
				?>

				<h1 class="site-title">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="<?php esc_attr( bloginfo( 'name' ) ); ?>">
						<span class="screen-reader-text"><?php bloginfo( 'name' ); ?></span>
				
						<?php get_template_part( 'template-parts/svg/bpa', 'logo' ); ?>
				
					</a>
				</h1>

				<?php
			else :
				?>

				<p class="site-title">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="<?php bloginfo( 'name' ); ?>">
						<span class="screen-reader-text"><?php bloginfo( 'name' ); ?></span>
					
					<?php get_template_part( 'template-parts/svg/BPA', 'logo' ); ?>

					</a>
				</p>

				<?php
			endif;

			$britaprinz_theme_description = get_bloginfo( 'description', 'display' );

			if ( $britaprinz_theme_description || is_customize_preview() ) :
				?>

				<p class="site-description"><?php echo $britaprinz_theme_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>

			<?php endif; ?>

		</div><!-- .header__logo -->

		<button class="header__menu-toggle" aria-controls="primary-menu" aria-expanded="false" aria-label="menu"><?php esc_html_e( 'Menú', 'britaprinz-theme' ); ?></button>

		<?php do_action( 'wpml_add_language_selector' ); ?>

	</header><!-- #masthead -->
	<nav id="site-navigation" class="main-navigation">

		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'menu-1',
				'menu_id'        => 'primary-menu',
				'walker'         => new Bpa_Theme_Walker_Nav_Menu(),
			)
		);
		?>

	</nav><!-- #site-navigation -->
