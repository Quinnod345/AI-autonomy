<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let prefersReducedMotion = false;

	onMount(() => {
		if (!browser) return;

		// Check for reduced motion preference
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mediaQuery.matches;

		mediaQuery.addEventListener('change', (e) => {
			prefersReducedMotion = e.matches;
			if (prefersReducedMotion && animationId) {
				cancelAnimationFrame(animationId);
			} else if (!prefersReducedMotion) {
				animate();
			}
		});

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size to match window
		const resize = () => {
			// Use lower resolution for performance
			const dpr = Math.min(window.devicePixelRatio, 1);
			canvas.width = window.innerWidth * dpr * 0.5;
			canvas.height = window.innerHeight * dpr * 0.5;
		};
		resize();
		window.addEventListener('resize', resize);

		const imageData = ctx.createImageData(canvas.width, canvas.height);
		let frameCount = 0;

		function generateNoise() {
			// Only update every 2 frames for performance (30fps)
			frameCount++;
			if (frameCount % 2 !== 0) {
				animationId = requestAnimationFrame(generateNoise);
				return;
			}

			const data = imageData.data;
			for (let i = 0; i < data.length; i += 4) {
				const noise = Math.random() * 255;
				data[i] = noise;     // R
				data[i + 1] = noise; // G
				data[i + 2] = noise; // B
				data[i + 3] = 20;    // A (subtle opacity)
			}
			ctx.putImageData(imageData, 0, 0);
			animationId = requestAnimationFrame(generateNoise);
		}

		function animate() {
			if (!prefersReducedMotion) {
				generateNoise();
			} else {
				// Static noise for reduced motion
				const data = imageData.data;
				for (let i = 0; i < data.length; i += 4) {
					const noise = Math.random() * 255;
					data[i] = noise;
					data[i + 1] = noise;
					data[i + 2] = noise;
					data[i + 3] = 15;
				}
				ctx.putImageData(imageData, 0, 0);
			}
		}

		animate();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="noise-layer" aria-hidden="true"></canvas>

<style>
	.noise-layer {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		mix-blend-mode: overlay;
		opacity: 0.4;
		z-index: 1000;
		image-rendering: pixelated;
	}
</style>

