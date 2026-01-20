<script lang="ts">
	/**
	 * BehavioralExperimentHistory - List view of experiments with filters
	 *
	 * Features:
	 * - Tabs: Incomplete / Completed / All
	 * - Each card shows belief, status, dates, belief change
	 * - Click to navigate to detail view
	 * - Sort by most recent first
	 * - Empty states for each filter
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { BehavioralExperiment } from '$lib/db/types';

	// State
	let experiments = $state<BehavioralExperiment[]>([]);
	let filter = $state<'all' | 'incomplete' | 'completed'>('incomplete');
	let isLoading = $state(true);

	// Filter experiments
	const filteredExperiments = $derived(() => {
		switch (filter) {
			case 'incomplete':
				return experiments.filter((exp) => !exp.completed);
			case 'completed':
				return experiments.filter((exp) => exp.completed);
			case 'all':
			default:
				return experiments;
		}
	});

	// Load experiments
	async function loadExperiments() {
		if (!browser) return;

		isLoading = true;
		try {
			// Get all experiments, sorted by date descending
			const allExperiments = await db.behavioralExperiments.toArray();
			experiments = allExperiments.sort((a, b) => {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			});
		} catch (error) {
			console.error('Failed to load experiments:', error);
		} finally {
			isLoading = false;
		}
	}

	// Format date
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Truncate text
	function truncate(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	}

	// Load on mount
	onMount(() => {
		loadExperiments();
	});
</script>

<div class="history-container">
	<!-- Filter tabs -->
	<div class="filter-tabs" role="tablist">
		<button
			class="filter-tab"
			class:active={filter === 'incomplete'}
			onclick={() => (filter = 'incomplete')}
			role="tab"
			aria-selected={filter === 'incomplete'}
		>
			Incomplete
			{#if experiments.filter((e) => !e.completed).length > 0}
				<span class="tab-badge">{experiments.filter((e) => !e.completed).length}</span>
			{/if}
		</button>
		<button
			class="filter-tab"
			class:active={filter === 'completed'}
			onclick={() => (filter = 'completed')}
			role="tab"
			aria-selected={filter === 'completed'}
		>
			Completed
			{#if experiments.filter((e) => e.completed).length > 0}
				<span class="tab-badge">{experiments.filter((e) => e.completed).length}</span>
			{/if}
		</button>
		<button
			class="filter-tab"
			class:active={filter === 'all'}
			onclick={() => (filter = 'all')}
			role="tab"
			aria-selected={filter === 'all'}
		>
			All
			{#if experiments.length > 0}
				<span class="tab-badge">{experiments.length}</span>
			{/if}
		</button>
	</div>

	<!-- Loading state -->
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading experiments...</p>
		</div>
	{:else if filteredExperiments().length === 0}
		<!-- Empty states -->
		{#if filter === 'incomplete'}
			<div class="empty-state">
				<div class="empty-icon">🔬</div>
				<h3 class="empty-title">No Incomplete Experiments</h3>
				<p class="empty-description">
					You don't have any experiments in progress. Create a new experiment to test your beliefs
					with real-world evidence.
				</p>
			</div>
		{:else if filter === 'completed'}
			<div class="empty-state">
				<div class="empty-icon">✓</div>
				<h3 class="empty-title">No Completed Experiments</h3>
				<p class="empty-description">
					You haven't completed any experiments yet. Start an experiment and record the results to
					see them here.
				</p>
			</div>
		{:else}
			<div class="empty-state">
				<div class="empty-icon">🔬</div>
				<h3 class="empty-title">No Experiments Yet</h3>
				<p class="empty-description">
					Behavioral experiments help you test anxiety-provoking beliefs with real-world evidence.
					Create your first experiment to get started.
				</p>
			</div>
		{/if}
	{:else}
		<!-- Experiment list -->
		<div class="experiment-list">
			{#each filteredExperiments() as experiment (experiment.id)}
				<a href="{base}/tools/cbt/experiment/{experiment.id}" class="experiment-card">
					<!-- Status badge -->
					<div class="card-header">
						{#if experiment.completed}
							<span class="status-badge completed">Completed</span>
						{:else}
							<span class="status-badge incomplete">Incomplete</span>
						{/if}
						<span class="card-date">{formatDate(experiment.createdAt)}</span>
					</div>

					<!-- Belief -->
					<div class="card-belief">
						{truncate(experiment.belief, 120)}
					</div>

					<!-- Experiment summary -->
					<div class="card-experiment">
						<strong>Experiment:</strong>
						{truncate(experiment.experiment, 80)}
					</div>

					{#if experiment.completed && experiment.beliefStrengthAfter !== undefined}
						<!-- Belief change (if completed) -->
						<div class="card-footer">
							<div class="belief-change">
								<span class="belief-value before">{experiment.beliefStrength}</span>
								<svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
								<span class="belief-value after">{experiment.beliefStrengthAfter}</span>

								{#if experiment.beliefStrength > experiment.beliefStrengthAfter}
									<span class="change-label decrease">
										(-{experiment.beliefStrength - experiment.beliefStrengthAfter} points)
									</span>
								{:else if experiment.beliefStrength < experiment.beliefStrengthAfter}
									<span class="change-label increase">
										(+{experiment.beliefStrengthAfter - experiment.beliefStrength} points)
									</span>
								{:else}
									<span class="change-label unchanged">(no change)</span>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Chevron -->
					<svg class="card-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.history-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Filter tabs */
	.filter-tabs {
		display: flex;
		gap: 0.5rem;
		border-bottom: 2px solid #e4e4e7;
		padding: 0 0.5rem;
		overflow-x: auto;
	}

	.filter-tab {
		min-height: 44px;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		color: #52525b;
		background: transparent;
		border: none;
		border-bottom: 3px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filter-tab:hover {
		color: #1a1a2e;
		background: #f4f4f5;
	}

	.filter-tab.active {
		color: #7c3aed;
		border-bottom-color: #7c3aed;
	}

	.filter-tab:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.tab-badge {
		background: #e4e4e7;
		color: #52525b;
		padding: 0.125rem 0.5rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.filter-tab.active .tab-badge {
		background: #7c3aed;
		color: white;
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

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		gap: 1rem;
	}

	.empty-icon {
		font-size: 4rem;
		line-height: 1;
	}

	.empty-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a2e;
	}

	.empty-description {
		font-size: 1rem;
		color: #52525b;
		max-width: 400px;
		line-height: 1.6;
	}

	/* Experiment list */
	.experiment-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.experiment-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s ease;
		position: relative;
		min-height: 44px;
	}

	.experiment-card:hover {
		border-color: #7c3aed;
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
		transform: translateY(-2px);
	}

	.experiment-card:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.status-badge.completed {
		background: #dcfce7;
		color: #166534;
	}

	.status-badge.incomplete {
		background: #fef3c7;
		color: #854d0e;
	}

	.card-date {
		font-size: 0.875rem;
		color: #52525b;
	}

	.card-belief {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a2e;
		line-height: 1.4;
	}

	.card-experiment {
		font-size: 0.875rem;
		color: #52525b;
		line-height: 1.4;
	}

	.card-experiment strong {
		color: #1a1a2e;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.75rem;
		border-top: 1px solid #e4e4e7;
	}

	.belief-change {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.belief-value {
		font-weight: 700;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
	}

	.belief-value.before {
		background: #fef2f2;
		color: #dc2626;
	}

	.belief-value.after {
		background: #dcfce7;
		color: #16a34a;
	}

	.arrow-icon {
		width: 20px;
		height: 20px;
		color: #52525b;
	}

	.change-label {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.change-label.decrease {
		color: #16a34a;
	}

	.change-label.increase {
		color: #dc2626;
	}

	.change-label.unchanged {
		color: #52525b;
	}

	.card-chevron {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		width: 24px;
		height: 24px;
		color: #a1a1aa;
		transition: all 0.2s ease;
	}

	.experiment-card:hover .card-chevron {
		color: #7c3aed;
		transform: translateY(-50%) translateX(4px);
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.loading-spinner {
			animation: none;
		}

		.filter-tab,
		.experiment-card,
		.card-chevron {
			transition: none;
		}

		.experiment-card:hover {
			transform: none;
		}

		.experiment-card:hover .card-chevron {
			transform: translateY(-50%);
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.filter-tabs {
			padding: 0;
		}

		.experiment-card {
			padding: 1rem;
		}

		.card-belief {
			font-size: 1rem;
			padding-right: 2rem;
		}

		.card-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.belief-change {
			flex-wrap: wrap;
		}
	}
</style>
