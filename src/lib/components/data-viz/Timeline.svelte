<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';

	interface Milestone {
		year: number;
		title: string;
		description: string;
		sentiment: 'hype' | 'neutral' | 'reversal';
		quote?: string;
	}

	interface Props {
		milestones: Milestone[];
	}

	let { milestones }: Props = $props();
</script>

<div class="timeline" role="list" aria-label="Timeline of events">
	{#each milestones as milestone, i}
		<InView animation="fade-up" delay={i * 200}>
			<div 
				class="milestone sentiment-{milestone.sentiment}" 
				role="listitem"
			>
				<div class="milestone-marker">
					<span class="year">{milestone.year}</span>
					<div class="marker-dot"></div>
				</div>
				<div class="milestone-content">
					<h4 class="milestone-title">{milestone.title}</h4>
					<p class="milestone-description">{milestone.description}</p>
					{#if milestone.quote}
						<blockquote class="milestone-quote">
							"{milestone.quote}"
						</blockquote>
					{/if}
				</div>
				{#if i < milestones.length - 1}
					<div class="connector" aria-hidden="true"></div>
				{/if}
			</div>
		</InView>
	{/each}
</div>

<style>
	.timeline {
		position: relative;
		padding: var(--space-md) 0;
	}

	.milestone {
		position: relative;
		display: grid;
		grid-template-columns: 80px 1fr;
		gap: var(--space-md);
		padding-bottom: var(--space-xl);
		margin-bottom: var(--space-md);
	}

	.milestone:last-child {
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.milestone-marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.year {
		font-family: var(--font-stat);
		font-size: 1.5rem;
		color: var(--text-muted);
		margin-bottom: var(--space-xs);
	}

	.sentiment-hype .year {
		color: var(--ember-glow);
	}

	.sentiment-reversal .year {
		color: var(--ember);
	}

	.marker-dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--ash-mid);
		border: 3px solid var(--ember);
		z-index: 1;
	}

	.sentiment-hype .marker-dot {
		background: var(--ember-glow);
		box-shadow: 0 0 12px var(--ember-glow);
	}

	.sentiment-reversal .marker-dot {
		background: var(--ember);
		box-shadow: 0 0 12px var(--ember);
	}

	.connector {
		position: absolute;
		left: 40px;
		top: 60px;
		bottom: calc(-1 * var(--space-md));
		width: 2px;
		background: linear-gradient(
			180deg,
			var(--ember) 0%,
			var(--ash-mid) 100%
		);
		transform: translateX(-50%);
	}

	.milestone-content {
		background: var(--ash-dark);
		border-radius: 12px;
		padding: var(--space-md);
		border: 1px solid var(--ash-mid);
		border-left: 3px solid var(--ash-mid);
	}

	.sentiment-hype .milestone-content {
		border-left-color: var(--ember-glow);
	}

	.sentiment-reversal .milestone-content {
		border-left-color: var(--ember);
	}

	.milestone-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--text-primary);
		margin: 0 0 var(--space-xs);
	}

	.milestone-description {
		font-size: var(--size-body);
		color: var(--text-secondary);
		margin: 0;
	}

	.milestone-quote {
		font-style: italic;
		color: var(--text-muted);
		margin: var(--space-sm) 0 0;
		padding-left: var(--space-sm);
		border-left: 2px solid var(--ash-mid);
	}

	.sentiment-hype .milestone-quote {
		border-left-color: var(--ember-glow);
	}

	.sentiment-reversal .milestone-quote {
		border-left-color: var(--ember);
	}

	@media (min-width: 768px) {
		.milestone {
			grid-template-columns: 100px 1fr;
		}

		.year {
			font-size: 2rem;
		}

		.connector {
			left: 50px;
		}
	}
</style>

