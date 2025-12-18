// Statistics data from various sources

export const stackOverflow = {
	year: 2025,
	adoption: 84,
	adoptionPrior: 76,
	trust: 33,
	distrust: 46,
	distrustPrior: 31,
	almostCorrect: 66,
	debuggingTime: 45,
	humanFallback: 75
};

export const ibmSurvey = {
	roiAchieved: 25,
	scaledBeyondPilot: 16,
	drivenByFomo: 64
};

export const gartner = {
	abandonPlans: 50,
	keepHumans: 95
};

export const qodo = {
	missContext: 65,
	factualErrors: 20
};

export const rand = {
	aiProjectFailure: 80,
	traditionalItFailure: 40
};

export const mit = {
	genAiPilotFailure: 95
};

// Klarna case study
export const klarna = {
	agentsReplaced: 700,
	yearHype: 2024,
	yearReversal: 2025,
	ceoQuote2024: "AI is doing the equivalent work of 700 full-time agents.",
	ceoQuote2025: "Investing in humans is the future. Treating quality as a differentiator."
};

// Apple research - complexity cliff data
export const complexityCliff = {
	dataPoints: [
		{ complexity: 0, accuracy: 98, label: 'Trivial' },
		{ complexity: 1, accuracy: 95, label: 'Simple' },
		{ complexity: 2, accuracy: 88, label: 'Low' },
		{ complexity: 3, accuracy: 75, label: 'Medium-Low' },
		{ complexity: 4, accuracy: 58, label: 'Medium' },
		{ complexity: 5, accuracy: 35, label: 'Medium-High' },
		{ complexity: 6, accuracy: 12, label: 'High' },
		{ complexity: 7, accuracy: 0, label: 'Very High' }
	],
	cliffPoint: 5, // Where the dramatic drop begins
	source: 'Apple Machine Learning Research'
};

