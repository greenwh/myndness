<script lang="ts">
	/**
	 * ThoughtRecordHistory - List of thought records
	 *
	 * Features:
	 * - Date-grouped card list
	 * - Filter: all / completed / drafts
	 * - Show emotion intensity before/after
	 * - Tap to view/edit
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { ThoughtRecord } from '$lib/db/types';

	let records = $state<ThoughtRecord[]>([]);
	let filter = $state<'all' | 'completed' | 'drafts'>('all');
	let loading = $state(true);

	const emotionEmojis: Record<string, string> = {
		anxious: '😰',
		sad: '😢',
		angry: '😠',
		guilty: '😔',
		ashamed: '😳',
		frustrated: '😤',
		hopeless: '😞',
		overwhelmed: '😫',
		fearful: '😨',
		other: '🤔'
	};

	const filteredRecords = $derived(() => {
		switch (filter) {
			case 'completed':
				return records.filter(r => r.isComplete);
			case 'drafts':
				return records.filter(r => !r.isComplete);
			default:
				return records;
		}
	});

	// Group by date
	const groupedRecords = $derived(() => {
		const groups: Record<string, ThoughtRecord[]> = {};

		filteredRecords().forEach(record => {
			if (!groups[record.date]) {
				groups[record.date] = [];
			}
			groups[record.date].push(record);
		});

		// Sort dates descending
		return Object.entries(groups)
			.sort(([a], [b]) => b.localeCompare(a))
			.map(([date, records]) => ({
				date,
				records: records.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
			}));
	});

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const dateOnly = date.toISOString().split('T')[0];
		const todayOnly = today.toISOString().split('T')[0];
		const yesterdayOnly = yesterday.toISOString().split('T')[0];

		if (dateOnly === todayOnly) return 'Today';
		if (dateOnly === yesterdayOnly) return 'Yesterday';

		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	async function loadRecords() {
		if (!browser) return;

		loading = true;
		try {
			// Get records from last 30 days
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			const startDate = thirtyDaysAgo.toISOString().split('T')[0];
			const today = new Date().toISOString().split('T')[0];

			records = await db.thoughtRecords
				.where('date')
				.between(startDate, today, true, true)
				.reverse()
				.sortBy('timestamp');
		} catch (error) {
			console.error('Failed to load thought records:', error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadRecords();
	});
</script>

<div class="thought-record-history">
	<!-- Filters -->
	<div class="history-filters">
		<button
			class="filter-button"
			class:filter-button-active={filter === 'all'}
			onclick={() => filter = 'all'}
		>
			All
		</button>
		<button
			class="filter-button"
			class:filter-button-active={filter === 'completed'}
			onclick={() => filter = 'completed'}
		>
			Completed
		</button>
		<button
			class="filter-button"
			class:filter-button-active={filter === 'drafts'}
			onclick={() => filter = 'drafts'}
		>
			Drafts
		</button>
	</div>

	<!-- Records list -->
	{#if loading}
		<div class="history-loading">
			<p>Loading thought records...</p>
		</div>
	{:else if groupedRecords().length === 0}
		<div class="history-empty">
			<div class="empty-icon">💭</div>
			<p class="empty-message">No thought records yet</p>
			<a href="{base}/tools/cbt/thought-record" class="btn-primary">
				Create First Record
			</a>
		</div>
	{:else}
		<div class="history-list">
			{#each groupedRecords() as group}
				<div class="date-group">
					<h2 class="date-heading">{formatDate(group.date)}</h2>

					<div class="records-grid">
						{#each group.records as record}
							<a
								href="{base}/tools/cbt/thought-record/{record.id}"
								class="record-card"
							>
								<!-- Header -->
								<div class="record-header">
									<div class="record-emotion">
										<span class="record-emoji">{emotionEmojis[record.emotion]}</span>
										<span class="record-emotion-name">
											{record.emotion === 'other' && record.emotionOther
												? record.emotionOther
												: record.emotion}
										</span>
									</div>
									<span class="record-time">{formatTime(record.timestamp)}</span>
								</div>

								<!-- Situation preview -->
								<p class="record-situation">
									{record.situation.length > 100
										? record.situation.substring(0, 100) + '...'
										: record.situation}
								</p>

								<!-- Intensity change -->
								<div class="record-intensity">
									<div class="intensity-bar">
										<div
											class="intensity-before"
											style="width: {record.emotionIntensity}%; background-color: {record.emotionIntensity <= 33 ? '#22c55e' : record.emotionIntensity <= 66 ? '#f59e0b' : '#ef4444'}"
										></div>
									</div>
									<div class="intensity-labels">
										<span>Before: {record.emotionIntensity}</span>
										{#if record.isComplete}
											<span>After: {record.outcomeIntensity}</span>
											{#if record.outcomeIntensity < record.emotionIntensity}
												<span class="intensity-change change-positive">
													↓ {record.emotionIntensity - record.outcomeIntensity}
												</span>
											{/if}
										{/if}
									</div>
								</div>

								<!-- Distortions count -->
								<div class="record-footer">
									<span class="distortions-count">
										{record.distortions.length} thinking {record.distortions.length === 1 ? 'trap' : 'traps'}
									</span>
									{#if !record.isComplete}
										<span class="draft-badge">Draft</span>
									{/if}
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.thought-record-history {
		max-width: 48rem;
		margin: 0 auto;
		padding: 1rem;
	}

	.history-filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding: 0.25rem;
		background: #f4f4f5;
		border-radius: 8px;
	}

	.filter-button {
		flex: 1;
		padding: 0.75rem;
		border: none;
		background: transparent;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-secondary, #52525b);
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	.filter-button:hover {
		background: white;
	}

	.filter-button-active {
		background: white;
		color: var(--primary-600, #7c3aed);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.history-loading,
	.history-empty {
		text-align: center;
		padding: 4rem 2rem;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-message {
		font-size: 1.125rem;
		color: var(--text-secondary, #52525b);
		margin-bottom: 1.5rem;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.date-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.date-heading {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e4e4e7;
	}

	.records-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.record-card {
		display: block;
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.25rem;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.record-card:hover {
		border-color: var(--primary-400, #a78bfa);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transform: translateY(-2px);
	}

	.record-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.record-emotion {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.record-emoji {
		font-size: 1.5rem;
	}

	.record-emotion-name {
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		text-transform: capitalize;
	}

	.record-time {
		font-size: 0.875rem;
		color: var(--text-muted, #a1a1aa);
	}

	.record-situation {
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.record-intensity {
		margin-bottom: 1rem;
	}

	.intensity-bar {
		height: 8px;
		background: #e4e4e7;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.intensity-before {
		height: 100%;
		transition: width 0.3s ease;
	}

	.intensity-labels {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
	}

	.intensity-change {
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
	}

	.change-positive {
		color: var(--success-700, #15803d);
		background: var(--success-50, #f0fdf4);
	}

	.record-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.75rem;
		border-top: 1px solid #f4f4f5;
	}

	.distortions-count {
		font-size: 0.875rem;
		color: var(--text-muted, #a1a1aa);
	}

	.draft-badge {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--warning-700, #a16207);
		background: var(--warning-100, #fef3c7);
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.record-card,
		.intensity-before {
			transition: none;
		}
	}
</style>
