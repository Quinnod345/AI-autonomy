<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		title?: string;
		url?: string;
	}

	let { 
		title = 'The Illusion of AI Autonomy',
		url = ''
	}: Props = $props();

	let copied = $state(false);
	let currentUrl = $state('');

	$effect(() => {
		if (browser) {
			currentUrl = url || window.location.href;
		}
	});

	function shareTwitter() {
		const text = encodeURIComponent(title);
		const shareUrl = encodeURIComponent(currentUrl);
		window.open(
			`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
			'_blank',
			'width=550,height=420'
		);
	}

	function shareLinkedIn() {
		const shareUrl = encodeURIComponent(currentUrl);
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
			'_blank',
			'width=550,height=420'
		);
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(currentUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="share-buttons">
	<span class="share-label">Share</span>
	
	<button 
		class="share-btn" 
		onclick={shareTwitter}
		aria-label="Share on Twitter"
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
		</svg>
	</button>
	
	<button 
		class="share-btn" 
		onclick={shareLinkedIn}
		aria-label="Share on LinkedIn"
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
		</svg>
	</button>
	
	<button 
		class="share-btn" 
		onclick={copyLink}
		aria-label={copied ? 'Link copied!' : 'Copy link'}
	>
		{#if copied}
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M20 6L9 17l-5-5"/>
			</svg>
		{:else}
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
				<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
			</svg>
		{/if}
	</button>
</div>

<style>
	.share-buttons {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.share-label {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.share-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--ash-mid);
		color: var(--text-secondary);
		border: none;
		cursor: pointer;
		transition: 
			background var(--transition-fast),
			color var(--transition-fast),
			transform var(--transition-fast);
	}

	.share-btn:hover {
		background: var(--ember);
		color: var(--smoke);
		transform: translateY(-2px);
	}

	.share-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.share-btn:active {
		transform: translateY(0);
	}
</style>

