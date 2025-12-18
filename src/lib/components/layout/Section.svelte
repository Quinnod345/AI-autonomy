<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		variant?: 'default' | 'dark' | 'accent';
		spacing?: 'normal' | 'compact' | 'large';
		children: Snippet;
	}

	let {
		id,
		variant = 'default',
		spacing = 'normal',
		children
	}: Props = $props();
</script>

<section {id} class="section {variant} spacing-{spacing}">
	<div class="section-inner">
		{@render children()}
	</div>
</section>

<style>
	.section {
		position: relative;
		width: 100%;
	}

	.section-inner {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0 var(--space-md);
	}

	/* Spacing variants */
	.spacing-normal {
		padding-top: var(--space-xl);
		padding-bottom: var(--space-xl);
	}

	.spacing-compact {
		padding-top: var(--space-lg);
		padding-bottom: var(--space-lg);
	}

	.spacing-large {
		padding-top: var(--space-2xl);
		padding-bottom: var(--space-2xl);
	}

	/* Color variants */
	.default {
		background: transparent;
	}

	.dark {
		background: var(--ash-dark);
	}

	.accent {
		background: linear-gradient(
			180deg,
			var(--ember-subtle) 0%,
			transparent 100%
		);
	}

	@media (min-width: 768px) {
		.section-inner {
			padding: 0 var(--space-lg);
		}
	}
</style>

