<script lang="ts">
	import { Hero, Section, SplitLayout, Footer } from '$lib/components/layout';
	import { SectionHeader, PullQuote, Prose, FinalStatement } from '$lib/components/typography';
	import { StatCard, ComparisonBar, ComplexityChart, Timeline, TowerOfHanoiDemo } from '$lib/components/data-viz';
	import { CodeBlock, ResearchCard, CaseStudy, CitationComponent } from '$lib/components/content';
	import { InView } from '$lib/components/effects';
	import { stackOverflow, ibmSurvey, gartner, klarna } from '$lib/data/statistics';
	import { citations, getCitation } from '$lib/data/citations';

	// Klarna timeline data
	const klarnaTimeline = [
		{
			year: 2024,
			title: 'The AI Triumph',
			description: 'Klarna announces AI customer service chatbot is doing work equivalent to 700 full-time agents.',
			sentiment: 'hype' as const,
			quote: klarna.ceoQuote2024
		},
		{
			year: 2025,
			title: 'The Reversal',
			description: 'CEO Sebastian Siemiatkowski announces company is "investing in humans" and treating quality as a differentiator.',
			sentiment: 'reversal' as const,
			quote: klarna.ceoQuote2025
		}
	];

	// Sample code for vulnerability example
	const vulnerableCode = `import pickle

# AI-generated code for data handling
def load_user_data(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)  # Security vulnerability!

# Pickle can execute arbitrary code during deserialization
# A malicious file could compromise the entire system`;
</script>

<!-- Hero Section -->
<Hero 
	title="The Illusion of AI Autonomy"
	subtitle="Pattern matching is not thinking. The bubble is deflating."
	author="Quinn O'Donnell"
/>

