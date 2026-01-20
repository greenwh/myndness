<script lang="ts">
	/**
	 * HierarchyDetail - Detail view for hierarchy item
	 *
	 * Features:
	 * - Header with situation and current status
	 * - Action button to log new exposure
	 * - Progress chart showing distress over time
	 * - Exposure history list
	 * - Mark as complete button when target reached
	 */

	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { AnxietyHierarchyItem } from '$lib/db/types';

	import ExposureChart from './ExposureChart.svelte';

	interface Props {
		item: AnxietyHierarchyItem;
		onRefresh?: () => void;
	}

	let { item, onRefresh }: Props = $props();

	// Can mark complete if current <= target
	const canMarkComplete = $derived(
		item.targetDistress !== undefined && item.currentDistress <= item.targetDistress && !item.isComplete
	);

	// Get distress color
	function getDistressColor(suds: number): string {
		if (suds <= 33) return 'green';
		if (suds <= 66) return 'amber';
		return 'red';
	}

	// Format date/time
	function formatDateTime(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Mark as complete
	async function markComplete() {
		if (!browser) return;

		const confirmed = confirm(
			'Mark this item as complete? This means you\'ve reached your target distress level.'
		);

		if (!confirmed) return;

		try {
			await db.anxietyHierarchy.update(item.id!, {
				isComplete: true
			});

			if (onRefresh) {
				onRefresh();
			}
		} catch (error) {
			console.error('Failed to mark complete:', error);
			alert('Failed to mark as complete. Please try again.');
		}
	}

	// Group exposures by date
	const exposuresByDate = $derived(() => {
		const grouped: Record<string, typeof item.exposureAttempts> = {};

		for (const exposure of item.exposureAttempts) {
			if (!grouped[exposure.date]) {
				grouped[exposure.date] = [];
			}
			grouped[exposure.date].push(exposure);
		}

		// Sort dates descending (newest first)
		const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

		return sortedDates.map((date) => ({
			date,
			exposures: grouped[date]
		}));
	});
</script>

<div class="detail-container">
	<!-- Header -->
	<div class="detail-header">
		<div class="header-content">
			<div class="situation-section">
				<h2 class="situation">{item.situation}</h2>
				{#if item.category}
					<span class="category-badge">{item.category}</span>
				{/if}
			</div>

			<div class="distress-comparison">
				<div class="distress-item">
					<div class="distress-label">Initial</div>
					<div class="distress-value">{item.initialDistress}</div>
				</div>
				<svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 8l4 4m0 0l-4 4m4-4H3"
					/>
				</svg>
				<div class="distress-item">
					<div class="distress-label">Current</div>
					<div class="distress-value {getDistressColor(item.currentDistress)}">
						{item.currentDistress}
					</div>
				</div>
				{#if item.targetDistress !== undefined}
					<svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
					<div class="distress-item">
						<div class="distress-label">Target</div>
						<div class="distress-value green">{item.targetDistress}</div>
					</div>
				{/if}
			</div>
		</div>

		{#if item.isComplete}
			<div class="complete-badge">
				<svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				Complete
			</div>
		{:else if canMarkComplete}
			<button class="btn-complete" onclick={markComplete}>
				Mark as Complete
			</button>
		{/if}
	</div>

	<!-- Action button -->
	{#if !item.isComplete}
		<div class="action-section">
			<a href="{base}/tools/cbt/hierarchy/{item.id}/expose" class="btn-primary btn-large">
				<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Log New Exposure
			</a>
		</div>
	{/if}

	<!-- Progress chart -->
	<div class="chart-section">
		<h3 class="section-title">Progress Chart</h3>
		<ExposureChart exposureAttempts={item.exposureAttempts} targetDistress={item.targetDistress} />
	</div>

	<!-- Exposure history -->
	{#if item.exposureAttempts.length > 0}
		<div class="history-section">
			<h3 class="section-title">Exposure History</h3>

			<div class="history-list">
				{#each exposuresByDate() as group (group.date)}
					<div class="date-group">
						<div class="date-header">{formatDate(group.date)}</div>

						{#each group.exposures as exposure, index}
							<div class="exposure-card">
								<div class="exposure-header">
									<span class="exposure-number">Exposure #{item.exposureAttempts.indexOf(exposure) + 1}</span>
									<span class="exposure-duration">{exposure.duration} min</span>
								</div>

								<div class="distress-flow">
									<div class="flow-item">
										<span class="flow-label">Before</span>
										<span class="flow-value">{exposure.distressBefore}</span>
									</div>
									<svg class="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
									<div class="flow-item">
										<span class="flow-label">During</span>
										<span class="flow-value">{exposure.distressDuring}</span>
									</div>
									<svg class="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
									<div class="flow-item">
										<span class="flow-label">After</span>
										<span class="flow-value">{exposure.distressAfter}</span>
									</div>
								</div>

								{#if exposure.notes}
									<div class="exposure-notes">
										<div class="notes-label">Notes:</div>
										<div class="notes-text">{exposure.notes}</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.detail-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Header */
	.detail-header {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.situation-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.situation {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
		margin: 0;
		flex: 1;
	}

	.category-badge {
		padding: 0.375rem 0.875rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
		background: #ede9fe;
		color: #6d28d9;
	}

	.distress-comparison {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f4f4f5;
		border-radius: 8px;
	}

	.distress-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.distress-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #52525b;
	}

	.distress-value {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.distress-value.green {
		color: #16a34a;
	}

	.distress-value.amber {
		color: #f59e0b;
	}

	.distress-value.red {
		color: #dc2626;
	}

	.arrow-icon {
		width: 24px;
		height: 24px;
		color: #52525b;
		flex-shrink: 0;
	}

	.complete-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: #dcfce7;
		color: #166534;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		align-self: flex-start;
	}

	.badge-icon {
		width: 20px;
		height: 20px;
	}

	.btn-complete {
		min-height: 44px;
		padding: 0 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: #16a34a;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		align-self: flex-start;
	}

	.btn-complete:hover {
		background: #15803d;
		box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3);
	}

	.btn-complete:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
	}

	/* Action section */
	.action-section {
		display: flex;
		justify-content: center;
	}

	.btn-primary {
		min-height: 44px;
		padding: 0 2rem;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: white;
		background: #7c3aed;
		border: none;
		border-radius: 8px;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary.btn-large {
		padding: 0.875rem 2rem;
	}

	.btn-primary:hover {
		background: #6d28d9;
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.btn-icon {
		width: 24px;
		height: 24px;
	}

	/* Chart section */
	.chart-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a2e;
		margin: 0;
	}

	/* History section */
	.history-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.date-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.date-header {
		font-size: 0.875rem;
		font-weight: 600;
		color: #52525b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.exposure-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.exposure-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.exposure-number {
		font-size: 0.875rem;
		font-weight: 600;
		color: #7c3aed;
	}

	.exposure-duration {
		font-size: 0.875rem;
		color: #52525b;
	}

	.distress-flow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		background: #f4f4f5;
		border-radius: 8px;
	}

	.flow-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		flex: 1;
	}

	.flow-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: #52525b;
	}

	.flow-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.flow-arrow {
		width: 20px;
		height: 20px;
		color: #a1a1aa;
		flex-shrink: 0;
	}

	.exposure-notes {
		padding-top: 1rem;
		border-top: 1px solid #e4e4e7;
	}

	.notes-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #52525b;
		margin-bottom: 0.5rem;
	}

	.notes-text {
		font-size: 0.875rem;
		color: #1a1a2e;
		line-height: 1.6;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.btn-primary,
		.btn-complete {
			transition: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.situation {
			font-size: 1.25rem;
		}

		.distress-comparison {
			flex-wrap: wrap;
			justify-content: center;
		}

		.distress-value {
			font-size: 1.5rem;
		}

		.arrow-icon {
			transform: rotate(90deg);
		}

		.btn-primary.btn-large {
			width: 100%;
			justify-content: center;
		}

		.distress-flow {
			flex-wrap: wrap;
		}

		.flow-item {
			min-width: 60px;
		}

		.flow-arrow {
			display: none;
		}
	}
</style>
