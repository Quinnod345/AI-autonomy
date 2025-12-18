<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import InView from '$lib/components/effects/InView.svelte';
	import { complexityCliff } from '$lib/data/statistics';

	let svg: SVGSVGElement;
	let isVisible = $state(false);
	let pathLength = $state(0);
	let animationProgress = $state(0);

	const padding = { top: 40, right: 40, bottom: 60, left: 60 };
	const width = 600;
	const height = 400;
	const chartWidth = width - padding.left - padding.right;
	const chartHeight = height - padding.top - padding.bottom;

	const data = complexityCliff.dataPoints;
	const maxComplexity = Math.max(...data.map(d => d.complexity));
	const maxAccuracy = 100;

	// Scale functions
	function xScale(val: number): number {
		return (val / maxComplexity) * chartWidth;
	}

	function yScale(val: number): number {
		return chartHeight - (val / maxAccuracy) * chartHeight;
	}

	// Generate path
	function generatePath(): string {
		const points = data.map(d => `${padding.left + xScale(d.complexity)},${padding.top + yScale(d.accuracy)}`);
		return `M ${points.join(' L ')}`;
	}

	// Generate area path for fill
	function generateAreaPath(): string {
		const linePath = data.map(d => `${padding.left + xScale(d.complexity)},${padding.top + yScale(d.accuracy)}`);
		const startX = padding.left + xScale(data[0].complexity);
		const endX = padding.left + xScale(data[data.length - 1].complexity);
		const bottomY = padding.top + chartHeight;
		return `M ${startX},${bottomY} L ${linePath.join(' L ')} L ${endX},${bottomY} Z`;
	}

	const linePath = generatePath();
	const areaPath = generateAreaPath();

	onMount(() => {
		if (!browser) return;

		// Get actual path length for animation
		const pathElement = svg?.querySelector('.chart-line') as SVGPathElement;
		if (pathElement) {
			pathLength = pathElement.getTotalLength();
		}
	});

	function handleVisible() {
		isVisible = true;
		// Animate the line drawing
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			animationProgress = 1;
			return;
		}

		const duration = 2500;
		const startTime = performance.now();

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// Ease out cubic
			animationProgress = 1 - Math.pow(1 - progress, 3);

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		}

		requestAnimationFrame(animate);
	}

	let dashOffset = $derived(pathLength * (1 - animationProgress));
</script>

