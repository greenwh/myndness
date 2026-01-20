<script lang="ts">
	/**
	 * HierarchyList - Filterable list of anxiety hierarchy items
	 *
	 * Features:
	 * - Sort by currentDistress descending (highest anxiety first)
	 * - Filter by status: All / In Progress / Completed / Not Started
	 * - Visual distress indicators with color coding
	 * - Progress bars showing reduction
	 * - Click to navigate to detail view
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { AnxietyHierarchyItem } from '$lib/db/types';

	// State
	let items = $state<AnxietyHierarchyItem[]>([]);
	let filter = $state<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
	let isLoading = $state(true);

	// Get status of item
	function getStatus(item: AnxietyHierarchyItem): string {
		if (item.isComplete) return 'completed';
		if (item.exposureAttempts.length === 0) return 'not-started';
		return 'in-progress';
	}

	// Filter items
	const filteredItems = $derived(() => {
		let filtered = items;

		switch (filter) {
			case 'not-started':
				filtered = items.filter((item) => item.exposureAttempts.length === 0);
				break;
			case 'in-progress':
				filtered = items.filter(
					(item) => item.exposureAttempts.length > 0 && !item.isComplete
				);
				break;
			case 'completed':
				filtered = items.filter((item) => item.isComplete);
				break;
			case 'all':
			default:
				filtered = items;
		}

		// Sort by currentDistress descending (highest anxiety first)
		return filtered.sort((a, b) => b.currentDistress - a.currentDistress);
	});

	// Get distress color class
	function getDistressColor(suds: number): string {
		if (suds <= 33) return 'green';
		if (suds <= 66) return 'amber';
		return 'red';
	}

	// Calculate progress percentage
	function calculateProgress(item: AnxietyHierarchyItem): number {
		const reduction = item.initialDistress - item.currentDistress;
		const maxReduction = item.targetDistress
			? item.initialDistress - item.targetDistress
			: item.initialDistress;
		if (maxReduction === 0) return 0;
		return Math.min(100, Math.round((reduction / maxReduction) * 100));
	}

	// Get status text and class
	function getStatusText(item: AnxietyHierarchyItem): string {
		if (item.isComplete) return 'Complete';
		if (item.exposureAttempts.length === 0) return 'Not started';
		return 'In progress';
	}

	function getStatusClass(item: AnxietyHierarchyItem): string {
		const status = getStatus(item);
		return status;
	}

	// Load items
	async function loadItems() {
		if (!browser) return;

		isLoading = true;
		try {
			const allItems = await db.anxietyHierarchy.toArray();
			items = allItems;
		} catch (error) {
			console.error('Failed to load hierarchy items:', error);
		} finally {
			isLoading = false;
		}
	}

	// Load on mount
	onMount(() => {
		loadItems();
	});
</script>

<div class="hierarchy-list">
	<!-- Filter tabs -->
	<div class="filter-tabs" role="tablist">
		<button
			class="filter-tab"
			class:active={filter === 'all'}
			onclick={() => (filter = 'all')}
			role="tab"
			aria-selected={filter === 'all'}
		>
			All
			{#if items.length > 0}
				<span class="tab-badge">{items.length}</span>
			{/if}
		</button>
		<button
			class="filter-tab"
			class:active={filter === 'not-started'}
			onclick={() => (filter = 'not-started')}
			role="tab"
			aria-selected={filter === 'not-started'}
		>
			Not Started
			{#if items.filter((i) => i.exposureAttempts.length === 0).length > 0}
				<span class="tab-badge">{items.filter((i) => i.exposureAttempts.length === 0).length}</span>
			{/if}
		</button>
		<button
			class="filter-tab"
			class:active={filter === 'in-progress'}
			onclick={() => (filter = 'in-progress')}
			role="tab"
			aria-selected={filter === 'in-progress'}
		>
			In Progress
			{#if items.filter((i) => i.exposureAttempts.length > 0 && !i.isComplete).length > 0}
				<span class="tab-badge">
					{items.filter((i) => i.exposureAttempts.length > 0 && !i.isComplete).length}
				</span>
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
			{#if items.filter((i) => i.isComplete).length > 0}
				<span class="tab-badge">{items.filter((i) => i.isComplete).length}</span>
			{/if}
		</button>
	</div>

	<!-- Loading state -->
	{#if isLoading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading hierarchy...</p>
		</div>
	{:else if filteredItems().length === 0}
		<!-- Empty state -->
		<div class="empty-state">
			<div class="empty-icon">📊</div>
			<h3 class="empty-title">
				{#if filter === 'all'}
					Build Your Anxiety Hierarchy
				{:else if filter === 'not-started'}
					No Items Waiting to Start
				{:else if filter === 'in-progress'}
					No Items In Progress
				{:else}
					No Completed Items Yet
				{/if}
			</h3>
			<p class="empty-description">
				{#if filter === 'all'}
					Create a ladder of feared situations ranked by distress level. Start with lower-anxiety
					situations and gradually work your way up through exposure.
				{:else}
					Try a different filter to see your hierarchy items.
				{/if}
			</p>
		</div>
	{:else}
		<!-- Item cards -->
		<div class="items-grid">
			{#each filteredItems() as item (item.id)}
				<a href="{base}/tools/cbt/hierarchy/{item.id}" class="hierarchy-card">
					<!-- Header -->
					<div class="card-header">
						{#if item.category}
							<span class="category-badge">{item.category}</span>
						{/if}
						<span class="status-badge {getStatusClass(item)}">
							{getStatusText(item)}
						</span>
					</div>

					<!-- Situation -->
					<h3 class="situation">{item.situation}</h3>

					<!-- Current distress -->
					<div class="distress-display">
						<div class="distress-number {getDistressColor(item.currentDistress)}">
							{item.currentDistress}
						</div>
						<div class="distress-info">
							<div class="distress-label">Current SUDS</div>
							<div class="distress-sublabel">
								{#if getDistressColor(item.currentDistress) === 'green'}
									Low distress
								{:else if getDistressColor(item.currentDistress) === 'amber'}
									Moderate distress
								{:else}
									High distress
								{/if}
							</div>
						</div>
					</div>

					<!-- Progress bar -->
					<div class="progress-section">
						<div class="progress-bar">
							<div class="progress-fill" style="width: {calculateProgress(item)}%"></div>
						</div>
						<div class="progress-labels">
							<span>Initial: {item.initialDistress}</span>
							<span>Current: {item.currentDistress}</span>
							{#if item.targetDistress}
								<span>Target: {item.targetDistress}</span>
							{/if}
						</div>
					</div>

					<!-- Footer -->
					<div class="card-footer">
						<div class="exposure-count">
							{item.exposureAttempts.length}
							{item.exposureAttempts.length === 1 ? 'exposure' : 'exposures'}
						</div>
						<svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.hierarchy-list {
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
		max-width: 500px;
		line-height: 1.6;
	}

	/* Items grid */
	.items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1rem;
	}

	/* Hierarchy card */
	.hierarchy-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s ease;
		position: relative;
		min-height: 44px;
	}

	.hierarchy-card:hover {
		border-color: #7c3aed;
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
		transform: translateY(-2px);
	}

	.hierarchy-card:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.category-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
		background: #ede9fe;
		color: #6d28d9;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.status-badge.not-started {
		background: #f4f4f5;
		color: #52525b;
	}

	.status-badge.in-progress {
		background: #fef3c7;
		color: #854d0e;
	}

	.status-badge.completed {
		background: #dcfce7;
		color: #166534;
	}

	.situation {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a2e;
		line-height: 1.4;
		margin: 0;
	}

	/* Distress display */
	.distress-display {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f4f4f5;
		border-radius: 8px;
	}

	.distress-number {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		flex-shrink: 0;
	}

	.distress-number.green {
		color: #16a34a;
	}

	.distress-number.amber {
		color: #f59e0b;
	}

	.distress-number.red {
		color: #dc2626;
	}

	.distress-info {
		flex: 1;
	}

	.distress-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1a1a2e;
	}

	.distress-sublabel {
		font-size: 0.75rem;
		color: #52525b;
	}

	/* Progress section */
	.progress-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: #e4e4e7;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(to right, #7c3aed, #a78bfa);
		transition: width 0.3s ease;
	}

	.progress-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #52525b;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.75rem;
		border-top: 1px solid #e4e4e7;
	}

	.exposure-count {
		font-size: 0.875rem;
		color: #52525b;
		font-weight: 500;
	}

	.chevron-icon {
		width: 20px;
		height: 20px;
		color: #a1a1aa;
		transition: all 0.2s ease;
	}

	.hierarchy-card:hover .chevron-icon {
		color: #7c3aed;
		transform: translateX(4px);
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.loading-spinner {
			animation: none;
		}

		.filter-tab,
		.hierarchy-card,
		.progress-fill,
		.chevron-icon {
			transition: none;
		}

		.hierarchy-card:hover {
			transform: none;
		}

		.hierarchy-card:hover .chevron-icon {
			transform: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.filter-tabs {
			padding: 0;
		}

		.items-grid {
			grid-template-columns: 1fr;
		}

		.distress-number {
			font-size: 2rem;
		}
	}
</style>
