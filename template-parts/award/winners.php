<?php
/**
 * The template for displaying artwork archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<button class="award-edition-container__return-button return-button" aria-pressed="false"><</button>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="entry-content award">
		<div class="award__title">
			<h1><?php the_title(); ?></h1>
		</div>
		<div class="award__prizes">
			<?php
			if ( false === carbon_get_the_post_meta( 'bp_award_se_toggle' ) ) :
				?>

				<ol class="prizes__list">
					<?php 
					$bpa_theme_prizes = carbon_get_the_post_meta( 'bp_award' );
					foreach ( $bpa_theme_prizes as $bpa_theme_index => $bpa_theme_prize ) :
						?>

						<li id="prize-<?php echo esc_html( $bpa_theme_index + 1 ); ?>" class="prize__category prize__category-<?php echo esc_attr( $bpa_theme_index + 1 ); ?>" >
							<h2 class="prize__name"><?php echo wp_kses( $bpa_theme_prize['bp_award_category'], array( 'sup' => array() ) ); ?></h2>
							<p class="prize__artist"><?php echo esc_html( $bpa_theme_prize['bp_award_artist'] ); ?></p>
							<div class="prize__image">
								<button type="button" data-image="<?php echo esc_attr( $bpa_theme_prize['bp_award_image'] ); ?>">
									<figure>

										<?php 
										echo wp_get_attachment_image( $bpa_theme_prize['bp_award_image'], 'award-thumbnail' );
										?>

									</figure>
								</button>
							</div>
							<p class="prize__artwork"><?php echo esc_html( $bpa_theme_prize['bp_award_title'] ); ?></p>
							<p class="prize__technique"><?php echo esc_html( $bpa_theme_prize['bp_award_technique'] ); ?></p>
							<p class="prize__size"><?php echo esc_html( $bpa_theme_prize['bp_award_size'] ); ?></p>
							<p class="prize__year"><?php echo esc_html( $bpa_theme_prize['bp_award_year'] ); ?></p>
						</li>

						<?php
					endforeach;
					?>
				</ol>

				<?php
				$bpa_theme_mentions = carbon_get_the_post_meta( 'bp_award_mentions' );
				if ( $bpa_theme_mentions ) :
					?>

					<ul class="prizes__mentions">

						<?php
						foreach ( $bpa_theme_mentions as $bpa_theme_mention ) :
							?>
							<li class="mention">
								<h2 class="mention__title"><?php echo esc_html( $bpa_theme_mention['bp_award_mentions_title'] ); ?></h2>
								<p class="mention__text"><?php echo esc_html( $bpa_theme_mention['bp_award_mentions_text'] ); ?></p>
							</li>

							<?php
						endforeach;
						?>

					</ul>

					<?php
				endif;
			endif;
			?>
		</div>
	</div>
</article>
