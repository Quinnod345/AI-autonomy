<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		author?: string;
		source?: string;
		children: Snippet;
	}

	let {
		author,
		source,
		children
	}: Props = $props();
</script>

<InView animation="fade-up" delay={100}>
	<figure class="pull-quote">
		<blockquote class="quote-text">
			{@render children()}
		</blockquote>
		{#if author || source}
			<figcaption class="quote-attribution">
				{#if author}
					<span class="author">{author}</span>
				{/if}
				{#if source}
					<cite class="source">{source}</cite>
				{/if}
			</figcaption>
		{/if}
		
		<!-- Decorative burned edge effect -->
		<div class="burned-edge" aria-hidden="true"></div>
	</figure>
</InView>

<style>
	.pull-quote {
		position: relative;
		margin: var(--space-md) 0 var(--space-lg) 0;
		padding: var(--space-md) var(--space-lg);
		background: linear-gradient(
			135deg,
			var(--ash-dark) 0%,
			var(--ember-subtle) 100%
		);
		border-left: 4px solid var(--ember);
		border-radius: 0 8px 8px 0;
	}

	.quote-text {
		font-family: var(--font-display);
		font-size: var(--size-body-large);
		font-style: italic;
		line-height: var(--leading-snug);
		color: var(--text-primary);
		margin: 0;
	}

	.quote-text::before {
		content: '"';
		color: var(--ember);
		font-size: 2em;
		line-height: 0;
		vertical-align: -0.3em;
		margin-right: 0.1em;
	}

	.quote-text::after {
		content: '"';
		color: var(--ember);
		font-size: 2em;
		line-height: 0;
		vertical-align: -0.3em;
		margin-left: 0.1em;
	}

	.quote-attribution {
		margin-top: var(--space-sm);
		font-size: var(--size-small);
		color: var(--text-muted);
	}

	.author {
		font-weight: 600;
		color: var(--text-secondary);
	}

	.author::after {
		content: ', ';
	}

	.source {
		font-style: italic;
	}

	/* Burned edge decorative effect */
	.burned-edge {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 30px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(139, 37, 0, 0.1) 100%
		);
		border-radius: 0 8px 8px 0;
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.pull-quote {
			margin: var(--space-lg) var(--space-md);
			padding: var(--space-lg) var(--space-xl);
		}

		.quote-text {
			font-size: clamp(1.25rem, 2vw, 1.75rem);
		}
	}
</style>

