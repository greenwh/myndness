<script lang="ts">
	/**
	 * ExperimentCompletionForm - Add results to incomplete experiment
	 *
	 * Features:
	 * - Show original belief & experiment (read-only)
	 * - Add results: outcome, learnings, updated belief strength
	 * - Explicit save pattern
	 * - Visual before → after belief comparison
	 * - Success view after completion
	 */

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { BehavioralExperiment } from '$lib/db/types';

	import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';
	import IntensitySlider from '$lib/components/common/IntensitySlider.svelte';

	interface Props {
		experiment: BehavioralExperiment;
	}

	let { experiment }: Props = $props();

	// Form state
	let actualOutcome = $state('');
	let learnings = $state('');
	let beliefStrengthAfter = $state(experiment.beliefStrength);

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let showSuccess = $state(false);

	// Validation
	const isValid = $derived(
		actualOutcome.trim().length > 0 && learnings.trim().length > 0
	);

	// Calculate belief change
	const beliefChange = $derived(beliefStrengthAfter - experiment.beliefStrength);
	const beliefReduction = $derived(experiment.beliefStrength - beliefStrengthAfter);

	// Save completion
	async function completeExperiment() {
		if (!browser || !isValid) return;

		saveStatus = 'saving';

		try {
			const now = new Date();
			await db.behavioralExperiments.update(experiment.id!, {
				actualOutcome: actualOutcome.trim(),
				learnings: learnings.trim(),
				beliefStrengthAfter,
				completed: true,
				completedAt: now.toISOString()
			});

			saveStatus = 'saved';
			showSuccess = true;
		} catch (error) {
			console.error('Failed to complete experiment:', error);
			saveStatus = 'error';
		}
	}

	function goToHistory() {
		goto(`${base}/tools/cbt/experiment`);
	}
</script>

