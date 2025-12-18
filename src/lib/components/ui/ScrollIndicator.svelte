<script lang="ts">
	interface Props {
		text?: string;
	}

	let { text = 'Scroll to explore' }: Props = $props();
</script>

<div class="scroll-indicator" aria-hidden="true">
	<span class="scroll-text">{text}</span>
	<div class="scroll-arrow">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M12 5v14M5 12l7 7 7-7"/>
		</svg>
	</div>
</div>

<style>
	.scroll-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
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

	@media (prefers-reduced-motion: reduce) {
		.scroll-arrow {
			animation: none;
		}
	}
</style>

