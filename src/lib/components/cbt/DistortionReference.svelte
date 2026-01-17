<script lang="ts">
	/**
	 * DistortionReference - Educational guide for cognitive distortions
	 *
	 * Features:
	 * - 14 common thinking traps
	 * - Clear definitions
	 * - Relevant examples for user context
	 * - Search/filter functionality
	 */

	import type { CognitiveDistortion } from '$lib/db/types';

	let searchTerm = $state('');
	let expandedId = $state<string | null>(null);

	const distortions: Array<{
		id: CognitiveDistortion;
		name: string;
		definition: string;
		description: string;
		examples: string[];
		questions: string[];
	}> = [
		{
			id: 'catastrophizing',
			name: 'Catastrophizing',
			definition: 'Expecting the worst possible outcome',
			description: 'You imagine the worst-case scenario and treat it as if it\'s definitely going to happen, even when there\'s little evidence to support it.',
			examples: [
				'"My daughter hasn\'t called back yet, something terrible must have happened to her."',
				'"If I make a mistake on this, everything will fall apart."',
				'"This headache means I have a serious illness."'
			],
			questions: [
				'What\'s the worst that could happen? What\'s the best that could happen? What\'s most likely to happen?',
				'Have I ever survived something like this before?',
				'What evidence do I have that this disaster will actually occur?'
			]
		},
		{
			id: 'all-or-nothing',
			name: 'All-or-Nothing Thinking',
			definition: 'Seeing things in black and white categories',
			description: 'You view situations in only two categories instead of on a continuum. If something isn\'t perfect, you see it as a complete failure.',
			examples: [
				'"I didn\'t complete everything on my to-do list, so today was a total waste."',
				'"I had one slip-up with my routine, so I might as well give up entirely."',
				'"If I can\'t do it perfectly, there\'s no point in trying."'
			],
			questions: [
				'Is there any middle ground here?',
				'Can I think of this in terms of percentages rather than all-or-nothing?',
				'What would I tell a friend who was thinking this way?'
			]
		},
		{
			id: 'overgeneralization',
			name: 'Overgeneralization',
			definition: 'Viewing a single event as a never-ending pattern',
			description: 'You see a single negative event as part of a never-ending pattern of defeat, often using words like "always" or "never."',
			examples: [
				'"I always mess things up."',
				'"Nothing ever works out for me."',
				'"My daughters never call when I need them."'
			],
			questions: [
				'Am I using words like "always," "never," "everyone," or "nobody"?',
				'Can I think of times when the opposite was true?',
				'Is this really a pattern, or is it just this one time?'
			]
		},
		{
			id: 'mind-reading',
			name: 'Mind Reading',
			definition: 'Assuming you know what others are thinking',
			description: 'You believe you know what others are thinking about you, usually assuming it\'s negative, without checking if it\'s actually true.',
			examples: [
				'"She didn\'t smile at me, so she must be angry with me."',
				'"They think I\'m incompetent."',
				'"My daughter is avoiding me because she\'s disappointed in me."'
			],
			questions: [
				'Am I assuming I know what someone is thinking?',
				'What evidence do I have for this thought?',
				'Could there be other explanations for their behavior?'
			]
		},
		{
			id: 'fortune-telling',
			name: 'Fortune Telling',
			definition: 'Predicting negative outcomes without evidence',
			description: 'You predict that things will turn out badly without considering other possible outcomes.',
			examples: [
				'"I know this won\'t work out."',
				'"If I try, I\'ll just fail anyway."',
				'"The doctor\'s appointment will definitely bring bad news."'
			],
			questions: [
				'Am I predicting the future?',
				'What other outcomes are possible?',
				'Have my negative predictions been accurate in the past?'
			]
		},
		{
			id: 'mental-filter',
			name: 'Mental Filter',
			definition: 'Focusing only on the negative',
			description: 'You pick out a single negative detail and dwell on it exclusively, filtering out all the positive aspects of a situation.',
			examples: [
				'"Out of ten compliments and one criticism, all I can think about is the criticism."',
				'"The day was ruined because of that one mistake."',
				'"Sure, most things went well, but that one thing went wrong."'
			],
			questions: [
				'Am I filtering out the positives?',
				'What positive things happened that I\'m not acknowledging?',
				'Am I giving equal weight to positive and negative evidence?'
			]
		},
		{
			id: 'disqualifying',
			name: 'Disqualifying the Positive',
			definition: 'Rejecting positive experiences',
			description: 'You dismiss positive experiences by insisting they "don\'t count" for some reason.',
			examples: [
				'"Anyone could have done that, it wasn\'t special."',
				'"They\'re just being nice, they don\'t really mean it."',
				'"That success was just luck, not my ability."'
			],
			questions: [
				'Am I dismissing positive experiences?',
				'Would I accept this positive if it happened to someone I care about?',
				'Why am I discounting this positive event?'
			]
		},
		{
			id: 'emotional-reasoning',
			name: 'Emotional Reasoning',
			definition: 'Believing your feelings reflect facts',
			description: 'You assume that your negative emotions necessarily reflect the way things really are: "I feel it, therefore it must be true."',
			examples: [
				'"I feel anxious, so something bad must be about to happen."',
				'"I feel like a failure, so I must be a failure."',
				'"I feel guilty, so I must have done something wrong."'
			],
			questions: [
				'Am I confusing feelings with facts?',
				'Just because I feel this way doesn\'t mean it\'s true - what\'s the evidence?',
				'Could my feelings be influenced by my mood right now?'
			]
		},
		{
			id: 'should-statements',
			name: 'Should Statements',
			definition: 'Using rigid rules about how things must be',
			description: 'You try to motivate yourself with "shoulds," "shouldn\'ts," "musts," "oughts," or "have tos," which can lead to guilt and frustration.',
			examples: [
				'"I should be able to handle this."',
				'"I shouldn\'t feel this way."',
				'"My daughters should call me more often."'
			],
			questions: [
				'Am I using "should," "must," "ought," or "have to"?',
				'Who says this is how things should be?',
				'What would be more realistic or flexible language?'
			]
		},
		{
			id: 'labeling',
			name: 'Labeling',
			definition: 'Assigning global negative labels',
			description: 'Instead of describing a specific behavior, you attach a negative label to yourself or others.',
			examples: [
				'"I\'m a failure" (instead of "I made a mistake").',
				'"He\'s completely worthless."',
				'"I\'m just broken."'
			],
			questions: [
				'Am I labeling instead of describing the specific behavior?',
				'Does this label apply to every aspect of me/them?',
				'How would I describe this without using a label?'
			]
		},
		{
			id: 'personalization',
			name: 'Personalization',
			definition: 'Taking inappropriate responsibility',
			description: 'You see yourself as the cause of some negative event which you weren\'t primarily responsible for.',
			examples: [
				'"My daughter is unhappy, it must be my fault."',
				'"If I had been better, they wouldn\'t have gotten upset."',
				'"The project failed because of me" (when many factors were involved).'
			],
			questions: [
				'Am I taking responsibility for something that\'s not entirely my fault?',
				'What other factors contributed to this outcome?',
				'What percentage of responsibility is actually mine?'
			]
		},
		{
			id: 'blaming',
			name: 'Blaming',
			definition: 'Holding others entirely responsible',
			description: 'The opposite of personalization - you hold other people responsible for your problems or emotions.',
			examples: [
				'"I feel bad because of what they did."',
				'"It\'s all their fault that this happened."',
				'"I can\'t move forward because of how others treated me."'
			],
			questions: [
				'Am I blaming others for my feelings or situation?',
				'What is my part in this situation?',
				'What can I control or change regardless of others\' actions?'
			]
		},
		{
			id: 'jumping-to-conclusions',
			name: 'Jumping to Conclusions',
			definition: 'Making negative interpretations without facts',
			description: 'You interpret things negatively when there are no definite facts that support your conclusion.',
			examples: [
				'"She hasn\'t texted back, so she must be mad at me."',
				'"I haven\'t heard about the test results, so they must be bad."',
				'"He looked at me funny, so he must think I\'m weird."'
			],
			questions: [
				'Am I jumping to conclusions?',
				'What other explanations might there be?',
				'What facts do I actually have?'
			]
		},
		{
			id: 'minimizing',
			name: 'Minimizing',
			definition: 'Shrinking the importance of positive events',
			description: 'You inappropriately shrink things until they appear tiny - usually your own desirable qualities or others\' imperfections.',
			examples: [
				'"Sure, I finished that project, but it wasn\'t that hard."',
				'"That accomplishment doesn\'t really matter."',
				'"Yes, they said something hurtful, but it\'s not a big deal."'
			],
			questions: [
				'Am I minimizing something positive about myself?',
				'Would I minimize this if it happened to someone I care about?',
				'Am I giving this the weight it deserves?'
			]
		}
	];

	const filteredDistortions = $derived(() => {
		if (!searchTerm.trim()) return distortions;

		const term = searchTerm.toLowerCase();
		return distortions.filter(d =>
			d.name.toLowerCase().includes(term) ||
			d.definition.toLowerCase().includes(term) ||
			d.description.toLowerCase().includes(term)
		);
	});

	function toggleExpanded(id: string) {
		expandedId = expandedId === id ? null : id;
	}
