<script lang="ts">
	import { browser } from '$app/environment';

	// Tower state
	type Peg = number[]; // Array of disk sizes (larger number = larger disk)

	let pegs = $state<[Peg, Peg, Peg]>([[], [], []]);
	let diskCount = $state(3);
	let isRunning = $state(false);
	let isThinking = $state(false);
	let moveCount = $state(0);
	let invalidMoveCount = $state(0);
	let status = $state<'idle' | 'running' | 'success' | 'failed' | 'error'>('idle');
	let statusMessage = $state('');
	let aiReasoning = $state('');
	let displayedReasoning = $state('');
	let moveHistory = $state<Array<{ from: number; to: number }>>([]);
	
	// Animation state
	let animatingDisk = $state<number | null>(null);
	let animationPhase = $state<'idle' | 'lifting' | 'moving' | 'dropping'>('idle');
	let animationFromPeg = $state(0);
	let animationToPeg = $state(0);
	let containerRef = $state<HTMLElement | null>(null);

	const ANIMATION_TIMING = {
		lift: 250,
		move: 400,
		drop: 200,
		pause: 100
	};

	const MAX_MOVES = 100;
	const MAX_INVALID_MOVES = 5;
	const PEG_NAMES = ['A', 'B', 'C'];

	// Optimal moves for Tower of Hanoi: 2^n - 1
	function optimalMoves(n: number): number {
		return Math.pow(2, n) - 1;
	}

	// Initialize pegs with disks
	function initializePegs() {
		const disks = Array.from({ length: diskCount }, (_, i) => diskCount - i);
		pegs = [disks, [], []];
		moveCount = 0;
		invalidMoveCount = 0;
		status = 'idle';
		statusMessage = '';
		aiReasoning = '';
		displayedReasoning = '';
		moveHistory = [];
	}

	// Check if puzzle is solved
	function isSolved(): boolean {
		return pegs[2].length === diskCount;
	}

	// Validate a move
	function isValidMove(from: number, to: number): boolean {
		if (from < 0 || from > 2 || to < 0 || to > 2) return false;
		if (from === to) return false;
		if (pegs[from].length === 0) return false;

		const disk = pegs[from][pegs[from].length - 1];
		if (pegs[to].length > 0 && pegs[to][pegs[to].length - 1] < disk) {
			return false; // Can't place larger disk on smaller
		}
		return true;
	}

	// Execute a move with animation
	async function executeMove(from: number, to: number) {
		const disk = pegs[from][pegs[from].length - 1];
		animatingDisk = disk;
		animationFromPeg = from;
		animationToPeg = to;

		// Phase 1: Lift disk up
		animationPhase = 'lifting';
		await sleep(ANIMATION_TIMING.lift);

		// Phase 2: Move horizontally
		animationPhase = 'moving';
		await sleep(ANIMATION_TIMING.move);

		// Phase 3: Drop disk down
		animationPhase = 'dropping';
		await sleep(ANIMATION_TIMING.drop);

		// Complete the move in state
		const newPegs: [Peg, Peg, Peg] = [[...pegs[0]], [...pegs[1]], [...pegs[2]]];
		newPegs[from].pop();
		newPegs[to].push(disk);
		pegs = newPegs;
		moveCount++;
		moveHistory = [...moveHistory, { from, to }];

		// Reset animation state
		animationPhase = 'idle';
		animatingDisk = null;
		
		await sleep(ANIMATION_TIMING.pause);
	}

	// Call the AI API for the next move with streaming
	async function getAIMove(): Promise<{
		from: number;
		to: number;
		reasoning: string;
		thoughts?: string[];
		error?: string;
	} | null> {
		// Clear previous reasoning for new move
		displayedReasoning = '';
		
		try {
			const response = await fetch('/api/hanoi', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pegs,
					diskCount,
					moveHistory
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`API error: ${response.status} - ${errorText}`);
			}

			// Handle streaming response
			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error('No response body');
			}

			const decoder = new TextDecoder();
			let result: {
				from: number;
				to: number;
				reasoning: string;
				thoughts?: string[];
				error?: string;
			} | null = null;

			let currentReasoningText = '';
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				buffer += chunk;
				
				// Split on double newlines (SSE format)
				const parts = buffer.split('\n\n');
				buffer = parts.pop() || ''; // Keep incomplete part

				for (const part of parts) {
					const lines = part.split('\n');
					for (const line of lines) {
						if (!line.startsWith('data: ')) continue;
						const data = line.slice(6).trim();
						if (!data || data === '[DONE]') continue;

						try {
							const parsed = JSON.parse(data);

							if (parsed.type === 'reasoning') {
								// Stream reasoning text in real-time
								currentReasoningText += parsed.text;
								displayedReasoning = currentReasoningText;
							} else if (parsed.type === 'complete') {
								result = {
									from: parsed.from,
									to: parsed.to,
									reasoning: parsed.reasoning,
									thoughts: parsed.thoughts,
									error: parsed.error
								};
							}
						} catch {
							// Skip invalid JSON
						}
					}
				}
			}

			return result;
		} catch (err) {
			console.error('Failed to get AI move:', err);
			return null;
		}
	}

	// Run the AI attempt
	async function runAIAttempt() {
		if (isRunning) return;

		initializePegs();
		isRunning = true;
		status = 'running';
		statusMessage = 'Starting AI attempt...';

		while (!isSolved() && moveCount < MAX_MOVES && invalidMoveCount < MAX_INVALID_MOVES) {
			isThinking = true;
			// Keep previous aiReasoning visible while thinking

			const aiResponse = await getAIMove();

			if (!aiResponse) {
				status = 'error';
				statusMessage = 'Failed to get response from AI. Check API configuration.';
				aiReasoning = 'Connection error';
				isThinking = false;
				isRunning = false;
				return;
			}

			if (aiResponse.error) {
				status = 'failed';
				statusMessage = aiResponse.error;
				aiReasoning = aiResponse.reasoning || 'AI encountered an error';
				isThinking = false;
				isRunning = false;
				return;
			}

		isThinking = false;
		aiReasoning = aiResponse.reasoning;

			// Validate the move
			if (!isValidMove(aiResponse.from, aiResponse.to)) {
				invalidMoveCount++;
				statusMessage = `Invalid move suggested: ${PEG_NAMES[aiResponse.from]} → ${PEG_NAMES[aiResponse.to]} (${invalidMoveCount}/${MAX_INVALID_MOVES} invalid)`;
				aiReasoning = `INVALID: ${aiResponse.reasoning}`;

				if (invalidMoveCount >= MAX_INVALID_MOVES) {
					status = 'failed';
					statusMessage = `AI failed after ${invalidMoveCount} invalid moves. It cannot follow the rules.`;
					isRunning = false;
					return;
				}

				// Brief pause before retrying
				await sleep(300);
				continue;
			}

			// Check for backtracking (undoing the previous move)
			const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
			if (lastMove && lastMove.from === aiResponse.to && lastMove.to === aiResponse.from) {
				invalidMoveCount++;
				statusMessage = `Backtrack detected: ${PEG_NAMES[aiResponse.from]} → ${PEG_NAMES[aiResponse.to]} undoes previous move (${invalidMoveCount}/${MAX_INVALID_MOVES} invalid)`;
				aiReasoning = `BACKTRACK: ${aiResponse.reasoning}`;

				if (invalidMoveCount >= MAX_INVALID_MOVES) {
					status = 'failed';
					statusMessage = `AI failed after ${invalidMoveCount} backtracks/invalid moves. It's going in circles.`;
					isRunning = false;
					return;
				}
			}

			// Execute the valid move with animation
			await executeMove(aiResponse.from, aiResponse.to);
			statusMessage = `Move ${moveCount}: ${PEG_NAMES[aiResponse.from]} → ${PEG_NAMES[aiResponse.to]}`;
		}

		// Determine final status
		if (isSolved()) {
			status = 'success';
			const optimal = optimalMoves(diskCount);
			statusMessage = `Solved in ${moveCount} moves! (optimal: ${optimal})`;
			aiReasoning = moveCount === optimal ? 'Perfect solution!' : `Completed with ${moveCount - optimal} extra moves`;
		} else if (moveCount >= MAX_MOVES) {
			status = 'failed';
			statusMessage = `AI gave up after ${MAX_MOVES} moves. Too many attempts.`;
		}

		isRunning = false;
	}

	function sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Initialize on mount and when disk count changes
	$effect(() => {
		if (browser) {
			initializePegs();
		}
	});

	// Peg names for accessibility
	const pegLabels = ['Source (A)', 'Auxiliary (B)', 'Target (C)'];
