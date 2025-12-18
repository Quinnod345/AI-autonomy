import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

interface PuzzleState {
	pegs: [number[], number[], number[]];
	diskCount: number;
	moveHistory: Array<{ from: number; to: number }>;
}

const PEG_NAMES = ['A', 'B', 'C'] as const;
const MAX_MOVES = 150;

export const POST: RequestHandler = async ({ request }) => {
	if (!env.OPENAI_API_KEY) {
		throw error(500, 'OpenAI API key not configured');
	}

	let body: PuzzleState;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const { pegs, diskCount, moveHistory } = body;

	if (!Array.isArray(pegs) || pegs.length !== 3) {
		throw error(400, 'Invalid pegs array');
	}

	if (moveHistory.length >= MAX_MOVES) {
		return new Response(
			JSON.stringify({
				type: 'complete',
				from: 0,
				to: 0,
				error: 'Maximum moves exceeded',
				reasoning: `Gave up after ${MAX_MOVES} moves.`
			}),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	}

	// Build a simple state representation
	const pegA = pegs[0].length > 0 ? pegs[0].slice().reverse().join(',') : '-';
	const pegB = pegs[1].length > 0 ? pegs[1].slice().reverse().join(',') : '-';
	const pegC = pegs[2].length > 0 ? pegs[2].slice().reverse().join(',') : '-';

	// Get valid moves
	const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
	const validMoves: string[] = [];

	for (let from = 0; from < 3; from++) {
		if (pegs[from].length === 0) continue;
		const topDisk = pegs[from][pegs[from].length - 1];
		for (let to = 0; to < 3; to++) {
			if (from === to) continue;
			if (lastMove && lastMove.from === to && lastMove.to === from) continue;
			if (pegs[to].length === 0 || pegs[to][pegs[to].length - 1] > topDisk) {
				validMoves.push(`${PEG_NAMES[from]}${PEG_NAMES[to]}`);
			}
		}
	}

	// If only undo available, allow it
	if (validMoves.length === 0 && lastMove) {
		validMoves.push(`${PEG_NAMES[lastMove.to]}${PEG_NAMES[lastMove.from]}`);
	}

	// Build concise history (last 10 moves)
	const recentHistory = moveHistory
		.slice(-10)
		.map((m) => `${PEG_NAMES[m.from]}${PEG_NAMES[m.to]}`)
		.join(' ');

	const optimal = Math.pow(2, diskCount) - 1;

	// Prompt for GPT-5
	const prompt = `Tower of Hanoi: ${diskCount} disks, goal=all on C.
State: A[${pegA}] B[${pegB}] C[${pegC}] (top→bottom)
Valid moves: ${validMoves.join(',')}
History(${moveHistory.length}/${optimal}): ${recentHistory || 'none'}

Pick the best move. Reply JSON only: {"m":"XY","r":"reason"} where XY is from valid moves.`;

	const systemInstructions = `Tower of Hanoi solver. Disks: larger#=bigger. Rules: move top only, never big on small. Goal: stack all on C.
Algorithm: To move n disks A→C using B: move n-1 from A→B, move bottom A→C, move n-1 from B→C.
Reply ONLY: {"m":"XY","r":"why"} - XY must be from valid moves list.`;

	try {
		// GPT-5 uses the /v1/responses endpoint with streaming
		const response = await fetch('https://api.openai.com/v1/responses', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-5.2',
				input: prompt,
				instructions: systemInstructions,
				stream: true,
				reasoning: {
					effort: 'low',
					summary: 'auto'
				}
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API error:', response.status, errorText);
			throw error(response.status, `API error: ${response.statusText}`);
		}

		// Create a streaming response
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();

		const stream = new ReadableStream({
			async start(controller) {
				const reader = response.body?.getReader();
				if (!reader) {
					controller.close();
					return;
				}

				let fullContent = '';
				let reasoningSummary: string[] = [];
				let buffer = '';
				let completeSent = false;

				try {
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
									
									// Handle reasoning summary deltas
									if (parsed.type === 'response.reasoning_summary_text.delta') {
										const delta = parsed.delta || '';
										controller.enqueue(
											encoder.encode(`data: ${JSON.stringify({ type: 'reasoning', text: delta })}\n\n`)
										);
									}
									
									// Handle reasoning summary done
									if (parsed.type === 'response.reasoning_summary_text.done') {
										const text = parsed.text || '';
										reasoningSummary.push(text);
									}
									
									// Handle output text deltas
									if (parsed.type === 'response.output_text.delta') {
										const delta = parsed.delta || '';
										fullContent += delta;
									}

									// Handle completion events
									if (parsed.type === 'response.completed' || parsed.type === 'response.done') {
										completeSent = true;
										sendComplete();
									}
								} catch {
									// Skip invalid JSON lines
								}
							}
						}
					}

					// Always send complete at end if not already sent
					if (!completeSent) {
						sendComplete();
					}

					function sendComplete() {
						let move = { m: '', r: '' };
						try {
							const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
							if (jsonMatch) {
								move = JSON.parse(jsonMatch[0]);
							}
						} catch {
							// Parsing failed
						}

						const moveStr = move.m?.toUpperCase() || '';
						const fromPeg = PEG_NAMES.indexOf(moveStr[0] as (typeof PEG_NAMES)[number]);
						const toPeg = PEG_NAMES.indexOf(moveStr[1] as (typeof PEG_NAMES)[number]);

						let moveError: string | undefined;
						if (fromPeg === -1 || toPeg === -1) {
							moveError = 'Invalid move format';
						} else if (pegs[fromPeg].length === 0) {
							moveError = 'Empty source';
						} else {
							const disk = pegs[fromPeg][pegs[fromPeg].length - 1];
							if (pegs[toPeg].length > 0 && pegs[toPeg][pegs[toPeg].length - 1] < disk) {
								moveError = 'Invalid: big on small';
							}
						}

						controller.enqueue(
							encoder.encode(
								`data: ${JSON.stringify({
									type: 'complete',
									from: fromPeg,
									to: toPeg,
									reasoning: move.r || 'OK',
									thoughts: reasoningSummary,
									error: moveError
								})}\n\n`
							)
						);
					}
				} catch (err) {
					console.error('Stream error:', err);
					// Send error as complete
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({
								type: 'complete',
								from: 0,
								to: 0,
								reasoning: 'Stream error',
								thoughts: [],
								error: 'Stream processing failed'
							})}\n\n`
						)
					);
				} finally {
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('API error:', err);
		throw error(500, 'API call failed');
	}
};
