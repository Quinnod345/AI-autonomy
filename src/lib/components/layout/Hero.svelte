<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		title: string;
		subtitle: string;
		author: string;
	}

	let { title, subtitle, author }: Props = $props();

	let heroSection: HTMLElement;
	let heroContent: HTMLElement;
	let titleEl: HTMLElement;
	let subtitleEl: HTMLElement;
	let authorEl: HTMLElement;
	let scrollIndicator: HTMLElement;

	let titleWords: string[] = $state([]);
	let heroVisible = $state(false);

	// Split title into words for stagger animation
	$effect(() => {
		titleWords = title.split(' ');
	});

	onMount(async () => {
		if (!browser) return;

		// Check for reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			heroVisible = true;
			return;
		}

		// Dynamically import GSAP
		const gsap = (await import('gsap')).default;
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Initial entrance animation
		const words = titleEl.querySelectorAll('.word');
		
		// Set initial states - words start with ember glow
		gsap.set(words, { 
			opacity: 0, 
			y: 50, 
			filter: 'blur(8px)',
			color: '#c45e1a',
			textShadow: '0 0 30px rgba(196, 94, 26, 0.8), 0 0 60px rgba(196, 94, 26, 0.4)'
		});
		gsap.set(subtitleEl, { opacity: 0, y: 30 });
		gsap.set(authorEl, { opacity: 0, y: 20 });
		gsap.set(scrollIndicator, { opacity: 0, y: -20 });

		// Create entrance timeline
		const entranceTl = gsap.timeline({ delay: 0.3 });

		entranceTl
			// Phase 1: Words appear with ember glow
			.to(words, {
				opacity: 1,
				y: 0,
				filter: 'blur(0px)',
				duration: 0.8,
				stagger: 0.1,
				ease: 'power3.out',
				onStart: () => { heroVisible = true; }
			})
			// Phase 2: Ember glow fades to normal text color
			.to(words, {
				color: 'var(--text-primary)',
				textShadow: '0 0 0px rgba(196, 94, 26, 0)',
				duration: 1.2,
				stagger: 0.08,
				ease: 'power2.out'
			}, '-=0.4')
			.to(subtitleEl, {
				opacity: 1,
				y: 0,
				duration: 0.6,
				ease: 'power2.out'
			}, '-=0.3')
			.to(authorEl, {
				opacity: 1,
				y: 0,
				duration: 0.5,
				ease: 'power2.out'
			}, '-=0.2')
			.to(scrollIndicator, {
				opacity: 1,
				y: 0,
				duration: 0.5,
				ease: 'power2.out'
			}, '-=0.2');

		// Sticky scroll-out animation timeline
		const scrollTl = gsap.timeline({
			scrollTrigger: {
				trigger: heroSection,
				start: 'top top',
				end: '+=150%',
				scrub: 0.8,
				pin: true,
				pinSpacing: true,
				anticipatePin: 1
			}
		});

		scrollTl
			// Phase 1: Title drifts up and fades with blur
			.to(titleEl, {
				y: -80,
				opacity: 0.3,
				filter: 'blur(4px)',
				duration: 1,
				ease: 'none'
			}, 0)
			// Phase 2: Subtitle drifts and fades faster
			.to(subtitleEl, {
				y: -60,
				opacity: 0,
				duration: 0.7,
				ease: 'none'
			}, 0.1)
			// Phase 3: Author fades out
			.to(authorEl, {
				opacity: 0,
				y: -40,
				duration: 0.5,
				ease: 'none'
			}, 0.2)
			// Phase 4: Scroll indicator fades first
			.to(scrollIndicator, {
				opacity: 0,
				y: -30,
				duration: 0.3,
				ease: 'none'
			}, 0)
			// Phase 5: Title continues to compress and burn out
			.to(titleEl, {
				y: -150,
				scale: 0.85,
				opacity: 0,
				filter: 'blur(12px)',
				duration: 1,
				ease: 'power1.in'
			}, 0.6)
			// Phase 6: Ember particles intensify then fade
			.to('.ember-particles', {
				opacity: 0,
				duration: 0.8,
				ease: 'none'
			}, 0.8);

		return () => {
			ScrollTrigger.getAll().forEach(st => st.kill());
		};
	});
