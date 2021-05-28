<?php
/**
 * Template part for displaying exhibition content in page_techniques.php
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php 
	get_template_part( 'template-parts/nav/secondary', '', carbon_get_the_post_meta( 'bp_page_menu' ) );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">

		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

	</header><!-- .entry-header -->

	<div class="entry-content">

		<?php 
		the_content();
		$date_query = new WP_Query( $args );

		if ( $date_query->have_posts() ) :
			?>

			<ul>

			<?php
			while ( $date_query->have_posts() ) :
				$date_query->the_post();
				?>

				<li>

					<?php
					the_title( 
						sprintf(
							'<a href="%s" title="%s">',
							esc_url( get_the_permalink() ),
							esc_html( get_the_title() )
						),
						'</a>'
					); 
					?>

				</li>

				<?php
			endwhile; // End of the loop.
			?>

			</ul>

			<?php
			wp_reset_postdata();
		endif;
		?>
	</div><!-- .entry-content -->

</article><!-- #post-<?php the_ID(); ?> -->
