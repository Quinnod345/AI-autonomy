<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let scrollY = 0;

	onMount(() => {
		if (!browser) return;

		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Calculate gradient shift based on scroll
	let gradientShift = $derived(Math.min(scrollY / 3000, 0.3));
</script>

<div 
	class="gradient-layer" 
	style="--gradient-shift: {gradientShift}"
	aria-hidden="true"
></div>

<style>
	.gradient-layer {
		position: fixed;
		inset: 0;
		/* Deep, sophisticated dark gradient with subtle warm undertones */
		background: 
			/* Radial vignette for depth */
			radial-gradient(
				ellipse 120% 80% at 50% 100%,
				hsla(20, 25%, 8%, 0.4) 0%,
				transparent 70%
			),
			/* Main vertical gradient - very subtle, dark-focused */
			linear-gradient(
				180deg,
				hsl(0, 0%, 4%) 0%,
				hsl(20, 8%, 5%) 20%,
				hsl(18, 10%, 6%) 40%,
				hsl(20, 12%, 7%) 60%,
				hsl(18, 15%, 8%) 80%,
				hsl(15, 18%, 10%) 100%
			);
		z-index: -1;
	}

	/* Subtle warm glow at bottom - separate layer for elegance */
	.gradient-layer::after {
		content: '';
		position: absolute;
		inset: 0;
		background: 
			radial-gradient(
				ellipse 100% 50% at 50% 100%,
				hsla(20, 60%, 20%, 0.15) 0%,
				hsla(15, 50%, 15%, 0.08) 30%,
				transparent 60%
			);
		pointer-events: none;
	}
</style>

