<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import InView from '$lib/components/effects/InView.svelte';

	interface Props {
		leftValue: number;
		leftLabel: string;
		rightValue: number;
		rightLabel: string;
		leftColor?: 'accent' | 'muted';
		rightColor?: 'accent' | 'muted';
		showArrow?: boolean;
	}

	let {
		leftValue,
		leftLabel,
		rightValue,
		rightLabel,
		leftColor = 'accent',
		rightColor = 'muted',
		showArrow = true
	}: Props = $props();

	let element: HTMLDivElement;
	let leftWidth = $state(0);
	let rightWidth = $state(0);
	let hasAnimated = false;

	onMount(() => {
		if (!browser) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated) {
					hasAnimated = true;

					if (prefersReducedMotion) {
						leftWidth = leftValue;
						rightWidth = rightValue;
					} else {
						animateBars();
					}

					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});

	function animateBars() {
		const duration = 1500;
		const startTime = performance.now();

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);

			leftWidth = leftValue * eased;
			rightWidth = rightValue * eased;

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		}

		requestAnimationFrame(animate);
	}
</script>

<InView animation="fade-up">
	<div 
		bind:this={element}
		class="comparison-bar" 
		role="img" 
		aria-label="{leftLabel}: {leftValue}%, {rightLabel}: {rightValue}%"
	>
		<div class="bar-container">
			<div class="bar-group left">
				<div class="bar-label">
					<span class="value">{Math.round(leftWidth)}%</span>
					<span class="label">{leftLabel}</span>
				</div>
				<div class="bar-track">
					<div 
						class="bar-fill {leftColor}" 
						style="width: {leftWidth}%"
					></div>
				</div>
			</div>

			{#if showArrow}
				<div class="arrow" aria-hidden="true">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</div>
			{/if}

			<div class="bar-group right">
				<div class="bar-label">
					<span class="value">{Math.round(rightWidth)}%</span>
					<span class="label">{rightLabel}</span>
				</div>
				<div class="bar-track">
					<div 
						class="bar-fill {rightColor}" 
						style="width: {rightWidth}%"
					></div>
				</div>
			</div>
		</div>
	</div>
</InView>

<style>
	.comparison-bar {
		padding: var(--space-md);
		background: var(--ash-dark);
		border-radius: 12px;
		border: 1px solid var(--ash-mid);
		margin-top: var(--space-xl);
	}

	.bar-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		align-items: center;
	}

	.bar-group {
		width: 100%;
	}

	.bar-label {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.value {
		font-family: var(--font-stat);
		font-size: var(--size-stat-small);
		color: var(--text-primary);
		line-height: 1;
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.bar-track {
		height: 12px;
		background: var(--ash-mid);
		border-radius: 6px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 6px;
		transition: width 0.1s ease;
	}

	.bar-fill.accent {
		background: linear-gradient(
			90deg,
			var(--ember) 0%,
			var(--ember-glow) 100%
		);
	}

	.bar-fill.muted {
		background: var(--ash-light);
	}

	.arrow {
		color: var(--text-muted);
		transform: rotate(90deg);
	}

	@media (min-width: 640px) {
		.bar-container {
			flex-direction: row;
			gap: var(--space-lg);
		}

		.bar-group {
			flex: 1;
		}

		.arrow {
			transform: none;
			flex-shrink: 0;
		}
	}
</style>