</script>

<div class="demo-container">
	<h4 class="demo-title">Experience the Cliff</h4>
	<p class="demo-subtitle">Watch real GPT-5 attempt Tower of Hanoi at different complexity levels</p>

	<div class="controls">
		<div class="disk-selector">
			<label for="disk-count">Number of disks:</label>
			<div class="disk-buttons">
				{#each [3, 4, 5, 6, 7, 8] as count}
					<button
						class="disk-button"
						class:active={diskCount === count}
						class:danger-zone={count >= 6}
						onclick={() => {
							if (!isRunning) diskCount = count;
						}}
						disabled={isRunning}
					>
						{count}
					</button>
				{/each}
			</div>
		</div>

		<div class="complexity-indicator">
			<span class="complexity-label">Complexity:</span>
			<span
				class="complexity-value"
				class:low={diskCount <= 4}
				class:medium={diskCount === 5}
				class:high={diskCount >= 6}
			>
				{diskCount <= 4 ? 'Low' : diskCount === 5 ? 'Medium' : 'High (The Cliff)'}
			</span>
			<span class="optimal-moves">({optimalMoves(diskCount)} moves optimal)</span>
		</div>

		<button class="run-button" onclick={runAIAttempt} disabled={isRunning}>
			{#if isRunning}
				{#if isThinking}
					<span class="thinking-dots">AI Thinking<span class="dots"></span></span>
				{:else}
					Running...
				{/if}
			{:else}
				Watch AI Attempt
			{/if}
		</button>
	</div>

	<div class="tower-visualization" bind:this={containerRef} role="img" aria-label="Tower of Hanoi puzzle with {diskCount} disks">
		{#each pegs as peg, pegIndex}
			<div class="peg-container" data-peg={pegIndex}>
				<div class="peg-label">{pegLabels[pegIndex]}</div>
				<div class="peg">
					<div class="peg-rod"></div>
					<div class="peg-base"></div>
					<div class="disks">
						{#each peg as diskSize, diskIndex}
							{@const isAnimating = animatingDisk === diskSize && animationFromPeg === pegIndex}
							<div
								class="disk"
								class:hidden={isAnimating}
								style="
									--disk-width: {30 + diskSize * 14}px;
									--disk-hue: {(diskSize - 1) * (360 / diskCount)};
									--disk-index: {diskIndex};
								"
							>
								<span class="visually-hidden">Disk {diskSize}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}

		<!-- Animated floating disk -->
		{#if animatingDisk !== null}
			{@const pegWidth = 33.33}
			{@const fromX = animationFromPeg * pegWidth + pegWidth / 2}
			{@const toX = animationToPeg * pegWidth + pegWidth / 2}
			{@const liftHeight = 170}
			{@const fromStackHeight = 10 + (pegs[animationFromPeg].length) * 20}
			{@const toStackHeight = 10 + pegs[animationToPeg].length * 20}
			{@const diskWidthPx = 30 + animatingDisk * 14}
			<div
				class="floating-disk"
				class:lifting={animationPhase === 'lifting'}
				class:moving={animationPhase === 'moving'}
				class:dropping={animationPhase === 'dropping'}
				style="
					--disk-width: {diskWidthPx}px;
					--disk-hue: {(animatingDisk - 1) * (360 / diskCount)};
					--from-x: {fromX}%;
					--to-x: {toX}%;
					--lift-height: {liftHeight}px;
					--from-y: {fromStackHeight}px;
					--to-y: {toStackHeight}px;
					--lift-duration: {ANIMATION_TIMING.lift}ms;
					--move-duration: {ANIMATION_TIMING.move}ms;
					--drop-duration: {ANIMATION_TIMING.drop}ms;
				"
			>
				<span class="visually-hidden">Moving disk {animatingDisk}</span>
			</div>
		{/if}
	</div>

	<div
		class="status-panel"
		class:running={status === 'running'}
		class:success={status === 'success'}
		class:failed={status === 'failed' || status === 'error'}
	>
		<div class="stats">
			<div class="stat">
				<span class="stat-label">Moves</span>
				<span class="stat-value">{moveCount}</span>
			</div>
			<div class="stat">
				<span class="stat-label">Invalid</span>
				<span class="stat-value" class:error={invalidMoveCount > 0}>{invalidMoveCount}</span>
			</div>
			<div class="stat">
				<span class="stat-label">Status</span>
				<span class="stat-value status-text">
					{#if status === 'idle'}Ready{/if}
					{#if status === 'running'}Running{/if}
					{#if status === 'success'}Solved!{/if}
					{#if status === 'failed'}Failed{/if}
					{#if status === 'error'}Error{/if}
				</span>
			</div>
		</div>

		{#if statusMessage}
			<p class="status-message">{statusMessage}</p>
		{/if}

		{#if displayedReasoning}
			<div class="ai-thoughts">
				<span class="thoughts-label">🧠 AI Internal Reasoning:</span>
				<p class="thoughts-text">
					{displayedReasoning}
					<span class="typing-cursor"></span>
				</p>
			</div>
		{/if}

		{#if aiReasoning}
			<div class="ai-reasoning">
				<span class="reasoning-label">AI Decision:</span>
				<p class="reasoning-text">{aiReasoning}</p>
			</div>
		{/if}
	</div>

	<p class="demo-note">
		This demo calls real GPT-5.2 for each move. <strong>Note:</strong> Tower of Hanoi is a well-known puzzle 
		that appears extensively in computer science textbooks and coding tutorials, meaning it's heavily 
		represented in the AI's training data. The AI performs relatively well here because it has essentially 
		"memorized" the optimal algorithm. Novel problems without training data representation show much 
		steeper performance degradation.
	</p>
</div>

<style>
	.demo-container {
		background: var(--ash-dark);
		border-radius: 12px;
		padding: var(--space-lg);
		border: 1px solid var(--ash-mid);
		margin: var(--space-xl) 0;
	}

	.demo-title {
		font-family: var(--font-display);
		font-size: var(--size-subsection);
		color: var(--text-primary);
		margin: 0 0 var(--space-xs);
	}

	.demo-subtitle {
		font-size: var(--size-small);
		color: var(--text-muted);
		margin: 0 0 var(--space-md);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.disk-selector {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.disk-selector label {
		font-family: var(--font-mono);
		font-size: var(--size-small);
		color: var(--text-secondary);
	}

	.disk-buttons {
		display: flex;
		gap: var(--space-xs);
	}

	.disk-button {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		border: 2px solid var(--ash-mid);
		background: var(--charcoal);
		color: var(--text-secondary);
		font-family: var(--font-stat);
		font-size: 1.25rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.disk-button:hover:not(:disabled) {
		border-color: var(--ash-light);
		color: var(--text-primary);
	}

	.disk-button.active {
		border-color: var(--ember);
		background: var(--ember-subtle);
		color: var(--ember-glow);
	}

	.disk-button.danger-zone {
		border-color: var(--ember-dark);
	}

	.disk-button.danger-zone.active {
		border-color: var(--ember);
		box-shadow: 0 0 10px var(--ember-dark);
	}

	.disk-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.complexity-indicator {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--size-small);
	}

	.complexity-label {
		color: var(--text-muted);
	}

	.complexity-value {
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 4px;
	}

	.complexity-value.low {
		color: #4ade80;
		background: rgba(74, 222, 128, 0.1);
	}

	.complexity-value.medium {
		color: #fbbf24;
		background: rgba(251, 191, 36, 0.1);
	}

	.complexity-value.high {
		color: var(--ember-glow);
		background: var(--ember-subtle);
	}

	.optimal-moves {
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
	}

	.run-button {
		align-self: flex-start;
		padding: var(--space-sm) var(--space-md);
		background: var(--ember);
		color: var(--smoke);
		border: none;
		border-radius: 8px;
		font-family: var(--font-mono);
		font-size: var(--size-body);
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 180px;
	}

	.run-button:hover:not(:disabled) {
		background: var(--ember-glow);
		box-shadow: 0 0 20px var(--ember-dark);
	}

	.run-button:disabled {
		opacity: 0.9;
		cursor: wait;
	}

	.thinking-dots {
		display: inline-flex;
		align-items: center;
	}

	.dots::after {
		content: '';
		animation: dots 1.5s steps(4, end) infinite;
	}

	@keyframes dots {
		0% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75% {
			content: '...';
		}
		100% {
			content: '';
		}
	}

	.tower-visualization {
		position: relative;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		height: 200px;
		margin: var(--space-lg) 0;
		padding: 0 var(--space-sm);
	}

	.peg-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		max-width: 150px;
	}

	.peg-label {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-xs);
	}

	.peg {
		position: relative;
		width: 100%;
		height: 160px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.peg-rod {
		position: absolute;
		bottom: 10px;
		width: 8px;
		height: 140px;
		background: var(--ash-light);
		border-radius: 4px 4px 0 0;
	}

	.peg-base {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 10px;
		background: var(--ash-mid);
		border-radius: 4px;
	}

	.disks {
		position: absolute;
		bottom: 10px;
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		width: 100%;
	}

	.disk {
		width: var(--disk-width);
		height: 18px;
		background: hsl(var(--disk-hue), 70%, 50%);
		border-radius: 4px;
		margin-bottom: 2px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		transition: opacity 0.1s ease;
	}

	.disk.hidden {
		opacity: 0;
	}

	/* Floating animated disk */
	.floating-disk {
		position: absolute;
		height: 18px;
		width: var(--disk-width);
		background: linear-gradient(
			180deg,
			hsl(var(--disk-hue), 75%, 60%) 0%,
			hsl(var(--disk-hue), 70%, 50%) 50%,
			hsl(var(--disk-hue), 65%, 40%) 100%
		);
		border-radius: 4px;
		left: var(--from-x);
		bottom: var(--from-y);
		transform: translateX(-50%);
		box-shadow: 
			0 4px 8px rgba(0, 0, 0, 0.4),
			0 0 20px hsla(var(--disk-hue), 70%, 50%, 0.3);
		z-index: 100;
	}

	.floating-disk.lifting {
		animation: disk-lift var(--lift-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.floating-disk.moving {
		left: var(--to-x);
		bottom: var(--lift-height);
		animation: disk-move var(--move-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.floating-disk.dropping {
		left: var(--to-x);
		bottom: var(--to-y);
		animation: disk-drop var(--drop-duration) cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
	}

	@keyframes disk-lift {
		0% {
			left: var(--from-x);
			bottom: var(--from-y);
			box-shadow: 
				0 4px 8px rgba(0, 0, 0, 0.4),
				0 0 20px hsla(var(--disk-hue), 70%, 50%, 0.3);
		}
		100% {
			left: var(--from-x);
			bottom: var(--lift-height);
			box-shadow: 
				0 12px 24px rgba(0, 0, 0, 0.5),
				0 0 30px hsla(var(--disk-hue), 70%, 50%, 0.5);
		}
	}

	@keyframes disk-move {
		0% {
			left: var(--from-x);
			box-shadow: 
				0 12px 24px rgba(0, 0, 0, 0.5),
				0 0 30px hsla(var(--disk-hue), 70%, 50%, 0.5);
		}
		50% {
			transform: translateX(-50%) scale(1.05);
			box-shadow: 
				0 16px 32px rgba(0, 0, 0, 0.6),
				0 0 40px hsla(var(--disk-hue), 70%, 50%, 0.6);
		}
		100% {
			left: var(--to-x);
			transform: translateX(-50%) scale(1);
			box-shadow: 
				0 12px 24px rgba(0, 0, 0, 0.5),
				0 0 30px hsla(var(--disk-hue), 70%, 50%, 0.5);
		}
	}

	@keyframes disk-drop {
		0% {
			bottom: var(--lift-height);
			box-shadow: 
				0 12px 24px rgba(0, 0, 0, 0.5),
				0 0 30px hsla(var(--disk-hue), 70%, 50%, 0.5);
		}
		70% {
			bottom: var(--to-y);
			transform: translateX(-50%) scaleY(0.9) scaleX(1.05);
		}
		85% {
			transform: translateX(-50%) scaleY(1.05) scaleX(0.98);
		}
		100% {
			bottom: var(--to-y);
			transform: translateX(-50%) scaleY(1) scaleX(1);
			box-shadow: 
				0 4px 8px rgba(0, 0, 0, 0.4),
				0 0 20px hsla(var(--disk-hue), 70%, 50%, 0.3);
		}
	}

	.status-panel {
		background: var(--charcoal);
		border-radius: 8px;
		padding: var(--space-md);
		border: 1px solid var(--ash-mid);
		transition: border-color var(--transition-fast);
	}

	.status-panel.running {
		border-color: var(--ember);
	}

	.status-panel.success {
		border-color: #4ade80;
	}

	.status-panel.failed {
		border-color: var(--ember-glow);
	}

	.stats {
		display: flex;
		gap: var(--space-lg);
		margin-bottom: var(--space-sm);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		color: var(--text-muted);
		text-transform: uppercase;
	}

	.stat-value {
		font-family: var(--font-stat);
		font-size: 1.5rem;
		color: var(--text-primary);
	}

	.stat-value.error {
		color: var(--ember-glow);
	}

	.status-text {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-message {
		font-size: var(--size-small);
		color: var(--text-secondary);
		margin: 0 0 var(--space-sm);
		font-style: italic;
	}

	.ai-thoughts {
		background: rgba(30, 30, 35, 0.8);
		border: 1px solid var(--ash-mid);
		border-radius: 6px;
		padding: var(--space-sm);
		margin-top: var(--space-sm);
	}

	.thoughts-label {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: var(--space-xs);
	}

	.thoughts-text {
		font-size: var(--size-small);
		color: var(--text-secondary);
		margin: var(--space-xs) 0 0;
		line-height: 1.6;
		opacity: 0.85;
	}

	.typing-cursor {
		display: inline-block;
		width: 2px;
		height: 1em;
		background: currentColor;
		margin-left: 1px;
		animation: blink 0.8s ease-in-out infinite;
		vertical-align: text-bottom;
	}

	@keyframes blink {
		0%, 50% {
			opacity: 1;
		}
		51%, 100% {
			opacity: 0;
		}
	}

	.ai-reasoning {
		background: var(--ash-dark);
		border-radius: 6px;
		padding: var(--space-sm);
		margin-top: var(--space-sm);
	}

	.reasoning-label {
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		color: var(--ember);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.reasoning-text {
		font-size: var(--size-small);
		color: var(--text-secondary);
		margin: var(--space-xs) 0 0;
		line-height: 1.5;
	}

	.demo-note {
		font-size: var(--size-tiny);
		color: var(--text-muted);
		margin: var(--space-md) 0 0;
		text-align: center;
	}

	@media (max-width: 640px) {
		.demo-container {
			padding: var(--space-md);
		}

		.tower-visualization {
			height: 160px;
		}

		.peg {
			height: 130px;
		}

		.peg-rod {
			height: 110px;
		}

		.disk {
			height: 14px;
		}

		.stats {
			gap: var(--space-md);
		}

		.disk-selector {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