{#if !showSuccess}
	<div class="completion-form">
		<!-- Original Experiment (Read-only) -->
		<div class="original-section">
			<h2 class="section-title">Your Original Experiment</h2>

			<div class="original-card">
				<div class="original-field">
					<div class="original-label">Belief</div>
					<div class="original-value">{experiment.belief}</div>
					<div class="belief-strength">
						Belief strength: <strong>{experiment.beliefStrength}</strong>
					</div>
				</div>

				<div class="original-field">
					<div class="original-label">Experiment</div>
					<div class="original-value">{experiment.experiment}</div>
				</div>

				<div class="original-field">
					<div class="original-label">Prediction</div>
					<div class="original-value">{experiment.prediction}</div>
					<div class="prediction-confidence">
						Confidence: <strong>{experiment.predictionConfidence}</strong>
					</div>
				</div>
			</div>
		</div>

		<!-- Results Section -->
		<div class="results-section">
			<h2 class="section-title">What Actually Happened?</h2>

			<CharacterCounter
				bind:value={actualOutcome}
				maxLength={300}
				rows={4}
				placeholder="Describe what actually happened when you did the experiment"
				label="Actual Outcome"
				id="actualOutcome"
				required={true}
			/>

			<CharacterCounter
				bind:value={learnings}
				maxLength={300}
				rows={4}
				placeholder="What did this experiment teach you about your belief?"
				label="What Did You Learn?"
				id="learnings"
				required={true}
			/>

			<div class="belief-update">
				<IntensitySlider
					bind:value={beliefStrengthAfter}
					label="How strongly do you believe this now?"
					lowLabel="Not at all"
					highLabel="Completely"
					id="beliefStrengthAfter"
				/>

				<!-- Visual comparison -->
				<div class="belief-comparison">
					<div class="comparison-row">
						<span class="comparison-label">Before:</span>
						<div class="comparison-bar">
							<div
								class="comparison-fill before"
								style="width: {experiment.beliefStrength}%"
							></div>
							<span class="comparison-value">{experiment.beliefStrength}</span>
						</div>
					</div>

					<div class="comparison-arrow">
						{#if beliefChange < 0}
							<svg
								class="arrow-icon decrease"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							</svg>
							<span class="change-text decrease">
								{Math.abs(beliefChange)} point decrease
							</span>
						{:else if beliefChange > 0}
							<svg
								class="arrow-icon increase"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									d="M5 10l7-7m0 0l7 7m-7-7v18"
								/>
							</svg>
							<span class="change-text increase">
								{beliefChange} point increase
							</span>
						{:else}
							<span class="change-text unchanged">No change</span>
						{/if}
					</div>

					<div class="comparison-row">
						<span class="comparison-label">After:</span>
						<div class="comparison-bar">
							<div
								class="comparison-fill after"
								style="width: {beliefStrengthAfter}%"
							></div>
							<span class="comparison-value">{beliefStrengthAfter}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="form-actions">
			<button class="btn-secondary" onclick={goToHistory}>Cancel</button>
			<button class="btn-primary" disabled={!isValid || saveStatus === 'saving'} onclick={completeExperiment}>
				{#if saveStatus === 'saving'}
					Completing...
				{:else}
					Complete Experiment
				{/if}
			</button>
		</div>

		{#if saveStatus === 'error'}
			<div class="error-message">
				Failed to save. Please try again.
			</div>
		{/if}
	</div>
{:else}
	<!-- Success View -->
	<div class="success-view">
		<div class="success-icon">
			<svg
				class="checkmark"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 13l4 4L19 7"
				/>
			</svg>
		</div>

		<h2 class="success-title">Experiment Completed</h2>

		{#if beliefReduction > 0}
			<div class="success-stats">
				<div class="stat-card">
					<div class="stat-label">Belief Strength Reduced</div>
					<div class="stat-value decrease">-{beliefReduction} points</div>
					<div class="stat-detail">
						{experiment.beliefStrength} → {beliefStrengthAfter}
					</div>
				</div>
			</div>
			<p class="success-message">
				Testing your beliefs with real-world evidence is a powerful way to challenge unhelpful
				thinking patterns.
			</p>
		{:else if beliefReduction < 0}
			<p class="success-message">
				Sometimes experiments strengthen a belief. That's okay - you've gathered valuable
				information about what's true for you.
			</p>
		{:else}
			<p class="success-message">
				Your belief strength stayed the same. The experience itself is still valuable data.
			</p>
		{/if}

		<button class="btn-primary" onclick={goToHistory}>View All Experiments</button>
	</div>
{/if}

<style>
	.completion-form {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Original section */
	.original-section {
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a2e;
		margin-bottom: 1rem;
	}

	.original-card {
		background: #f4f4f5;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.original-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.original-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #52525b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.original-value {
		font-size: 1rem;
		color: #1a1a2e;
		line-height: 1.6;
	}

	.belief-strength,
	.prediction-confidence {
		font-size: 0.875rem;
		color: #52525b;
	}

	/* Results section */
	.results-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.belief-update {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Belief comparison */
	.belief-comparison {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.comparison-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.comparison-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #52525b;
		min-width: 60px;
	}

	.comparison-bar {
		flex: 1;
		height: 32px;
		background: #e4e4e7;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}

	.comparison-fill {
		height: 100%;
		transition: width 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 0.5rem;
	}

	.comparison-fill.before {
		background: linear-gradient(to right, #ef4444, #f87171);
	}

	.comparison-fill.after {
		background: linear-gradient(to right, #22c55e, #4ade80);
	}

	.comparison-value {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.comparison-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.arrow-icon {
		width: 32px;
		height: 32px;
	}

	.arrow-icon.decrease {
		color: #22c55e;
	}

	.arrow-icon.increase {
		color: #ef4444;
	}

	.change-text {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.change-text.decrease {
		color: #22c55e;
	}

	.change-text.increase {
		color: #ef4444;
	}

	.change-text.unchanged {
		color: #52525b;
	}

	/* Form actions */
	.form-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding-top: 1rem;
		border-top: 1px solid #e4e4e7;
	}

	.error-message {
		background: #fef2f2;
		color: #ef4444;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		font-weight: 500;
	}

	/* Buttons */
	.btn-primary,
	.btn-secondary {
		min-width: 44px;
		min-height: 44px;
		padding: 0 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 2px solid transparent;
	}

	.btn-primary {
		background: #7c3aed;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #6d28d9;
		box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		color: #52525b;
		border-color: #e4e4e7;
	}

	.btn-secondary:hover {
		background: #f4f4f5;
		border-color: #d4d4d8;
	}

	.btn-primary:focus,
	.btn-secondary:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	/* Success view */
	.success-view {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.success-icon {
		width: 80px;
		height: 80px;
		background: #dcfce7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkmark {
		width: 48px;
		height: 48px;
		stroke: #22c55e;
		stroke-width: 3;
	}

	.success-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.success-stats {
		width: 100%;
		margin: 1rem 0;
	}

	.stat-card {
		background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
		border: 2px solid #86efac;
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
	}

	.stat-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #166534;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.stat-value.decrease {
		color: #22c55e;
	}

	.stat-detail {
		font-size: 1rem;
		color: #166534;
		font-weight: 500;
	}

	.success-message {
		font-size: 1rem;
		color: #52525b;
		line-height: 1.6;
		max-width: 500px;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.comparison-fill,
		.btn-primary,
		.btn-secondary {
			transition: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.completion-form {
			padding: 0.5rem;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
		}

		.comparison-bar {
			height: 28px;
		}

		.stat-value {
			font-size: 2rem;
		}
	}
</style>
