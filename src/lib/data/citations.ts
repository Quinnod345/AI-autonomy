export interface Citation {
	id: string;
	authors: string[] | null;
	title: string;
	publisher?: string;
	url: string;
	accessed?: string;
	type: 'survey' | 'research' | 'article' | 'report';
}

export const citations: Citation[] = [
	{
		id: 'stackoverflow-survey',
		authors: null,
		title: '2025 Stack Overflow Developer Survey',
		url: 'https://survey.stackoverflow.co/2025',
		accessed: '24 Nov. 2025',
		type: 'survey'
	},
	{
		id: 'apple-illusion',
		authors: ['Shojaee', 'Parshin', 'et al.'],
		title: 'The Illusion of Thinking',
		publisher: 'Apple Machine Learning Research',
		url: 'https://machinelearning.apple.com/research/illusion-of-thinking',
		type: 'research'
	},
	{
		id: 'bender-parrots',
		authors: ['Bender', 'Gebru', 'McMillan-Major', 'Shmitchell'],
		title: 'On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?',
		publisher: 'FAccT 2021',
		url: 'https://dl.acm.org/doi/10.1145/3442188.3445922',
		type: 'research'
	},
	{
		id: 'rand-failure',
		authors: null,
		title: 'AI Project Failure Rates in Enterprise Settings',
		publisher: 'RAND Corporation',
		url: 'https://www.rand.org/',
		type: 'report'
	},
	{
		id: 'mit-pilot',
		authors: null,
		title: 'Generative AI Pilot Program Analysis',
		publisher: 'MIT Sloan Management Review',
		url: 'https://sloanreview.mit.edu/',
		type: 'research'
	},
	{
		id: 'ibm-ceo-survey',
		authors: null,
		title: 'Global CEO Survey 2025',
		publisher: 'IBM Institute for Business Value',
		url: 'https://www.ibm.com/thought-leadership/',
		type: 'survey'
	},
	{
		id: 'gartner-customer-service',
		authors: null,
		title: 'Customer Service and Support Predictions 2025',
		publisher: 'Gartner',
		url: 'https://www.gartner.com/',
		type: 'report'
	},
	{
		id: 'qodo-quality',
		authors: null,
		title: 'AI Code Quality Report',
		publisher: 'Qodo',
		url: 'https://www.qodo.ai/',
		type: 'report'
	},
	{
		id: 'databricks-security',
		authors: null,
		title: 'Security Vulnerabilities in AI-Generated Code',
		publisher: 'Databricks',
		url: 'https://www.databricks.com/',
		type: 'research'
	},
	{
		id: 'kim-medical',
		authors: ['Kim', 'et al.'],
		title: 'Medical Reasoning Capabilities of Large Language Models',
		publisher: 'mARC-QA Benchmark Study',
		url: 'https://arxiv.org/',
		type: 'research'
	},
	{
		id: 'fortune-klarna',
		authors: null,
		title: 'Klarna CEO Reverses Course on AI-First Strategy',
		publisher: 'Fortune',
		url: 'https://fortune.com/',
		type: 'article'
	}
];

export function getCitation(id: string): Citation | undefined {
	return citations.find(c => c.id === id);
}

export function formatCitation(citation: Citation): string {
	const authors = citation.authors ? citation.authors.join(', ') + '. ' : '';
	const publisher = citation.publisher ? ` ${citation.publisher}.` : '';
	const accessed = citation.accessed ? ` Accessed ${citation.accessed}.` : '';
	return `${authors}"${citation.title}."${publisher}${accessed}`;
}

