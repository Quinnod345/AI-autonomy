<script lang="ts">
	import ShareButtons from '$lib/components/ui/ShareButtons.svelte';

	interface Props {
		author: string;
		date: string;
		course?: string;
	}

	let { author, date, course }: Props = $props();
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-content">
			<div class="footer-meta">
				<p class="footer-author">
					Written by <strong>{author}</strong>
				</p>
				<p class="footer-date">{date}</p>
				{#if course}
					<p class="footer-course">{course}</p>
				{/if}
			</div>
			
			<div class="footer-share">
				<ShareButtons />
			</div>
		</div>
		
		<div class="footer-divider"></div>
		
		<p class="footer-copyright">
			© {new Date().getFullYear()} {author}. All rights reserved.
		</p>
	</div>
</footer>

<style>
	.footer {
		background: var(--charcoal);
		border-top: 1px solid var(--ash-mid);
		padding: var(--space-xl) var(--space-md);
		margin-top: var(--space-2xl);
	}

	.footer-inner {
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.footer-meta p {
		margin: 0 0 var(--space-xs);
	}

	.footer-author {
		font-family: var(--font-body);
		font-size: var(--size-body);
		color: var(--text-secondary);
	}

	.footer-author strong {
		color: var(--text-primary);
	}

	.footer-date {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		color: var(--text-muted);
	}

	.footer-course {
		font-size: var(--size-small);
		color: var(--text-muted);
		font-style: italic;
	}

	.footer-divider {
		height: 1px;
		background: var(--ash-mid);
		margin: var(--space-lg) 0;
	}

	.footer-copyright {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		color: var(--ash-light);
		margin: 0;
	}

	@media (min-width: 768px) {
		.footer-content {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
		}
	}
</style>

