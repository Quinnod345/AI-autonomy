<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		value: number;
		suffix?: string;
		prefix?: string;
		duration?: number;
		decimals?: number;
	}

	let {
		value,
		suffix = '',
		prefix = '',
		duration = 2000,
		decimals = 0
	}: Props = $props();

	let displayValue = $state(0);
	let element: HTMLSpanElement;
	let hasAnimated = false;

	onMount(() => {
		if (!browser) return;

		// Check for reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			displayValue = value;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated) {
					hasAnimated = true;
					animateValue();
					observer.disconnect();
				}
			},
			{ threshold: 0.5 }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});

	function animateValue() {
		const startTime = performance.now();
		const startValue = 0;

		function update(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function (ease-out cubic)
			const eased = 1 - Math.pow(1 - progress, 3);

			displayValue = startValue + (value - startValue) * eased;

			if (progress < 1) {
				requestAnimationFrame(update);
			} else {
				displayValue = value;
			}
		}

		requestAnimationFrame(update);
	}

	let formattedValue = $derived(displayValue.toFixed(decimals));
</script>

<span 
	bind:this={element} 
	class="animated-counter"
	aria-live="polite"
	aria-label="{prefix}{value}{suffix}"
>
	<span class="counter-value" aria-hidden="true">
		{prefix}{formattedValue}{suffix}
	</span>
</span>

<style>
	.animated-counter {
		display: inline-block;
		font-family: var(--font-stat);
		font-variant-numeric: tabular-nums;
	}

	.counter-value {
		display: inline-block;
	}
</style>

