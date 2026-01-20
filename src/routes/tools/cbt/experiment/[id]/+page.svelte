<script lang="ts">
	/**
	 * Behavioral Experiment Detail/Complete
	 *
	 * - If incomplete: Show ExperimentCompletionForm
	 * - If complete: Show read-only view with all details
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { BehavioralExperiment } from '$lib/db/types';

	import ExperimentCompletionForm from '$lib/components/cbt/ExperimentCompletionForm.svelte';

	let experiment = $state<BehavioralExperiment | null>(null);
	let isLoading = $state(true);
	let notFound = $state(false);

	// Format date
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatDateTime(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	// Load experiment
	onMount(async () => {
		if (!browser) return;

		const id = parseInt($page.params.id);
		if (isNaN(id)) {
			notFound = true;
			isLoading = false;
			return;
		}

		try {
			const exp = await db.behavioralExperiments.get(id);
			if (exp) {
				experiment = exp;
			} else {
				notFound = true;
			}
		} catch (error) {
			console.error('Failed to load experiment:', error);
			notFound = true;
		} finally {
			isLoading = false;
		}
	});

	// Calculate belief change
	const beliefChange = $derived(() => {
		if (!experiment || !experiment.completed || experiment.beliefStrengthAfter === undefined) {
			return null;
		}
		return experiment.beliefStrength - experiment.beliefStrengthAfter;
	});
</script>

<svelte:head>
	<title>Experiment - Myndness</title>
</svelte:head>

<div class="page-container">
	{#if isLoading}
		<!-- Loading state -->
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading experiment...</p>
		</div>
	{:else if notFound || !experiment}
		<!-- Not found -->
		<div class="not-found">
			<div class="not-found-icon">🔬</div>
			<h2 class="not-found-title">Experiment Not Found</h2>
			<p class="not-found-description">
				This experiment doesn't exist or has been deleted.
			</p>
			<a href="{base}/tools/cbt/experiment" class="btn-primary">Back to Experiments</a>
		</div>
	{:else if !experiment.completed}
		<!-- Incomplete: Show completion form -->
		<div class="completion-wrapper">
			<div class="page-header">
				<a href="{base}/tools/cbt/experiment" class="back-button" aria-label="Back to experiments">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</a>
				<h1 class="page-title">Complete Experiment</h1>
			</div>

			<ExperimentCompletionForm {experiment} />
		</div>
	{:else}
		<!-- Complete: Show read-only view -->
		<div class="detail-view">
			<!-- Header -->
			<div class="page-header">
				<a href="{base}/tools/cbt/experiment" class="back-button" aria-label="Back to experiments">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</a>
				<div class="header-text">
					<h1 class="page-title">Completed Experiment</h1>
					<p class="page-subtitle">{formatDateTime(experiment.completedAt || experiment.createdAt)}</p>
				</div>
			</div>

			<!-- Belief change summary (if applicable) -->
			{#if beliefChange() !== null && beliefChange() !== 0}
				<div class="summary-card {beliefChange()! > 0 ? 'decrease' : 'increase'}">
					<div class="summary-icon">
						{#if beliefChange()! > 0}
							<svg
								class="icon-large"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						{:else}
							<svg
								class="icon-large"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
								/>
							</svg>
						{/if}
					</div>
					<div class="summary-content">
						<div class="summary-label">Belief Strength Change</div>
						<div class="summary-value">
							{#if beliefChange()! > 0}
								Decreased by {beliefChange()} points
							{:else}
								Increased by {Math.abs(beliefChange()!)} points
							{/if}
						</div>
						<div class="summary-detail">
							{experiment.beliefStrength} → {experiment.beliefStrengthAfter}
						</div>
					</div>
				</div>
			{/if}

			<!-- Experiment details -->
			<div class="detail-section">
				<h2 class="section-title">Original Belief</h2>
				<div class="detail-card">
					<div class="detail-field">
						<div class="field-label">Belief</div>
						<div class="field-value">{experiment.belief}</div>
						<div class="field-meta">Strength: {experiment.beliefStrength}/100</div>
					</div>
				</div>
			</div>

			<div class="detail-section">
				<h2 class="section-title">The Experiment</h2>
				<div class="detail-card">
					<div class="detail-field">
						<div class="field-label">What You Did</div>
						<div class="field-value">{experiment.experiment}</div>
					</div>
					<div class="detail-field">
						<div class="field-label">Your Prediction</div>
						<div class="field-value">{experiment.prediction}</div>
						<div class="field-meta">Confidence: {experiment.predictionConfidence}/100</div>
					</div>
					{#if experiment.plannedDate}
						<div class="detail-field">
							<div class="field-label">Planned Date</div>
							<div class="field-value">{formatDate(experiment.plannedDate)}</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="detail-section">
				<h2 class="section-title">Results</h2>
				<div class="detail-card">
					<div class="detail-field">
						<div class="field-label">What Actually Happened</div>
						<div class="field-value">{experiment.actualOutcome}</div>
					</div>
					<div class="detail-field">
						<div class="field-label">What You Learned</div>
						<div class="field-value">{experiment.learnings}</div>
					</div>
					<div class="detail-field">
						<div class="field-label">Updated Belief Strength</div>
						<div class="field-value">
							{experiment.beliefStrengthAfter}/100
							{#if beliefChange() !== null}
								<span class="change-badge {beliefChange()! > 0 ? 'decrease' : 'increase'}">
									{beliefChange()! > 0 ? '-' : '+'}{Math.abs(beliefChange()!)}
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		min-height: 400px;
	}

	/* Loading state */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		gap: 1rem;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #e4e4e7;
		border-top-color: #7c3aed;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-state p {
		font-size: 1rem;
		color: #52525b;
	}

	/* Not found */
	.not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		gap: 1rem;
	}

	.not-found-icon {
		font-size: 4rem;
		line-height: 1;
	}

	.not-found-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.not-found-description {
		font-size: 1rem;
		color: #52525b;
		max-width: 400px;
	}

	/* Header */
	.page-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.back-button {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: white;
		border: 2px solid #e4e4e7;
		color: #52525b;
		text-decoration: none;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.back-button:hover {
		background: #f4f4f5;
		border-color: #d4d4d8;
	}

	.back-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.header-text {
		flex: 1;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
		margin-bottom: 0.25rem;
	}

	.page-subtitle {
		font-size: 0.875rem;
		color: #52525b;
	}

	/* Button */
	.btn-primary {
		min-height: 44px;
		padding: 0 1.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: #7c3aed;
		border: none;
		border-radius: 8px;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary:hover {
		background: #6d28d9;
		box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	/* Completion wrapper */
	.completion-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Detail view */
	.detail-view {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Summary card */
	.summary-card {
		display: flex;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 12px;
		border: 2px solid;
	}

	.summary-card.decrease {
		background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
		border-color: #86efac;
	}

	.summary-card.increase {
		background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
		border-color: #fca5a5;
	}

	.summary-icon {
		flex-shrink: 0;
	}

	.icon-large {
		width: 48px;
		height: 48px;
	}

	.summary-card.decrease .icon-large {
		color: #16a34a;
	}

	.summary-card.increase .icon-large {
		color: #dc2626;
	}

	.summary-content {
		flex: 1;
	}

	.summary-label {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
	}

	.summary-card.decrease .summary-label {
		color: #166534;
	}

	.summary-card.increase .summary-label {
		color: #991b1b;
	}

	.summary-value {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.summary-card.decrease .summary-value {
		color: #16a34a;
	}

	.summary-card.increase .summary-value {
		color: #dc2626;
	}

	.summary-detail {
		font-size: 1rem;
		font-weight: 500;
	}

	.summary-card.decrease .summary-detail {
		color: #166534;
	}

	.summary-card.increase .summary-detail {
		color: #991b1b;
	}

	/* Detail sections */
	.detail-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a2e;
	}

	.detail-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.detail-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #52525b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.field-value {
		font-size: 1rem;
		color: #1a1a2e;
		line-height: 1.6;
	}

	.field-meta {
		font-size: 0.875rem;
		color: #52525b;
	}

	.change-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		margin-left: 0.5rem;
	}

	.change-badge.decrease {
		background: #dcfce7;
		color: #16a34a;
	}

	.change-badge.increase {
		background: #fef2f2;
		color: #dc2626;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.loading-spinner {
			animation: none;
		}

		.back-button,
		.btn-primary {
			transition: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.page-container {
			padding: 0.5rem;
		}

		.summary-card {
			flex-direction: column;
		}

		.summary-value {
			font-size: 1.25rem;
		}
	}
</style>
