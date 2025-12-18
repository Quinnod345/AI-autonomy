<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="prose">
	{@render children()}
</div>

<style>
	.prose {
		font-family: var(--font-body);
		font-size: var(--size-body);
		line-height: var(--leading-relaxed);
		color: var(--text-primary);
		max-width: var(--max-width-prose);
		margin-top: var(--space-md);
	}

	.prose :global(p) {
		margin: 0 0 1.25em 0;
	}

	.prose :global(p:last-child) {
		margin-bottom: 0;
	}

	.prose :global(p:first-child) {
		margin-top: 0;
	}

	.prose :global(strong) {
		color: var(--smoke);
		font-weight: 600;
	}

	.prose :global(em) {
		font-style: italic;
	}

	.prose :global(a) {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color var(--transition-fast);
	}

	.prose :global(a:hover) {
		color: var(--accent-hover);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 1.5em 0;
		padding-left: 1.5em;
	}

	.prose :global(li) {
		margin-bottom: 0.5em;
	}

	.prose :global(li::marker) {
		color: var(--accent);
	}

	.prose :global(h3) {
		font-family: var(--font-display);
		font-size: var(--size-subsection);
		margin-top: 2em;
		margin-bottom: 0.75em;
	}

	.prose :global(h4) {
		font-family: var(--font-display);
		font-size: calc(var(--size-body) * 1.25);
		margin-top: 1.5em;
		margin-bottom: 0.5em;
	}

	/* Code within prose */
	.prose :global(code) {
		background: var(--ash-mid);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.prose :global(pre) {
		margin: 1.5em 0;
		overflow-x: auto;
	}

	.prose :global(pre code) {
		background: none;
		padding: 0;
	}
</style>

