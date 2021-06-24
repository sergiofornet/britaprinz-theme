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
		<div class="award-container" data-state="unloaded">
			<?php
			if ( have_posts() ) :
				add_filter( 'nav_menu_items_winners', 'britaprinz_theme_get_winners' );
				$bpa_theme_award_post_type = get_post_type();
				get_template_part( 'template-parts/nav/secondary', 'award', "{$bpa_theme_award_post_type}-menu" );
			endif;
			rewind_posts();
			?><!--.menu-award-container-->

			<div class="award-edition-container" data-state="loaded">

				<?php
				if ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/award/winners' );
					rewind_posts();
				endif;
				?>

			</div><!--.award-edition-container -->
		</div>

		<?php
		$edition_id = get_the_ID();
		add_action(
			'bpa_theme_gallery_markup',
			function() use ( $edition_id ) {
				$markup = "
					<div class='award-gallery hidden' data-edition='{$edition_id}'>
						<div class='award-gallery__close'>
							<button class='close'>&times;</button>
						</div>
						<div class='award-gallery__slider'></div>
					</div><!--.edition-gallery -->
				";
				echo $markup;
			}, 
			10,
			2
		);
		?>

	</main><!-- #main -->

<?php
get_footer();
