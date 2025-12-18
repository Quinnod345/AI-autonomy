<script lang="ts">
	import type { Citation } from '$lib/data/citations';
	import { formatCitation } from '$lib/data/citations';

	interface Props {
		citation: Citation;
	}

	let { citation }: Props = $props();

	const typeIcons = {
		survey: '📊',
		research: '🔬',
		article: '📰',
		report: '📋'
	};
</script>

<li class="citation-item">
	<span class="citation-icon" aria-hidden="true">{typeIcons[citation.type]}</span>
	<div class="citation-content">
		<span class="citation-text">{formatCitation(citation)}</span>
		<a 
			href={citation.url} 
			target="_blank" 
			rel="noopener noreferrer"
			class="citation-link"
		>
			{citation.url}
		</a>
	</div>
</li>

<style>
	.citation-item {
		display: flex;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--ash-dark);
		border-radius: 8px;
		border: 1px solid var(--ash-mid);
		transition: border-color var(--transition-fast);
	}

	.citation-item:hover {
		border-color: var(--accent);
	}

	.citation-icon {
		flex-shrink: 0;
		font-size: 1.25rem;
	}

	.citation-content {
		flex: 1;
		min-width: 0;
	}

	.citation-text {
		display: block;
		font-size: var(--size-body);
		color: var(--text-primary);
		line-height: var(--leading-normal);
		margin-bottom: var(--space-xs);
	}

	.citation-link {
		display: block;
		font-family: var(--font-mono);
		font-size: var(--size-small);
		color: var(--accent);
		word-break: break-all;
		transition: color var(--transition-fast);
	}

	.citation-link:hover {
		color: var(--accent-hover);
	}
</style>

