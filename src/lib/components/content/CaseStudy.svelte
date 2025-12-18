<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		company: string;
		logo?: string;
		children: Snippet;
	}

	let { company, logo, children }: Props = $props();
</script>

<InView animation="fade-up">
	<article class="case-study">
		<header class="case-header">
			{#if logo}
				<img src={logo} alt="{company} logo" class="company-logo" />
			{:else}
				<div class="company-placeholder">
					{company.charAt(0)}
				</div>
			{/if}
			<div class="company-info">
				<span class="case-label">Case Study</span>
				<h3 class="company-name">{company}</h3>
			</div>
		</header>
		
		<div class="case-content">
			{@render children()}
		</div>
		
		<div class="burn-decoration" aria-hidden="true"></div>
	</article>
</InView>

<style>
	.case-study {
		position: relative;
		background: var(--ash-dark);
		border-radius: 16px;
		padding: var(--space-lg);
		border: 1px solid var(--ash-mid);
		overflow: hidden;
		margin: var(--space-lg) 0;
	}

	.case-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
		padding-bottom: var(--space-md);
		border-bottom: 1px solid var(--ash-mid);
	}

	.company-logo {
		width: 60px;
		height: 60px;
		object-fit: contain;
		border-radius: 8px;
	}

	.company-placeholder {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ember-subtle);
		border-radius: 8px;
		font-family: var(--font-stat);
		font-size: 2rem;
		color: var(--accent);
	}

	.case-label {
		display: block;
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		margin-bottom: 4px;
	}

	.company-name {
		font-family: var(--font-display);
		font-size: var(--size-subsection);
		color: var(--text-primary);
		margin: 0;
	}

	.case-content {
		position: relative;
		z-index: 1;
	}

	/* Decorative burn effect in corner */
	.burn-decoration {
		position: absolute;
		bottom: -50px;
		right: -50px;
		width: 200px;
		height: 200px;
		background: radial-gradient(
			circle at center,
			rgba(196, 94, 26, 0.15) 0%,
			transparent 70%
		);
		pointer-events: none;
	}

	@media (max-width: 640px) {
		.case-study {
			padding: var(--space-md);
		}

		.case-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
		}
	}
</style>

