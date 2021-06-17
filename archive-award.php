<?php
/**
 * The template for displaying artwork archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_header();
?>

	<main id="primary" class="site-main site-main--half">

		<?php 
		if ( have_posts() ) : 
			add_filter( 'nav_menu_items_winners', 'britaprinz_theme_get_winners' );
			$bpa_theme_award_post_type = get_post_type();
			get_template_part( 'template-parts/nav/secondary', 'award', "{$bpa_theme_award_post_type}-menu" );
			?><!--.menu-award-container-->

			<div class="award-edition-container">

			</div><!--.award-edition-container -->

			<div class="award-gallery hidden">
				<div class="award-gallery__close">
					<button class="close">&times;</button>
				</div>
				<div class="award-gallery__slider"></div>
			</div>

			<?php
		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>

	</main><!-- #main -->

<?php
get_footer();
