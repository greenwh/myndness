<script lang="ts">
	/**
	 * DistortionChecklist - Multi-select list of cognitive distortions
	 *
	 * Features:
	 * - 14 common cognitive distortions
	 * - Clear descriptions for each
	 * - 44px minimum touch targets for checkboxes
	 * - Examples relevant to user context
	 * - Link to detailed reference guide
	 */

	import type { CognitiveDistortion } from '$lib/db/types';
	import { base } from '$app/paths';

	interface Props {
		selected: CognitiveDistortion[];
		onchange?: (selected: CognitiveDistortion[]) => void;
		showLearnMore?: boolean;
	}

	let {
		selected = $bindable<CognitiveDistortion[]>([]),
		onchange,
		showLearnMore = true
	}: Props = $props();

	const distortions: Array<{
		value: CognitiveDistortion;
		label: string;
		description: string;
	}> = [
		{
			value: 'catastrophizing',
			label: 'Catastrophizing',
			description: 'Expecting the worst possible outcome'
		},
		{
			value: 'all-or-nothing',
			label: 'All-or-Nothing Thinking',
			description: 'Seeing things as black and white, no middle ground'
		},
		{
			value: 'overgeneralization',
			label: 'Overgeneralization',
			description: 'Using words like "always" or "never" based on one event'
		},
		{
			value: 'mind-reading',
			label: 'Mind Reading',
			description: 'Assuming you know what others are thinking'
		},
		{
			value: 'fortune-telling',
			label: 'Fortune Telling',
			description: 'Predicting negative outcomes without evidence'
		},
		{
			value: 'mental-filter',
			label: 'Mental Filter',
			description: 'Focusing only on negatives, ignoring positives'
		},
		{
			value: 'disqualifying',
			label: 'Disqualifying the Positive',
			description: 'Dismissing positive experiences as not counting'
		},
		{
			value: 'emotional-reasoning',
			label: 'Emotional Reasoning',
			description: 'Believing feelings are facts ("I feel it, so it must be true")'
		},
		{
			value: 'should-statements',
			label: 'Should Statements',
			description: 'Using rigid rules about how things "should" be'
		},
		{
			value: 'labeling',
			label: 'Labeling',
			description: 'Assigning global negative labels to yourself or others'
		},
		{
			value: 'personalization',
			label: 'Personalization',
			description: 'Taking inappropriate responsibility for negative events'
		},
		{
			value: 'blaming',
			label: 'Blaming',
			description: 'Holding others entirely responsible for your problems'
		},
		{
			value: 'jumping-to-conclusions',
			label: 'Jumping to Conclusions',
			description: 'Making negative interpretations without facts'
		},
		{
			value: 'minimizing',
			label: 'Minimizing',
			description: 'Shrinking the importance of positive events or qualities'
		}
	];

	function handleToggle(distortion: CognitiveDistortion) {
		if (selected.includes(distortion)) {
			selected = selected.filter(d => d !== distortion);
		} else {
			selected = [...selected, distortion];
		}
		onchange?.(selected);
	}
</script>

<div class="distortion-checklist">
	{#if showLearnMore}
		<div class="distortion-header">
			<p class="distortion-instruction">
				Select all thinking patterns you notice in this thought:
			</p>
			<a
				href="{base}/tools/cbt/distortions"
				class="distortion-learn-more"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn about thinking traps →
			</a>
		</div>
	{/if}

	<div class="distortion-list">
		{#each distortions as distortion}
			<label class="distortion-item">
				<input
					type="checkbox"
					checked={selected.includes(distortion.value)}
					onchange={() => handleToggle(distortion.value)}
					class="distortion-checkbox"
				/>
				<div class="distortion-content">
					<span class="distortion-label">{distortion.label}</span>
					<span class="distortion-description">{distortion.description}</span>
				</div>
			</label>
		{/each}
	</div>

	<p class="distortion-count" aria-live="polite">
		{selected.length} thinking {selected.length === 1 ? 'trap' : 'traps'} selected
	</p>
</div>

<style>
	.distortion-checklist {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.distortion-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.distortion-instruction {
		font-size: 1rem;
		color: var(--text-primary, #1a1a2e);
	}

	.distortion-learn-more {
		font-size: 0.875rem;
		color: var(--primary-600, #7c3aed);
		text-decoration: none;
		font-weight: 500;
	}

	.distortion-learn-more:hover {
		text-decoration: underline;
	}

	.distortion-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.distortion-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	.distortion-item:hover {
		border-color: var(--primary-400, #a78bfa);
		background: var(--primary-50, #faf5ff);
	}

	.distortion-item:has(.distortion-checkbox:checked) {
		border-color: var(--primary-600, #7c3aed);
		background: var(--primary-100, #ede9fe);
	}

	.distortion-item:focus-within {
		border-color: var(--primary-600, #7c3aed);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.distortion-checkbox {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		margin-top: 2px;
		border-radius: 4px;
		border: 2px solid #d4d4d8;
		cursor: pointer;
		accent-color: var(--primary-600, #7c3aed);
	}

	.distortion-checkbox:focus {
		outline: 2px solid var(--primary-600, #7c3aed);
		outline-offset: 2px;
	}

	.distortion-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.distortion-label {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text-primary, #1a1a2e);
	}

	.distortion-description {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.4;
	}

	.distortion-count {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		text-align: center;
		margin-top: 0.5rem;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.distortion-item {
			transition: none;
		}
	}
</style>
