<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';
	import type { Citation } from '$lib/data/citations';

	interface Props {
		citation: Citation;
		summary?: string;
		keyFinding?: string;
	}

	let { citation, summary, keyFinding }: Props = $props();

	const typeIcons = {
		survey: '📊',
		research: '🔬',
		article: '📰',
		report: '📋'
	};
</script>

<InView animation="scale">
	<a 
		href={citation.url} 
		target="_blank" 
		rel="noopener noreferrer" 
		class="research-card"
	>
		<div class="card-type" aria-label="Type: {citation.type}">
			<span class="type-icon" aria-hidden="true">{typeIcons[citation.type]}</span>
			<span class="type-label">{citation.type}</span>
		</div>
		
		<h4 class="card-title">{citation.title}</h4>
		
		{#if citation.authors}
			<p class="card-authors">
				{citation.authors.join(', ')}
			</p>
		{/if}
		
		{#if citation.publisher}
			<p class="card-publisher">{citation.publisher}</p>
		{/if}
		
		{#if summary}
			<p class="card-summary">{summary}</p>
		{/if}
		
		{#if keyFinding}
			<div class="key-finding">
				<span class="finding-label">Key Finding:</span>
				<span class="finding-text">{keyFinding}</span>
			</div>
		{/if}
		
		<div class="card-link">
			Read more →
		</div>
	</a>
</InView>

<style>
	.research-card {
		display: block;
		padding: var(--space-md);
		background: var(--ash-dark);
		border-radius: 12px;
		border: 1px solid var(--ash-mid);
		text-decoration: none;
		color: inherit;
		transition: 
			transform var(--transition-base),
			box-shadow var(--transition-base),
			border-color var(--transition-base);
	}

	.research-card:hover {
		transform: translateY(-4px) scale(1.02);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
		border-color: var(--ember);
	}

	.research-card:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.card-type {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-sm);
	}

	.type-icon {
		font-size: 1.25rem;
	}

	.type-label {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.card-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--text-primary);
		margin: 0 0 var(--space-xs);
		line-height: var(--leading-snug);
	}

	.card-authors {
		font-size: var(--size-small);
		color: var(--text-secondary);
		margin: 0 0 var(--space-xs);
	}

	.card-publisher {
		font-size: var(--size-small);
		color: var(--accent);
		margin: 0 0 var(--space-sm);
	}

	.card-summary {
		font-size: var(--size-small);
		color: var(--text-secondary);
		margin: 0 0 var(--space-sm);
		line-height: var(--leading-normal);
	}

	.key-finding {
		background: var(--ember-subtle);
		padding: var(--space-sm);
		border-radius: 8px;
		margin-bottom: var(--space-sm);
	}

	.finding-label {
		display: block;
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 4px;
	}

	.finding-text {
		font-size: var(--size-small);
		color: var(--text-primary);
	}

	.card-link {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		color: var(--accent);
		transition: color var(--transition-fast);
	}

	.research-card:hover .card-link {
		color: var(--accent-hover);
	}
</style>

