<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

get_template_part( 'template-parts/nav/secondary', '', $args['sidebar'] );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">

		<?php 
		the_title( '<h1 class="entry-title">', '</h1>' ); 
		
		britaprinz_theme_post_thumbnail();
		?>

	</header><!-- .entry-header -->
	<div class="entry-content">

		<?php the_content(); ?>

	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
