<script lang="ts">
	import InView from '$lib/components/effects/InView.svelte';
	import AnimatedCounter from './AnimatedCounter.svelte';

	interface Props {
		value: number;
		label: string;
		suffix?: string;
		trend?: 'up' | 'down' | 'neutral';
		description?: string;
		delay?: number;
	}

	let {
		value,
		label,
		suffix = '%',
		trend = 'neutral',
		description,
		delay = 0
	}: Props = $props();
</script>

<InView animation="fade-up" {delay}>
	<div class="stat-card trend-{trend}">
		<div class="stat-value">
			<AnimatedCounter {value} {suffix} />
		</div>
		<div class="stat-label">{label}</div>
		{#if description}
			<p class="stat-description">{description}</p>
		{/if}
		{#if trend !== 'neutral'}
			<div class="trend-indicator" aria-label="Trend: {trend}">
				{#if trend === 'up'}
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
						<path d="M8 4l4 4H9v4H7V8H4l4-4z"/>
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
						<path d="M8 12l-4-4h3V4h2v4h3l-4 4z"/>
					</svg>
				{/if}
			</div>
		{/if}
	</div>
</InView>

<style>
	.stat-card {
		position: relative;
		padding: var(--space-md);
		background: var(--ash-dark);
		border-radius: 12px;
		border: 1px solid var(--ash-mid);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
	}

	.stat-value {
		font-family: var(--font-stat);
		font-size: var(--size-stat);
		line-height: 1;
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.trend-up .stat-value {
		color: var(--ember-glow);
	}

	.trend-down .stat-value {
		color: var(--ember);
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		margin-top: var(--space-xs);
	}

	.stat-description {
		font-size: var(--size-small);
		color: var(--text-secondary);
		margin-top: var(--space-sm);
		margin-bottom: 0;
		flex: 1;
	}

	.trend-indicator {
		position: absolute;
		top: var(--space-sm);
		right: var(--space-sm);
		padding: 4px;
		border-radius: 50%;
		background: var(--ash-mid);
	}

	.trend-up .trend-indicator {
		color: var(--ember-glow);
	}

	.trend-down .trend-indicator {
		color: var(--ember);
	}

	/* Burned edge effect */
	.stat-card::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--ember-dark) 0%,
			var(--ember) 50%,
			var(--ember-dark) 100%
		);
		border-radius: 0 0 12px 12px;
		opacity: 0.6;
	}
</style>

