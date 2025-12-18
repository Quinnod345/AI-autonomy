<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';

	interface Props {
		code: string;
		language?: string;
		filename?: string;
		highlightLines?: number[];
		caption?: string;
	}

	let {
		code,
		language = 'python',
		filename,
		highlightLines = [],
		caption
	}: Props = $props();

	let lines = $derived(code.trim().split('\n'));
</script>

<InView animation="fade-up">
	<figure class="code-block">
		{#if filename}
			<div class="code-header">
				<span class="filename">{filename}</span>
				<span class="language">{language}</span>
			</div>
		{/if}
		<pre class="code-content"><code class="language-{language}">{#each lines as line, i}<span 
				class="line"
				class:highlight={highlightLines.includes(i + 1)}
			><span class="line-number">{i + 1}</span><span class="line-content">{line}</span>
</span>{/each}</code></pre>
		{#if caption}
			<figcaption class="code-caption">{caption}</figcaption>
		{/if}
	</figure>
</InView>

<style>
	.code-block {
		margin: var(--space-lg) 0;
		background: var(--ash-dark);
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--ash-mid);
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		background: var(--charcoal);
		border-bottom: 1px solid var(--ash-mid);
	}

	.filename {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		color: var(--text-secondary);
	}

	.language {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		text-transform: uppercase;
		color: var(--accent);
		background: var(--ember-subtle);
		padding: 2px 8px;
		border-radius: 4px;
	}

	.code-content {
		margin: 0;
		padding: var(--space-md);
		overflow-x: auto;
		background: transparent;
		border: none;
	}

	code {
		font-family: var(--font-mono);
		font-size: var(--size-code);
		line-height: 1.6;
		background: transparent;
		padding: 0;
	}

	.line {
		display: block;
	}

	.line.highlight {
		background: var(--ember-subtle);
		margin: 0 calc(-1 * var(--space-md));
		padding: 0 var(--space-md);
		border-left: 3px solid var(--ember);
	}

	.line-number {
		display: inline-block;
		width: 3ch;
		margin-right: var(--space-md);
		color: var(--ash-light);
		text-align: right;
		user-select: none;
	}

	.line-content {
		white-space: pre;
	}

	.code-caption {
		padding: var(--space-sm) var(--space-md);
		font-size: var(--size-small);
		color: var(--text-muted);
		border-top: 1px solid var(--ash-mid);
		font-style: italic;
	}

	/* Basic syntax highlighting with CSS */
	code :global(.keyword) {
		color: var(--ember);
	}

	code :global(.string) {
		color: #a8cc8c;
	}

	code :global(.comment) {
		color: var(--ash-light);
		font-style: italic;
	}

	code :global(.function) {
		color: var(--ember-glow);
	}
</style>

