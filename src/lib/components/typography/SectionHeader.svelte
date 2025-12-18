<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';

	interface Props {
		title: string;
		tagline?: string;
		level?: 2 | 3;
	}

	let {
		title,
		tagline,
		level = 2
	}: Props = $props();
</script>

<InView animation="fade-up">
	<header class="section-header">
		{#if level === 2}
			<h2 class="section-title">{title}</h2>
		{:else}
			<h3 class="section-title h3">{title}</h3>
		{/if}
		{#if tagline}
			<p class="section-tagline">{tagline}</p>
		{/if}
	</header>
</InView>

<style>
	.section-header {
		margin: 0 0 var(--space-lg) 0;
		text-align: left;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: var(--size-section);
		font-weight: 600;
		line-height: var(--leading-tight);
		color: var(--text-primary);
		margin: 0 0 var(--space-sm) 0;
	}

	.section-title.h3 {
		font-size: var(--size-subsection);
	}

	.section-tagline {
		font-family: var(--font-body);
		font-size: var(--size-body-large);
		font-style: italic;
		color: var(--accent);
		margin: 0;
	}

	/* Burned underline effect */
	.section-title::after {
		content: '';
		display: block;
		width: 80px;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--ember) 0%,
			var(--ember-dark) 100%
		);
		margin-top: var(--space-sm);
		border-radius: 2px;
	}
</style>

