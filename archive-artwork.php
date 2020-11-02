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

				<?php
				the_archive_description( '<div class="archive-description">', '</div>' );
				?>

			</header><!-- .page-header -->

			<div style="display: grid; grid-template-columns: 1fr 1fr;">
				<div>
				
					<?php
					// Artist terms query.
					$args = array(
						'taxonomy'		=> 'artist',
						'orderby'		=> 'order_name',
						'order'			=> 'ASC',
						'hide_empty'	=> false,
						'meta_query'	=> array(
							'order_name'	=> array(
								'key'		=> 'bp_artist_order_name',
								'compare'	=> 'EXISTS',
							),
						),
					);
					
					$artists_query = new WP_Term_Query( $args );
					
					if ( ! empty( $artists_query ) && ! is_wp_error( $artists_query ) ) :
						foreach ( $artists_query->get_terms() as $term ) :
							?>

								<div class="artist">
									<button class="artist__link"  data-artist="<?php echo esc_attr( $term->term_id ); ?>">

										<?php echo esc_html( $term->name ); ?>

									</button>
								</div>

							<?php
						endforeach;
					endif;
					wp_reset_postdata(); 
					?>

					<?php
					/* Start the Loop */
					while ( have_posts() ) :
						the_post();
						
						/*
						* Include the Post-Type-specific template for the content.
						* If you want to override this in a child theme, then include a file
						* called content-___.php (where ___ is the Post Type name) and that will be used instead.
						*/
						get_template_part( 'template-parts/content', get_post_type() );
						
					endwhile;
					?>
				</div>
				<div class="artworks__container"></div>
			</div>

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