<InView animation="none" once={true} threshold={0.3}>
	<div class="chart-container" role="img" aria-label="Chart showing AI accuracy dropping dramatically as problem complexity increases">
		<h4 class="chart-title">Accuracy vs Problem Complexity</h4>
		<p class="chart-subtitle">The Cliff: Where AI reasoning collapses</p>
		
		<svg 
			bind:this={svg}
			viewBox="0 0 {width} {height}"
			class="complexity-chart"
			class:visible={isVisible}
			onmouseenter={handleVisible}
			role="graphics-document"
			aria-label="Line chart showing accuracy versus complexity"
		>
			<!-- Grid lines -->
			{#each [0, 25, 50, 75, 100] as tick}
				<line
					x1={padding.left}
					y1={padding.top + yScale(tick)}
					x2={padding.left + chartWidth}
					y2={padding.top + yScale(tick)}
					class="grid-line"
				/>
				<text
					x={padding.left - 10}
					y={padding.top + yScale(tick)}
					class="axis-label y-label"
				>
					{tick}%
				</text>
			{/each}

			<!-- X axis labels -->
			{#each data as point, i}
				<text
					x={padding.left + xScale(point.complexity)}
					y={padding.top + chartHeight + 25}
					class="axis-label x-label"
				>
					{point.label}
				</text>
				{#if i < data.length - 1}
					<line
						x1={padding.left + xScale(point.complexity)}
						y1={padding.top + chartHeight}
						x2={padding.left + xScale(point.complexity)}
						y2={padding.top + chartHeight + 5}
						class="tick-mark"
					/>
				{/if}
			{/each}

			<!-- The cliff zone highlight -->
			<rect
				x={padding.left + xScale(complexityCliff.cliffPoint)}
				y={padding.top}
				width={chartWidth - xScale(complexityCliff.cliffPoint)}
				height={chartHeight}
				class="cliff-zone"
				style="opacity: {animationProgress * 0.2}"
			/>

			<!-- Area fill -->
			<path
				d={areaPath}
				class="chart-area"
				style="opacity: {animationProgress * 0.3}"
			/>

			<!-- Main line -->
			<path
				d={linePath}
				class="chart-line"
				style="stroke-dasharray: {pathLength}; stroke-dashoffset: {dashOffset}"
			/>

			<!-- Data points -->
			{#each data as point, i}
				<circle
					cx={padding.left + xScale(point.complexity)}
					cy={padding.top + yScale(point.accuracy)}
					r="6"
					class="data-point"
					class:cliff={point.complexity >= complexityCliff.cliffPoint}
					style="opacity: {animationProgress}; transform-origin: {padding.left + xScale(point.complexity)}px {padding.top + yScale(point.accuracy)}px; transform: scale({animationProgress})"
				/>
			{/each}

			<!-- Cliff annotation -->
			{#if animationProgress > 0.8}
				<g class="cliff-annotation" style="opacity: {(animationProgress - 0.8) * 5}">
					<text
						x={padding.left + xScale(complexityCliff.cliffPoint + 0.5)}
						y={padding.top + yScale(50)}
						class="cliff-label"
					>
						THE CLIFF
					</text>
					<text
						x={padding.left + xScale(complexityCliff.cliffPoint + 0.5)}
						y={padding.top + yScale(50) + 18}
						class="cliff-sublabel"
					>
						Accuracy collapses to 0%
					</text>
				</g>
			{/if}

			<!-- Axis labels -->
			<text
				x={width / 2}
				y={height - 5}
				class="axis-title"
			>
				Problem Complexity →
			</text>
			<text
				x={-height / 2}
				y={15}
				class="axis-title y-axis-title"
				transform="rotate(-90)"
			>
				Accuracy
			</text>
		</svg>

		<p class="chart-source">Source: Apple Machine Learning Research, "The Illusion of Thinking"</p>
	</div>
</InView>

<style>
	.chart-container {
		background: var(--ash-dark);
		border-radius: 12px;
		padding: var(--space-md);
		border: 1px solid var(--ash-mid);
		margin: var(--space-lg) 0;
	}

	.chart-title {
		font-family: var(--font-display);
		font-size: var(--size-subsection);
		color: var(--text-primary);
		margin: 0 0 var(--space-xs);
	}

	.chart-subtitle {
		font-size: var(--size-small);
		color: var(--accent);
		font-style: italic;
		margin: 0 0 var(--space-md);
	}

	.complexity-chart {
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.grid-line {
		stroke: var(--ash-mid);
		stroke-width: 1;
		stroke-dasharray: 4 4;
	}

	.tick-mark {
		stroke: var(--ash-light);
		stroke-width: 1;
	}

	.axis-label {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: var(--text-muted);
	}

	.y-label {
		text-anchor: end;
		dominant-baseline: middle;
	}

	.x-label {
		text-anchor: middle;
		font-size: 9px;
	}

	.axis-title {
		font-family: var(--font-mono);
		font-size: 12px;
		fill: var(--text-secondary);
		text-anchor: middle;
	}

	.y-axis-title {
		dominant-baseline: hanging;
	}

	.cliff-zone {
		fill: var(--ember-dark);
	}

	.chart-area {
		fill: url(#areaGradient);
		fill: linear-gradient(180deg, var(--ember) 0%, transparent 100%);
		fill: var(--ember);
	}

	.chart-line {
		fill: none;
		stroke: var(--ember);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.data-point {
		fill: var(--smoke);
		stroke: var(--ember);
		stroke-width: 2;
		transition: transform 0.2s ease;
	}

	.data-point.cliff {
		fill: var(--ember);
		stroke: var(--ember-glow);
	}

	.data-point:hover {
		transform: scale(1.5) !important;
	}

	.cliff-annotation text {
		text-anchor: start;
	}

	.cliff-label {
		font-family: var(--font-stat);
		font-size: 18px;
		fill: var(--ember-glow);
		letter-spacing: 0.1em;
	}

	.cliff-sublabel {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: var(--text-muted);
	}

	.chart-source {
		font-size: var(--size-tiny);
		color: var(--text-muted);
		margin-top: var(--space-sm);
		margin-bottom: 0;
		text-align: right;
	}

	@media (max-width: 640px) {
		.chart-container {
			padding: var(--space-sm);
		}

		.x-label {
			font-size: 7px;
		}

		.cliff-label {
			font-size: 14px;
		}
	}
</style>

