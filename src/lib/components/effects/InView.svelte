<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	interface Props {
		threshold?: number;
		rootMargin?: string;
		once?: boolean;
		delay?: number;
		animation?: 'fade-up' | 'fade' | 'slide-left' | 'slide-right' | 'scale' | 'none';
		children: Snippet;
	}

	let {
		threshold = 0.2,
		rootMargin = '0px',
		once = true,
		delay = 0,
		animation = 'fade-up',
		children
	}: Props = $props();

	let element: HTMLDivElement;
	let isVisible = $state(false);

	onMount(() => {
		if (!browser) return;

		// Check for reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			isVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (delay > 0) {
						setTimeout(() => {
							isVisible = true;
						}, delay);
					} else {
						isVisible = true;
					}
					
					if (once) {
						observer.disconnect();
					}
				} else if (!once) {
					isVisible = false;
				}
			},
			{ threshold, rootMargin }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="in-view {animation}"
	class:visible={isVisible}
	style="--delay: {delay}ms"
>
	{@render children()}
</div>

<style>
	.in-view {
		will-change: transform, opacity;
	}

	/* Fade Up Animation */
	.in-view.fade-up {
		opacity: 0;
		transform: translateY(30px);
		transition: 
			opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.in-view.fade-up.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* Simple Fade Animation */
	.in-view.fade {
		opacity: 0;
		transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.in-view.fade.visible {
		opacity: 1;
	}

	/* Slide Left Animation */
	.in-view.slide-left {
		opacity: 0;
		transform: translateX(-40px);
		transition: 
			opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.in-view.slide-left.visible {
		opacity: 1;
		transform: translateX(0);
	}

	/* Slide Right Animation */
	.in-view.slide-right {
		opacity: 0;
		transform: translateX(40px);
		transition: 
			opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.in-view.slide-right.visible {
		opacity: 1;
		transform: translateX(0);
	}

	/* Scale Animation */
	.in-view.scale {
		opacity: 0;
		transform: scale(0.95);
		transition: 
			opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.in-view.scale.visible {
		opacity: 1;
		transform: scale(1);
	}

	/* No Animation */
	.in-view.none {
		opacity: 1;
		transform: none;
	}

	/* Reduced motion fallback */
	@media (prefers-reduced-motion: reduce) {
		.in-view {
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
		}
	}
</style>