<!-- Section 1: The Usage-Trust Paradox -->
<Section id="paradox" variant="default">
	<SectionHeader 
		title="The Usage-Trust Paradox" 
		tagline="When Experience Kills the Magic"
	/>

	<InView animation="fade-up">
		<PullQuote author="Opening Statement">
			I am a software engineer, and I use AI every day. I also do not trust it.
		</PullQuote>
	</InView>

	<InView animation="fade-up" delay={100}>
		<Prose>
			<p>
				This isn't contrarianism for its own sake. It's the conclusion I've reached after years of daily use, 
				thousands of prompts, and countless hours spent debugging code that looked correct but wasn't. 
				The more I use AI, the less I trust its output.
			</p>
			<p>
				And I'm not alone. The data tells a story of a technology whose promise is colliding with reality.
			</p>
		</Prose>
	</InView>

	<SplitLayout ratio="1-1" gap="large" alignItems="stretch">
		{#snippet left()}
			<div class="stat-grid">
				<StatCard 
					value={stackOverflow.adoption} 
					label="Adoption Rate" 
					trend="up"
					description="Developers using AI tools in 2025"
					delay={0}
				/>
				<StatCard 
					value={stackOverflow.trust} 
					label="Trust AI Output" 
					trend="down"
					description="Only 1 in 3 trust what AI produces"
					delay={100}
				/>
				<StatCard 
					value={stackOverflow.distrust} 
					label="Actively Distrust" 
					trend="up"
					description="Up from 31% in prior year"
					delay={200}
				/>
				<StatCard 
					value={stackOverflow.humanFallback} 
					label="Human Fallback" 
					description="Would still turn to humans for help"
					delay={300}
				/>
			</div>
		{/snippet}
		{#snippet right()}
			<InView animation="slide-right" delay={200}>
				<div class="narrative-block">
					<h3>The "Almost Correct" Problem</h3>
					<Prose>
						<p>
							<strong>{stackOverflow.almostCorrect}%</strong> of developers cite "almost correct but not quite" 
							as their top frustration with AI-generated code. It's the uncanny valley of programming: close enough 
							to seem right, wrong enough to break everything.
						</p>
						<p>
							<strong>{stackOverflow.debuggingTime}%</strong> say debugging AI code takes too much time. 
							The promise of faster development evaporates when you spend hours hunting for subtle bugs 
							that shouldn't exist.
						</p>
					</Prose>
				</div>
			</InView>
		{/snippet}
	</SplitLayout>

	<ComparisonBar 
		leftValue={stackOverflow.adoption}
		leftLabel="Adopt"
		rightValue={stackOverflow.trust}
		rightLabel="Trust"
		leftColor="accent"
		rightColor="muted"
	/>

	<InView animation="fade-up" delay={100}>
		<h3 class="subsection-title">The Security Blind Spot</h3>
		<Prose>
			<p>
				The dangers of "vibe coding" (trusting AI output without verification) extend beyond bugs into 
				genuine security vulnerabilities. Research from Databricks reveals that AI frequently suggests 
				insecure patterns, like using the <code>pickle</code> module for untrusted data:
			</p>
		</Prose>
	</InView>

	<CodeBlock 
		code={vulnerableCode}
		language="python"
		filename="user_data.py"
		highlightLines={[6]}
		caption="AI-generated code often contains hidden security vulnerabilities"
	/>
</Section>

<!-- Section 2: Pattern Matching, Not Reasoning -->
<Section id="research" variant="dark">
	<SectionHeader 
		title="Pattern Matching, Not Reasoning" 
		tagline="What the Research Actually Shows"
	/>

	<InView animation="fade-up">
		<Prose>
			<p>
				Do these systems actually think, or do they just fake it well enough to fool us? 
				Recent research from Apple's Machine Learning team provides a devastating answer.
			</p>
		</Prose>
	</InView>

	<ComplexityChart />

	<InView animation="fade-up" delay={100}>
		<Prose>
			<p>
				The chart above tells the story. At low complexity, AI models perform admirably. 
				But as problems become genuinely complex, accuracy doesn't gradually decline. It 
				<strong>collapses to zero</strong>. This isn't a gentle slope; it's a cliff.
			</p>
			<p>
				Don't take our word for it. See it for yourself:
			</p>
		</Prose>
	</InView>

	<TowerOfHanoiDemo />

	<InView animation="fade-up" delay={100}>
		<Prose>
			<p>
				Most alarming: when facing harder problems, the models didn't try harder. 
				They actually used <em>fewer</em> tokens. They gave up. A thinking entity would 
				expend more effort on harder problems, not less.
			</p>
		</Prose>
	</InView>

	<PullQuote author="Bender et al." source="Stochastic Parrots, 2021">
		Stitching together sequences of linguistic forms observed in training data, 
		without any reference to meaning.
	</PullQuote>

	<SplitLayout ratio="1-1" gap="large">
		{#snippet left()}
			<InView animation="slide-left">
				<div class="research-cards">
					<ResearchCard 
						citation={getCitation('apple-illusion')!}
						summary="Tested o1, o3, Claude, Gemini, and DeepSeek on novel puzzle variations."
						keyFinding="Accuracy collapsed to 0% on high-complexity problems"
					/>
				</div>
			</InView>
		{/snippet}
		{#snippet right()}
			<InView animation="slide-right" delay={100}>
				<div class="research-cards">
					<ResearchCard 
						citation={getCitation('bender-parrots')!}
						summary="Seminal paper coining 'stochastic parrots' to describe LLM limitations."
						keyFinding="Models imitate patterns without understanding meaning"
					/>
				</div>
			</InView>
		{/snippet}
	</SplitLayout>

	<InView animation="fade-up" delay={200}>
		<h3 class="subsection-title">The Medical Reasoning Gap</h3>
		<Prose>
			<p>
				Medical AI research reveals another critical flaw: the <strong>Einstellung effect</strong>. 
				When presented with cases that resemble common conditions but require different treatment, 
				AI systems consistently default to the familiar pattern, even when the evidence points elsewhere.
			</p>
			<p>
				In medicine, this isn't a bug report. It's a life-or-death failure mode.
			</p>
		</Prose>
	</InView>
</Section>

<!-- Section 3: Market Correction -->
<Section id="market" variant="accent">
	<SectionHeader 
		title="Market Correction" 
		tagline="When Hype Hits Reality"
	/>

	<InView animation="fade-up">
		<Prose>
			<p>
				The gap between AI promises and AI reality is forcing a reckoning in boardrooms 
				around the world. Companies that rushed to replace humans with AI are quietly 
				reversing course.
			</p>
		</Prose>
	</InView>

	<CaseStudy company="Klarna">
		<Timeline milestones={klarnaTimeline} />
		<InView animation="fade-up">
			<Prose>
				<p>
					The Klarna reversal encapsulates the AI hype cycle in miniature: bold claims 
					of human replacement, followed by a quiet acknowledgment that humans still matter.
				</p>
			</Prose>
		</InView>
	</CaseStudy>

	<SplitLayout ratio="1-1" gap="large">
		{#snippet left()}
			<InView animation="fade-up">
				<h3 class="subsection-title">IBM CEO Survey 2025</h3>
				<div class="stat-grid vertical">
					<StatCard 
						value={ibmSurvey.roiAchieved} 
						label="Delivered Expected ROI"
						description="Only 1 in 4 AI projects meet expectations"
						delay={0}
					/>
					<StatCard 
						value={ibmSurvey.scaledBeyondPilot} 
						label="Scaled Beyond Pilot"
						description="Most AI initiatives stall at proof-of-concept"
						delay={100}
					/>
					<StatCard 
						value={ibmSurvey.drivenByFomo} 
						label="Driven by FOMO"
						description="Fear of missing out, not strategy"
						delay={200}
					/>
				</div>
			</InView>
		{/snippet}
		{#snippet right()}
			<InView animation="fade-up" delay={100}>
				<h3 class="subsection-title">Gartner Predictions</h3>
				<Prose>
					<p>
						<strong>{gartner.abandonPlans}%</strong> of organizations will abandon plans to 
						reduce customer service staff through AI by 2027.
					</p>
					<p>
						<strong>{gartner.keepHumans}%</strong> continue to keep humans available for 
						complex cases, acknowledging that "the human touch remains irreplaceable."
					</p>
				</Prose>
				<InView animation="fade-up" delay={200}>
					<PullQuote source="Gartner Customer Service Report">
						The human touch remains irreplaceable for complex, nuanced, or emotionally 
						sensitive customer interactions.
					</PullQuote>
				</InView>
			</InView>
		{/snippet}
	</SplitLayout>

	<InView animation="fade-up" delay={200}>
		<div class="cycle-diagram">
			<div class="cycle-step">Fire</div>
			<div class="cycle-arrow">→</div>
			<div class="cycle-step">Regret</div>
			<div class="cycle-arrow">→</div>
			<div class="cycle-step">Rehire</div>
		</div>
		<Prose>
			<p class="text-center">
				The pattern emerges clearly: companies that replaced humans with AI are discovering 
				that substitution fails where collaboration succeeds.
			</p>
		</Prose>
	</InView>
</Section>

<!-- Section 4: Counter-Arguments -->
<Section id="objections" variant="dark">
	<SectionHeader 
		title="But What About..." 
		tagline="Addressing the Objections"
	/>

	<InView animation="fade-up">
		<Prose>
			<p>
				The skeptics have fair questions. Let's address them directly.
			</p>
		</Prose>
	</InView>

	<div class="counter-arguments">
		<InView animation="fade-up" delay={100}>
			<div class="counter-argument">
				<div class="objection">
					<span class="objection-label">Objection</span>
					<h4>"Won't AI just keep improving?"</h4>
				</div>
				<div class="response">
					<p>
						Improvement doesn't erase fundamental limits. A faster pattern matcher is still 
						a pattern matcher. Apple's research shows the cliff is <strong>architectural</strong>, 
						not a training problem. The models don't just underperform on hard problems; they 
						collapse entirely and even <em>reduce their effort</em>. More compute doesn't fix 
						a system that doesn't know how to search productively.
					</p>
				</div>
			</div>
		</InView>

		<InView animation="fade-up" delay={200}>
			<div class="counter-argument">
				<div class="objection">
					<span class="objection-label">Objection</span>
					<h4>"What about GPT-5, GPT-6, etc.?"</h4>
				</div>
				<div class="response">
					<p>
						Apple tested the <strong>latest reasoning models</strong> (OpenAI's o1 and o3, 
						Claude, Gemini, DeepSeek) and they all collapsed at the same complexity threshold. 
						Scaling has diminishing returns. We've gone from GPT-3 to GPT-4 to specialized 
						"reasoning" models, and the fundamental limits persist. More parameters don't 
						bridge the gap between pattern recognition and genuine understanding.
					</p>
				</div>
			</div>
		</InView>

		<InView animation="fade-up" delay={300}>
			<div class="counter-argument">
				<div class="objection">
					<span class="objection-label">Objection</span>
					<h4>"This is just growing pains"</h4>
				</div>
				<div class="response">
					<p>
						Bender's "stochastic parrots" paper was published in <strong>2021</strong>. Four years 
						and hundreds of billions of dollars later, the same fundamental critique applies. 
						The timeline for "real" AI reasoning keeps moving. First it was GPT-4. Then it was 
						chain-of-thought. Then it was o1. Each advancement was supposed to solve the problem. 
						None have. At what point do we acknowledge the pattern?
					</p>
				</div>
			</div>
		</InView>
	</div>

	<InView animation="fade-up" delay={400}>
		<PullQuote>
			Every advancement was supposed to be the breakthrough. We're still waiting.
		</PullQuote>
	</InView>
</Section>

<!-- Section 5: Conclusion -->
<Section id="conclusion" variant="default">
	<SectionHeader 
		title="The Illusion Breaks" 
		tagline="The Work Remains"
	/>

	<InView animation="fade-up">
		<div class="conclusion-intro">
			<Prose>
				<p>
					Three different angles (developer experience, cognitive science research, and market 
					economics) all converge on the same picture. We have confused imitation for understanding, 
					pattern matching for reasoning, statistical correlation for causation.
				</p>
			</Prose>
		</div>
	</InView>

	<SplitLayout ratio="1-1" gap="large">
		{#snippet left()}
			<InView animation="slide-left">
				<div class="division-block ai">
					<h4>What AI Does Well</h4>
					<ul>
						<li>Volume and repetition</li>
						<li>Pattern recognition</li>
						<li>First drafts and boilerplate</li>
						<li>Search and synthesis</li>
						<li>Routine automation</li>
					</ul>
				</div>
			</InView>
		{/snippet}
		{#snippet right()}
			<InView animation="slide-right" delay={100}>
				<div class="division-block human">
					<h4>What Humans Provide</h4>
					<ul>
						<li>Judgment and context</li>
						<li>Ethics and values</li>
						<li>Care and empathy</li>
						<li>Novel problem-solving</li>
						<li>Accountability</li>
					</ul>
				</div>
			</InView>
		{/snippet}
	</SplitLayout>

	<InView animation="fade-up" delay={200}>
		<Prose>
			<p>
				I still use AI every day. It handles the boring parts: the boilerplate, the syntax 
				I can't remember, the first pass at documentation. But the decisions? The architecture? 
				The judgment calls that determine whether software actually works? Those remain mine.
			</p>
			<p>
				AI will continue to improve. But improvement doesn't erase fundamental limits. 
				A faster car isn't progress toward flight. A more sophisticated pattern matcher 
				isn't progress toward understanding.
			</p>
		</Prose>
	</InView>

	<FinalStatement 
		text="The danger is not the machine.<br />The danger is <strong>us</strong>, forgetting what only we can do."
	/>
</Section>

<!-- Works Cited -->
<Section id="works-cited" variant="dark" spacing="compact">
	<SectionHeader 
		title="Works Cited" 
		level={2}
	/>
	
	<ul class="citations-list" role="list">
		{#each citations as citation}
			<CitationComponent {citation} />
		{/each}
	</ul>
</Section>

<!-- Footer -->
<Footer 
	author="Quinn O'Donnell"
	date="November 2025"
/>

<style>
	.stat-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
		align-items: stretch;
		flex: 1;
	}

	/* Ensure InView wrappers stretch to fill grid cells */
	.stat-grid > :global(*) {
		display: flex;
		flex-direction: column;
	}

	.stat-grid > :global(*) > :global(*) {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.stat-grid.vertical {
		grid-template-columns: 1fr;
		margin-top: 0;
	}

	.narrative-block {
		padding: var(--space-lg);
		background: var(--ash-dark);
		border-radius: 12px;
		border: 1px solid var(--ash-mid);
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.narrative-block :global(.prose) {
		flex: 1;
	}

	.narrative-block h3 {
		font-family: var(--font-display);
		font-size: var(--size-subsection);
		margin: 0 0 var(--space-md) 0;
	}

	.subsection-title {
		font-family: var(--font-display);
		font-size: var(--size-subsection);
		color: var(--text-primary);
		margin: var(--space-xl) 0 var(--space-md) 0;
	}

	.research-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.cycle-diagram {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-lg);
		margin: var(--space-lg) 0;
	}

	.cycle-step {
		font-family: var(--font-stat);
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		color: var(--accent);
		padding: var(--space-sm) var(--space-md);
		background: var(--ash-dark);
		border-radius: 8px;
		border: 2px solid var(--ember-dark);
	}

	.cycle-arrow {
		font-size: 2rem;
		color: var(--text-muted);
	}

	.division-block {
		padding: var(--space-lg);
		border-radius: 12px;
		height: 100%;
	}

	.division-block.ai {
		background: var(--ash-dark);
		border: 1px solid var(--ash-mid);
	}

	.division-block.human {
		background: linear-gradient(135deg, var(--ember-subtle) 0%, var(--ash-dark) 100%);
		border: 1px solid var(--ember-dark);
	}

	.division-block h4 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		margin: 0 0 var(--space-md) 0;
	}

	.division-block.human h4 {
		color: var(--accent);
	}

	.division-block ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.division-block li {
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--ash-mid);
		color: var(--text-secondary);
		font-size: var(--size-body);
		line-height: var(--leading-normal);
	}

	.division-block li:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.division-block li:first-child {
		padding-top: 0;
	}

	.division-block.human li {
		border-bottom-color: var(--ember-subtle);
	}

	.citations-list {
		list-style: none;
		padding: 0;
		margin: var(--space-md) 0 0 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.text-center {
		text-align: center;
	}

	.conclusion-intro {
		margin-bottom: var(--space-xl);
	}

	/* Counter-arguments section */
	.counter-arguments {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		margin: var(--space-lg) 0;
	}

	.counter-argument {
		background: var(--charcoal);
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--ash-mid);
	}

	.objection {
		background: var(--ash-dark);
		padding: var(--space-md) var(--space-lg);
		border-bottom: 1px solid var(--ash-mid);
	}

	.objection-label {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: var(--size-tiny);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ember);
		margin-bottom: var(--space-xs);
	}

	.objection h4 {
		font-family: var(--font-display);
		font-size: var(--size-body-large);
		font-style: italic;
		color: var(--text-primary);
		margin: 0;
	}

	.response {
		padding: var(--space-lg);
	}

	.response p {
		color: var(--text-secondary);
		margin: 0;
		line-height: var(--leading-relaxed);
	}

	.response strong {
		color: var(--text-primary);
	}

	.response em {
		color: var(--ember);
	}

	/* Fix spacing between content elements */
	:global(.stat-card + .stat-card) {
		margin-top: 0;
	}

	@media (max-width: 640px) {
		.stat-grid {
			grid-template-columns: 1fr;
			gap: var(--space-sm);
		}

		.cycle-diagram {
			flex-direction: column;
			padding: var(--space-md);
		}

		.cycle-arrow {
			transform: rotate(90deg);
		}

		.narrative-block {
			padding: var(--space-md);
		}

		.division-block {
			padding: var(--space-md);
		}
	}
</style>