</script>

<section 
	bind:this={heroSection}
	class="hero" 
	aria-label="Article hero"
>
	<div bind:this={heroContent} class="hero-content" class:visible={heroVisible}>
		<h1 bind:this={titleEl} class="hero-title">
			{#each titleWords as word, i}
				<span 
					class="word"
					aria-hidden="true"
				>{word}{#if i < titleWords.length - 1}&nbsp;{/if}</span>
			{/each}
			<span class="visually-hidden">{title}</span>
		</h1>

		<p bind:this={subtitleEl} class="hero-subtitle">
			{subtitle}
		</p>

		<p bind:this={authorEl} class="hero-author">
			by <span class="author-name">{author}</span>
		</p>
	</div>

	<div bind:this={scrollIndicator} class="scroll-indicator" aria-hidden="true">
		<span class="scroll-text">Scroll to explore</span>
		<div class="scroll-arrow">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 5v14M5 12l7 7 7-7"/>
			</svg>
		</div>
	</div>

	<!-- Decorative ember particles -->
	<div class="ember-particles" aria-hidden="true">
		{#each Array(20) as _, i}
			<div 
				class="particle"
				style="
					--x: {Math.random() * 100}%;
					--y: {50 + Math.random() * 50}%;
					--delay: {Math.random() * 5}s;
					--duration: {3 + Math.random() * 4}s;
					--size: {2 + Math.random() * 4}px;
				"
			></div>
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: var(--space-xl) var(--space-md);
		overflow: hidden;
		will-change: transform;
	}

	.hero-content {
		max-width: 1000px;
		z-index: 1;
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: var(--size-hero);
		font-weight: 600;
		line-height: var(--leading-tight);
		color: var(--text-primary);
		margin: 0 0 var(--space-md);
		letter-spacing: -0.02em;
		word-break: keep-all;
		overflow-wrap: normal;
		hyphens: none;
		will-change: transform, opacity, filter;
	}

	.word {
		display: inline-block;
		white-space: nowrap;
		will-change: transform, opacity, filter, color, text-shadow;
	}

	.hero-subtitle {
		font-family: var(--font-body);
		font-size: var(--size-body-large);
		font-style: italic;
		color: var(--accent);
		margin: 0 0 var(--space-lg);
		will-change: transform, opacity;
	}

	.hero-author {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		color: var(--text-muted);
		margin: 0;
		will-change: transform, opacity;
	}

	.author-name {
		color: var(--text-secondary);
		font-weight: 500;
	}

	.scroll-indicator {
		position: absolute;
		bottom: var(--space-lg);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		will-change: transform, opacity;
	}

	.scroll-text {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.scroll-arrow {
		color: var(--accent);
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(8px);
		}
	}

	/* Ember particles */
	.ember-particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.particle {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--size);
		height: var(--size);
		background: var(--ember);
		border-radius: 50%;
		opacity: 0;
		animation: float var(--duration) var(--delay) ease-in-out infinite;
		box-shadow: 0 0 6px 2px var(--ember-glow);
	}

	@keyframes float {
		0%, 100% {
			opacity: 0;
			transform: translateY(0) scale(0);
		}
		10% {
			opacity: 0.7;
			transform: translateY(-10px) scale(1);
		}
		90% {
			opacity: 0.2;
			transform: translateY(-80px) scale(0.4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-arrow {
			animation: none;
		}

		.particle {
			display: none;
		}

		.word {
			opacity: 1;
			transform: none;
			filter: none;
		}

		.hero-subtitle,
		.hero-author,
		.scroll-indicator {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: var(--space-lg) var(--space-sm);
		}

		.scroll-indicator {
			bottom: var(--space-md);
		}
	}
</style>
