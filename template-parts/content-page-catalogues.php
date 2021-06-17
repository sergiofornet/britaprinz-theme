<?php
/**
 * Template part for displaying catalogue links in page_catalogues.php
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php
	add_filter( 'nav_menu_items_catalogues', 'britaprinz_theme_get_catalogues' );
	get_template_part( 'template-parts/nav/secondary', 'award', 'award-menu' );	
?>

<div class="award-edition-container">
</div><!--.award-edition-container -->
<div class="award-gallery hidden">
	<div class="award-gallery__close">
		<button class="close">&times;</button>
	</div>
	<div class="award-gallery__slider"></div>
</div><!--.edition-gallery -->
