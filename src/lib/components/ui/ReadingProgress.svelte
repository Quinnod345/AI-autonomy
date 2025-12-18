<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let progress = $state(0);
	let visible = $state(false);

	onMount(() => {
		if (!browser) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		function handleScroll() {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			
			if (docHeight > 0) {
				progress = (scrollTop / docHeight) * 100;
			}

			// Only show after scrolling past the hero
			visible = scrollTop > 100;
		}

		// Use requestAnimationFrame for smooth updates
		let ticking = false;
		function onScroll() {
			if (!ticking) {
				requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		handleScroll(); // Initial call

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div 
	class="reading-progress" 
	class:visible
	role="progressbar" 
	aria-valuenow={Math.round(progress)} 
	aria-valuemin={0} 
	aria-valuemax={100}
	aria-label="Reading progress"
>
	<div 
		class="progress-bar" 
		style="width: {progress}%"
	></div>
</div>

<style>
	.reading-progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: var(--ash-dark);
		z-index: 9999;
		opacity: 0;
		transition: opacity var(--transition-base);
	}

	.reading-progress.visible {
		opacity: 1;
	}

	.progress-bar {
		height: 100%;
		background: var(--ember);
		box-shadow: 0 0 10px var(--ember-glow), 0 0 5px var(--ember);
		transition: width 100ms ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		.progress-bar {
			transition: none;
		}

		.reading-progress {
			transition: none;
		}
	}
</style>
