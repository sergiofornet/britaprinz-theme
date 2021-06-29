<?php
/**
 * The template for displaying artwork archive page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Brita_Prinz_Theme
 */

// the_title();
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
					// var_dump(carbon_get_the_post_meta('bp_award'));
					$prizes = carbon_get_the_post_meta('bp_award'); 
					foreach ( $prizes as $index => $prize ) :
						?>

						<li id="prize-<?php echo esc_html( $index + 1 ); ?>" class="prize__category prize__category-<?php echo esc_attr( $index + 1 );?>" >
							<h2 class="prize__name"><?php echo esc_html( $prize['bp_award_category'] ); ?></h2>
							<p class="prize__artist"><?php echo esc_html( $prize['bp_award_artist'] ); ?></p>
							<?php /** TODO: images */ ?>
							<figure class="prize__image">
								<?php echo wp_get_attachment_image( $prize['bp_award_image'], 'award-thumbnail' ); ?>
							</figure>
							<p class="prize__artwork"><?php echo esc_html( $prize['bp_award_title'] ); ?></p>
							<p class="prize__technique"><?php echo esc_html( $prize['bp_award_technique'] ); ?></p>
							<p class="prize__size"><?php echo esc_html( $prize['bp_award_size'] ); ?></p>
							<p class="prize__year"><?php echo esc_html( $prize['bp_award_year'] ); ?></p>
						</li>

						<?php
					endforeach;
					?>
				</ol>

				<?php
				$mentions = carbon_get_the_post_meta('bp_award_mentions');
				if ( $mentions ) :
					?>

					<ul class="prizes__mentions">

						<?php
						foreach ($mentions as $mention) :
							?>
							<li class="mention">
								<h2 class="mention__title"><?php echo esc_html($mention['bp_award_mentions_title']); ?></h2>
								<p class="mention__text"><?php echo esc_html($mention['bp_award_mentions_text']); ?></p>
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