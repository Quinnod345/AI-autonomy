import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';

interface PuzzleState {
	pegs: [number[], number[], number[]];
	diskCount: number;
	moveHistory: Array<{ from: number; to: number }>;
}

interface AIMove {
	from: 0 | 1 | 2;
	to: 0 | 1 | 2;
	reasoning: string;
	error?: string;
}

const PEG_NAMES = ['A', 'B', 'C'] as const;
const MAX_MOVES = 150;

export const POST: RequestHandler = async ({ request }) => {
	if (!OPENAI_API_KEY) {
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
		return json({
			from: 0,
			to: 0,
			error: 'Maximum moves exceeded',
			reasoning: `Gave up after ${MAX_MOVES} moves.`
		});
	}

	// Build a simple state representation
	const pegA = pegs[0].length > 0 ? pegs[0].slice().reverse().join(',') : '-';
	const pegB = pegs[1].length > 0 ? pegs[1].slice().reverse().join(',') : '-';
	const pegC = pegs[2].length > 0 ? pegs[2].slice().reverse().join(',') : '-';

	// Get valid moves
	const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
	const validMoves: string[] = [];
	const validMovesData: Array<{ from: number; to: number }> = [];

	for (let from = 0; from < 3; from++) {
		if (pegs[from].length === 0) continue;
		const topDisk = pegs[from][pegs[from].length - 1];
		for (let to = 0; to < 3; to++) {
			if (from === to) continue;
			if (lastMove && lastMove.from === to && lastMove.to === from) continue;
			if (pegs[to].length === 0 || pegs[to][pegs[to].length - 1] > topDisk) {
				validMoves.push(`${PEG_NAMES[from]}${PEG_NAMES[to]}`);
				validMovesData.push({ from, to });
			}
		}
	}

	// If only undo available, allow it
	if (validMoves.length === 0 && lastMove) {
		validMoves.push(`${PEG_NAMES[lastMove.to]}${PEG_NAMES[lastMove.from]}`);
		validMovesData.push({ from: lastMove.to, to: lastMove.from });
	}

	// Build concise history (last 10 moves)
	const recentHistory = moveHistory
		.slice(-10)
		.map((m) => `${PEG_NAMES[m.from]}${PEG_NAMES[m.to]}`)
		.join(' ');

	const optimal = Math.pow(2, diskCount) - 1;

	// Super concise prompt for speed
	const prompt = `Tower of Hanoi: ${diskCount} disks, goal=all on C.
State: A[${pegA}] B[${pegB}] C[${pegC}] (top→bottom)
Valid: ${validMoves.join(',')}
History(${moveHistory.length}/${optimal}): ${recentHistory || 'none'}
Reply JSON only: {"m":"XY","r":"reason"} where XY is from valid moves.`;

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-4o',
				messages: [
					{
						role: 'system',
						content: `Tower of Hanoi solver. Disks: larger#=bigger. Rules: move top only, never big on small. Goal: stack all on C. 
Algorithm: To move n disks A→C using B: move n-1 from A→B, move bottom A→C, move n-1 from B→C.
Reply ONLY: {"m":"XY","r":"why"} - XY must be from valid moves list.`
					},
					{ role: 'user', content: prompt }
				],
				max_tokens: 60,
				temperature: 0
			})
		});

		if (!response.ok) {
			throw error(response.status, `API error: ${response.statusText}`);
		}

		const data = await response.json();
		const content = data.choices?.[0]?.message?.content?.trim();

		if (!content) {
			return json({ from: 0, to: 0, error: 'Empty response', reasoning: 'No content' });
		}

		// Parse response
		let parsed: { m: string; r: string };
		try {
			const jsonMatch = content.match(/\{[\s\S]*\}/);
			if (!jsonMatch) throw new Error('No JSON');
			parsed = JSON.parse(jsonMatch[0]);
		} catch {
			return json({ from: 0, to: 0, error: 'Parse error', reasoning: content.substring(0, 50) });
		}

		const move = parsed.m?.toUpperCase() || '';
		const fromPeg = PEG_NAMES.indexOf(move[0] as (typeof PEG_NAMES)[number]);
		const toPeg = PEG_NAMES.indexOf(move[1] as (typeof PEG_NAMES)[number]);

		if (fromPeg === -1 || toPeg === -1) {
			return json({ from: 0, to: 0, error: 'Invalid move format', reasoning: `Got: ${move}` });
		}

		// Validate move
		if (pegs[fromPeg].length === 0) {
			return json({
				from: fromPeg as 0 | 1 | 2,
				to: toPeg as 0 | 1 | 2,
				error: 'Empty source',
				reasoning: `${PEG_NAMES[fromPeg]} is empty`
			});
		}

		const disk = pegs[fromPeg][pegs[fromPeg].length - 1];
		if (pegs[toPeg].length > 0 && pegs[toPeg][pegs[toPeg].length - 1] < disk) {
			return json({
				from: fromPeg as 0 | 1 | 2,
				to: toPeg as 0 | 1 | 2,
				error: 'Invalid: big on small',
				reasoning: `Can't put ${disk} on ${pegs[toPeg][pegs[toPeg].length - 1]}`
			});
		}

		return json({
			from: fromPeg as 0 | 1 | 2,
			to: toPeg as 0 | 1 | 2,
			reasoning: parsed.r || 'OK'
		});
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('API error:', err);
		throw error(500, 'API call failed');
	}
};
