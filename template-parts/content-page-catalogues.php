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

<div class="edition-container">
	<span>EDITION</span>
</div><!--.edition-container -->
