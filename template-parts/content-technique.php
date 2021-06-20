<?php
/**
 * Template part for displaying Technique post type pages
 *
 * @package Brita_Prinz_Theme
 */

?>

<?php 
	get_template_part( 'template-parts/nav/secondary', '', 'technique-menu' );
	?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header technique-header">

		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

	</header><!-- .entry-header -->
	<div class="entry-content technique-content">

		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'britaprinz-theme' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
			wp_kses_post( get_the_title() )
			)
		);

		$bpa_theme_technique_steps = carbon_get_the_post_meta( 'bp_technique_steps' );
		if ( $bpa_theme_technique_steps ) :
			?>
		
			<div class="technique-content__steps">

				<?php
				foreach ($bpa_theme_technique_steps as $bpa_theme_step ) :
					$bpa_theme_step_text = $bpa_theme_step['bp_technique_steps_text'];
					$bpa_theme_step_image_id = $bpa_theme_step['bp_technique_steps_image'];
					?>

					<figure class="step">
					
						<?php 
						echo wp_get_attachment_image( $bpa_theme_step_image_id, 'medium' ); 
						?>
						
						<figcaption><?php echo esc_html( $bpa_theme_step_text ); ?></figcaption>
					</figure>

					<?php
				endforeach;
				?>

			</div>
			<?php
		endif;
		?>

	</div><!-- .entry-content -->
</article><!-- #post-<?php the_ID(); ?> -->
