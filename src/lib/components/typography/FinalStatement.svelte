<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		text?: string;
	}

	let { text = "The danger is not the machine. The danger is us, forgetting what only we can do." }: Props = $props();

	let element: HTMLDivElement;
	let words: { text: string; isStrong: boolean; isBreak: boolean }[] = $state([]);
	let isVisible = $state(false);
	let hasAnimated = false;

	// Parse the text into words, preserving line breaks and strong tags
	$effect(() => {
		const parts = text.split(/(<br\s*\/?>|<strong>.*?<\/strong>)/gi);
		const result: { text: string; isStrong: boolean; isBreak: boolean }[] = [];
		
		for (const part of parts) {
			if (!part) continue;
			
			if (part.match(/<br\s*\/?>/i)) {
				result.push({ text: '', isStrong: false, isBreak: true });
			} else if (part.match(/<strong>(.*?)<\/strong>/i)) {
				const match = part.match(/<strong>(.*?)<\/strong>/i);
				if (match) {
					const strongWords = match[1].split(/\s+/);
					strongWords.forEach((word, i) => {
						result.push({ text: word, isStrong: true, isBreak: false });
					});
				}
			} else {
				const plainWords = part.split(/\s+/).filter(w => w);
				plainWords.forEach(word => {
					result.push({ text: word, isStrong: false, isBreak: false });
				});
			}
		}
		
		words = result;
	});

	onMount(() => {
		if (!browser) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated) {
					hasAnimated = true;
					
					if (prefersReducedMotion) {
						isVisible = true;
					} else {
						// Stagger the animation start slightly
						setTimeout(() => {
							isVisible = true;
						}, 200);
					}

					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<div bind:this={element} class="final-statement">
	<div class="statement-content" class:visible={isVisible}>
		{#each words as word, i}
			{#if word.isBreak}
				<br />
			{:else}
				<span 
					class="word"
					class:strong={word.isStrong}
					class:visible={isVisible}
					style="--word-index: {i}; --word-delay: {i * 80}ms"
				>{word.text}</span>{' '}
			{/if}
		{/each}
	</div>
	<div class="ember-glow" aria-hidden="true"></div>
	<div class="line-accent top" aria-hidden="true"></div>
	<div class="line-accent bottom" aria-hidden="true"></div>
</div>

<style>
	.final-statement {
		position: relative;
		text-align: center;
		padding: var(--space-xl) var(--space-md);
		margin: var(--space-xl) 0;
	}

	.statement-content {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: 400;
		font-style: italic;
		line-height: var(--leading-snug);
		color: var(--text-primary);
		max-width: 900px;
		margin: 0 auto;
		/* Preserve natural word spacing and wrapping */
		word-spacing: normal;
		white-space: normal;
	}

	.word {
		display: inline;
		opacity: 0;
		transform: translateY(20px);
		filter: blur(8px);
		transition: 
			opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
			filter 0.6s cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: var(--word-delay);
	}

	.word.visible {
		opacity: 1;
		transform: translateY(0);
		filter: blur(0);
	}

	.word.strong {
		color: var(--accent);
		font-weight: 600;
	}

	.word.strong.visible {
		text-shadow: 0 0 30px var(--ember-glow);
		animation: ember-pulse 2s ease-in-out infinite;
		animation-delay: calc(var(--word-delay) + 0.6s);
	}

	@keyframes ember-pulse {
		0%, 100% {
			text-shadow: 0 0 20px var(--ember-glow);
		}
		50% {
			text-shadow: 0 0 40px var(--ember-glow), 0 0 60px var(--ember);
		}
	}

	/* Decorative line accents */
	.line-accent {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--ember) 30%,
			var(--ember-glow) 50%,
			var(--ember) 70%,
			transparent 100%
		);
		transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: 0.8s;
	}

	.line-accent.top {
		top: 0;
	}

	.line-accent.bottom {
		bottom: 0;
	}

	.statement-content.visible ~ .line-accent {
		width: 60%;
	}

	/* Ember glow effect behind text */
	.ember-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0%;
		height: 120%;
		background: radial-gradient(
			ellipse at center,
			rgba(196, 94, 26, 0.2) 0%,
			transparent 70%
		);
		z-index: -1;
		pointer-events: none;
		transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: 0.3s;
		opacity: 0;
	}

	.statement-content.visible ~ .ember-glow {
		width: 100%;
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.word {
			opacity: 1;
			transform: none;
			filter: none;
			transition: none;
		}

		.line-accent {
			width: 60%;
			transition: none;
		}

		.ember-glow {
			width: 80%;
			opacity: 0.8;
			transition: none;
		}

		.word.strong.visible {
			animation: none;
			text-shadow: 0 0 20px var(--ember-glow);
		}
	}
</style>
