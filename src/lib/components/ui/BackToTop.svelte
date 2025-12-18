<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let visible = $state(false);

	onMount(() => {
		if (!browser) return;

		const handleScroll = () => {
			visible = window.scrollY > 500;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

<button
	class="back-to-top"
	class:visible
	onclick={scrollToTop}
	aria-label="Back to top"
>
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M12 19V5M5 12l7-7 7 7"/>
	</svg>
</button>

<style>
	.back-to-top {
		position: fixed;
		bottom: var(--space-lg);
		right: var(--space-lg);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--ember);
		color: var(--smoke);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		visibility: hidden;
		transform: translateY(20px);
		transition: 
			opacity var(--transition-base),
			visibility var(--transition-base),
			transform var(--transition-base),
			background var(--transition-fast);
		z-index: 100;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.back-to-top.visible {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}

	.back-to-top:hover {
		background: var(--ember-glow);
		transform: translateY(-2px);
	}

	.back-to-top:focus-visible {
		outline: 2px solid var(--smoke);
		outline-offset: 2px;
	}

	.back-to-top:active {
		transform: translateY(0);
	}

	@media (max-width: 640px) {
		.back-to-top {
			bottom: var(--space-md);
			right: var(--space-md);
			width: 44px;
			height: 44px;
		}
	}
</style>

