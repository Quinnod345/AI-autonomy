<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { NoiseCanvas, Beams } from '$lib/components/effects';
	import { BackToTop, ReadingProgress } from '$lib/components/ui';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>The Illusion of AI Autonomy</title>
</svelte:head>

<ReadingProgress />

<Beams
	beamWidth={2}
	beamHeight={20}
	beamNumber={16}
	lightColor="#c45e1a"
	speed={4}
	noiseIntensity={2}
	scale={0.15}
	rotation={-15}
	opacity={0.6}
/>
<NoiseCanvas />

<main id="main-content">
	{@render children()}
</main>

<BackToTop />