</script>

<div class="distortion-reference">
	<div class="reference-header">
		<h2 class="reference-title">Common Thinking Traps</h2>
		<p class="reference-description">
			Learn to recognize these patterns in your thinking. Awareness is the first step to challenging them.
		</p>
	</div>

	<!-- Search -->
	<div class="search-container">
		<input
			type="search"
			bind:value={searchTerm}
			placeholder="Search thinking traps..."
			class="search-input"
		/>
	</div>

	<!-- Distortions list -->
	<div class="distortions-list">
		{#each filteredDistortions() as distortion}
			<div class="distortion-card">
				<button
					class="distortion-header"
					onclick={() => toggleExpanded(distortion.id)}
					aria-expanded={expandedId === distortion.id}
				>
					<h3 class="distortion-name">{distortion.name}</h3>
					<p class="distortion-definition">{distortion.definition}</p>
					<svg
						class="expand-icon"
						class:expand-icon-rotated={expandedId === distortion.id}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				{#if expandedId === distortion.id}
					<div class="distortion-content">
						<p class="distortion-description">{distortion.description}</p>

						<div class="content-section">
							<h4 class="section-title">Examples:</h4>
							<ul class="examples-list">
								{#each distortion.examples as example}
									<li>{example}</li>
								{/each}
							</ul>
						</div>

						<div class="content-section">
							<h4 class="section-title">Questions to ask yourself:</h4>
							<ul class="questions-list">
								{#each distortion.questions as question}
									<li>{question}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if filteredDistortions().length === 0}
		<div class="no-results">
			<p>No thinking traps match your search.</p>
		</div>
	{/if}
</div>

<style>
	.distortion-reference {
		max-width: 48rem;
		margin: 0 auto;
	}

	.reference-header {
		margin-bottom: 1.5rem;
	}

	.reference-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.5rem;
	}

	.reference-description {
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.6;
	}

	.search-container {
		margin-bottom: 1.5rem;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary-600, #7c3aed);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.distortions-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.distortion-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		overflow: hidden;
		transition: border-color 0.2s ease;
	}

	.distortion-card:has(.distortion-header[aria-expanded="true"]) {
		border-color: var(--primary-400, #a78bfa);
	}

	.distortion-header {
		width: 100%;
		padding: 1.25rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		align-items: start;
		transition: background-color 0.2s ease;
		min-height: 44px;
	}

	.distortion-header:hover {
		background: #fafafa;
	}

	.distortion-header:focus {
		outline: 2px solid var(--primary-600, #7c3aed);
		outline-offset: -2px;
	}

	.distortion-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.25rem;
		grid-column: 1;
	}

	.distortion-definition {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		grid-column: 1;
	}

	.expand-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: var(--text-muted, #a1a1aa);
		transition: transform 0.2s ease;
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
	}

	.expand-icon-rotated {
		transform: rotate(180deg);
	}

	.distortion-content {
		padding: 0 1.25rem 1.25rem;
		border-top: 1px solid #f4f4f5;
	}

	.distortion-description {
		font-size: 1rem;
		color: var(--text-primary, #1a1a2e);
		line-height: 1.6;
		margin: 1rem 0;
	}

	.content-section {
		margin: 1.5rem 0;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.75rem;
	}

	.examples-list,
	.questions-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.examples-list li {
		padding-left: 1.5rem;
		position: relative;
		font-size: 0.9375rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.6;
		font-style: italic;
	}

	.examples-list li::before {
		content: '"';
		position: absolute;
		left: 0.5rem;
		color: var(--primary-600, #7c3aed);
		font-weight: 700;
		font-size: 1.25rem;
	}

	.questions-list li {
		padding-left: 1.5rem;
		position: relative;
		font-size: 0.9375rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.6;
	}

	.questions-list li::before {
		content: '?';
		position: absolute;
		left: 0.25rem;
		color: var(--primary-600, #7c3aed);
		font-weight: 700;
		font-size: 1.125rem;
	}

	.no-results {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary, #52525b);
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.expand-icon,
		.distortion-header,
		.distortion-card {
			transition: none;
		}
	}
</style>
