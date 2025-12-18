<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		reverse?: boolean;
		ratio?: '1-1' | '2-1' | '1-2' | '3-2' | '2-3';
		gap?: 'normal' | 'large';
		alignItems?: 'start' | 'center' | 'end' | 'stretch';
		left: Snippet;
		right: Snippet;
	}

	let {
		reverse = false,
		ratio = '1-1',
		gap = 'normal',
		alignItems = 'start',
		left,
		right
	}: Props = $props();

	const ratioMap = {
		'1-1': '1fr 1fr',
		'2-1': '2fr 1fr',
		'1-2': '1fr 2fr',
		'3-2': '3fr 2fr',
		'2-3': '2fr 3fr'
	};
</script>

<div 
	class="split-layout gap-{gap}"
	class:reverse
	style="--columns: {ratioMap[ratio]}; --align: {alignItems}"
>
	<div class="split-left">
		{@render left()}
	</div>
	<div class="split-right">
		{@render right()}
	</div>
</div>

<style>
	.split-layout {
		display: grid;
		grid-template-columns: 1fr;
		align-items: var(--align);
	}

	.gap-normal {
		gap: var(--space-lg);
	}

	.gap-large {
		gap: var(--space-xl);
	}

	.split-left,
	.split-right {
		min-width: 0; /* Prevent overflow */
		display: flex;
		flex-direction: column;
	}

	/* Stretch children when align-items is stretch */
	.split-left > :global(*),
	.split-right > :global(*) {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.split-left > :global(*) > :global(*),
	.split-right > :global(*) > :global(*) {
		flex: 1;
	}

	/* Stack order on mobile when reversed */
	.reverse .split-left {
		order: 2;
	}

	.reverse .split-right {
		order: 1;
	}

	@media (min-width: 768px) {
		.split-layout {
			grid-template-columns: var(--columns);
		}

		/* Reset order on desktop */
		.reverse .split-left {
			order: 1;
		}

		.reverse .split-right {
			order: 2;
		}

		/* Actual reverse on desktop */
		.reverse {
			direction: rtl;
		}

		.reverse > * {
			direction: ltr;
		}
	}
</style>

