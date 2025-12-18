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
		id: 'stackoverflow-press',
		authors: null,
		title: "Stack Overflow's 2025 Developer Survey Reveals Trust in AI at an All Time Low",
		publisher: 'Stack Overflow',
		url: 'https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey',
		accessed: '24 Nov. 2025',
		type: 'article'
	},
	{
		id: 'apple-illusion',
		authors: ['Parshin', 'Shojaee', 'et al.'],
		title: 'The Illusion of Thinking: Understanding the Strengths and Limitations of Reasoning Models via the Lens of Problem Complexity',
		publisher: 'Apple Machine Learning Research',
		url: 'https://machinelearning.apple.com/research/illusion-of-thinking',
		accessed: '24 Nov. 2025',
		type: 'research'
	},
	{
		id: 'apple-illusion-paper',
		authors: ['Parshin', 'Shojaee', 'et al.'],
		title: 'The Illusion of Thinking (Full Paper)',
		publisher: 'Apple',
		url: 'https://ml-site.cdn-apple.com/papers/the-illusion-of-thinking.pdf',
		type: 'research'
	},
	{
		id: 'bender-parrots',
		authors: ['Bender, Emily M.', 'et al.'],
		title: 'On the Dangers of Stochastic Parrots',
		publisher: 'Conference on Fairness, Accountability, and Transparency (FAccT 21)',
		url: 'https://doi.org/10.1145/3442188.3445922',
		type: 'research'
	},
	{
		id: 'rand-failure',
		authors: ['Ryseff, James', 'et al.'],
		title: 'The Root Causes of Failure for Artificial Intelligence Projects and How They Can Succeed',
		publisher: 'RAND Corporation',
		url: 'https://www.rand.org/content/dam/rand/pubs/research_reports/RRA2600/RRA2680-1/RAND_RRA2680-1.pdf',
		type: 'report'
	},
	{
		id: 'mit-pilot',
		authors: ['Estrada, Sheryl'],
		title: 'MIT Report: 95% of Generative AI Pilots at Companies Are Failing',
		publisher: 'Fortune',
		url: 'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo',
		accessed: '24 Nov. 2025',
		type: 'article'
	},
	{
		id: 'ibm-ceo-survey',
		authors: null,
		title: 'IBM Study: CEOs Double Down on AI While Navigating Enterprise Hurdles',
		publisher: 'IBM Newsroom',
		url: 'https://newsroom.ibm.com/2025-05-06-ibm-study-ceos-double-down-on-ai-while-navigating-enterprise-hurdles',
		accessed: '24 Nov. 2025',
		type: 'survey'
	},
	{
		id: 'gartner-customer-service',
		authors: null,
		title: 'Gartner Predicts 50% of Organizations Will Abandon Plans to Reduce Customer Service Workforce Due to AI',
		publisher: 'Gartner',
		url: 'https://www.gartner.com/en/newsroom/press-releases/2025-06-10-gartner-predicts-50-percent-of-organizations-will-abandon-plans-to-reduce-customer-service-workforce-due-to-ai',
		accessed: '24 Nov. 2025',
		type: 'report'
	},
	{
		id: 'qodo-quality',
		authors: null,
		title: 'State of AI Code Quality in 2025',
		publisher: 'Qodo',
		url: 'https://www.qodo.ai/reports/state-of-ai-code-quality',
		accessed: '24 Nov. 2025',
		type: 'report'
	},
	{
		id: 'databricks-security',
		authors: ['Archibald, Neil', 'Kaplan, Caelin'],
		title: 'Passing the Security Vibe Check: The Dangers of Vibe Coding',
		publisher: 'Databricks Blog',
		url: 'https://www.databricks.com/blog/passing-security-vibe-check-dangers-vibe-coding',
		accessed: '24 Nov. 2025',
		type: 'research'
	},
	{
		id: 'kim-medical',
		authors: ['Kim, J.', 'Podlasek, A.', 'Shidara, K.', 'et al.'],
		title: 'Limitations of large language models in clinical problem-solving arising from inflexible reasoning',
		publisher: 'Scientific Reports 15, 39426 (2025)',
		url: 'https://doi.org/10.1038/s41598-025-22940-0',
		type: 'research'
	},
	{
		id: 'fortune-klarna',
		authors: ['Ivanova, Irina'],
		title: 'As Klarna Flips From AI-first to Hiring People Again, a New Landmark Survey Reveals Most AI Projects Fail to Deliver',
		publisher: 'Fortune',
		url: 'https://fortune.com/2025/05/09/klarna-ai-humans-return-on-investment',
		accessed: '24 Nov. 2025',
		type: 'article'
	},
	{
		id: 'ciodive-failure',
		authors: ['Wilkinson, Lindsey'],
		title: 'AI Project Failure Rates Are on the Rise: Report',
		publisher: 'CIO Dive',
		url: 'https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590',
		accessed: '24 Nov. 2025',
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

