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

	<main id="primary" class="site-main">

		<?php if ( have_posts() ) : ?>

			<header class="page-header">
				<h1 class="page-title">
					<?php echo post_type_archive_title(); ?>
				</h1>

			</header><!-- .page-header -->

			<input type="text" class="artist-search">
			<div style="display: grid; grid-template-columns: 1fr 1fr;">
				<div style="display: grid; grid-template-columns: 9fr 1fr; height:100vh">
					<div class="artists__container" style="height: 100vh; overflow-y: scroll;"></div>
					<div class="initials__container">
					
						<?php
						foreach( range( 'A', 'Z' ) as $initial) :
							?>
							
							<div>
								<button class="initial-link" data-target="<?php echo esc_attr( $initial ); ?>"><?php echo esc_html( $initial ); ?></button>
							</div>
							
							<?php
						endforeach;
						?>

					</div>
				</div>
				<div class="artworks__container"></div>
			</div>
			<div class="artwork__gallery"></div>

		<?php
		// the_posts_navigation();
		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>


	</main><!-- #main -->

<?php
// get_sidebar();
get_footer();
