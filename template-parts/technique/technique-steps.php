<?php
/**
 * Template part for displaying technique steps explanation
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

$bpa_theme_technique_steps = $args;

if ( $bpa_theme_technique_steps ) :
	?>

	<div class="technique-content__steps">

		<?php
		foreach ( $bpa_theme_technique_steps as $bpa_theme_step ) :
			$bpa_theme_step_text     = $bpa_theme_step['bp_technique_steps_text'];
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

	</div><!-- .technique-content__steps -->

	<?php
endif;
