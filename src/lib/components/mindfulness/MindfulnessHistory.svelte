<script lang="ts">
	/**
	 * MindfulnessHistory - List of mindfulness sessions
	 *
	 * Features:
	 * - Date-grouped session list
	 * - Filter: all / completed / incomplete
	 * - Summary stats: total sessions, minutes, avg duration
	 * - Show mood/anxiety changes if tracked
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { db } from '$lib/db';
	import type { MindfulnessSession } from '$lib/db/types';

	let sessions = $state<MindfulnessSession[]>([]);
	let filter = $state<'all' | 'completed' | 'incomplete'>('all');
	let loading = $state(true);

	// Practice type labels
	const practiceLabels: Record<string, string> = {
		'breath-awareness': 'Breath Awareness',
		'body-scan-short': 'Body Scan (Short)',
		'body-scan-full': 'Body Scan (Full)',
		'loving-kindness': 'Loving-Kindness',
		'open-awareness': 'Open Awareness',
		'walking-meditation': 'Walking Meditation',
		'sound-awareness': 'Sound Awareness',
		other: 'Other'
	};

	// Practice type emojis
	const practiceEmojis: Record<string, string> = {
		'breath-awareness': '🌬️',
		'body-scan-short': '🧘',
		'body-scan-full': '🧘',
		'loving-kindness': '💚',
		'open-awareness': '🌟',
		'walking-meditation': '🚶',
		'sound-awareness': '🔔',
		other: '✨'
	};

	// Filtered sessions
	const filteredSessions = $derived(() => {
		switch (filter) {
			case 'completed':
				return sessions.filter((s) => s.completed);
			case 'incomplete':
				return sessions.filter((s) => !s.completed);
			default:
				return sessions;
		}
	});

	// Group by date
	const groupedSessions = $derived(() => {
		const groups: Record<string, MindfulnessSession[]> = {};

		filteredSessions().forEach((session) => {
			if (!groups[session.date]) {
				groups[session.date] = [];
			}
			groups[session.date].push(session);
		});

		// Sort dates descending
		return Object.entries(groups)
			.sort(([a], [b]) => b.localeCompare(a))
			.map(([date, sessions]) => ({
				date,
				sessions: sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
			}));
	});

	// Calculate stats
	const stats = $derived(() => {
		const completedSessions = sessions.filter((s) => s.completed);
		const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationActual || 0), 0);
		const avgDuration =
			completedSessions.length > 0
				? totalMinutes / completedSessions.length
				: 0;

		return {
			totalSessions: sessions.length,
			completedSessions: completedSessions.length,
			totalMinutes: Math.round(totalMinutes),
			avgDuration: Math.round(avgDuration * 10) / 10
		};
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

	async function loadSessions() {
		if (!browser) return;

		loading = true;
		try {
			// Get sessions from last 30 days
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			const startDate = thirtyDaysAgo.toISOString().split('T')[0];
			const today = new Date().toISOString().split('T')[0];

			sessions = await db.mindfulnessSessions
				.where('date')
				.between(startDate, today, true, true)
				.reverse()
				.sortBy('timestamp');
		} catch (error) {
			console.error('Failed to load mindfulness sessions:', error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadSessions();
	});
</script>

<div class="mindfulness-history">
	<!-- Stats Summary -->
	{#if !loading && sessions.length > 0}
		<div class="stats-summary">
			<div class="stat-card">
				<div class="stat-value">{stats().totalSessions}</div>
				<div class="stat-label">Total Sessions</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{stats().totalMinutes}</div>
				<div class="stat-label">Total Minutes</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{stats().avgDuration}</div>
				<div class="stat-label">Avg Duration (min)</div>
			</div>
		</div>
	{/if}

	<!-- Filters -->
	<div class="history-filters">
		<button
			class="filter-button"
			class:filter-button-active={filter === 'all'}
			onclick={() => (filter = 'all')}
		>
			All
		</button>
		<button
			class="filter-button"
			class:filter-button-active={filter === 'completed'}
			onclick={() => (filter = 'completed')}
		>
			Completed
		</button>
		<button
			class="filter-button"
			class:filter-button-active={filter === 'incomplete'}
			onclick={() => (filter = 'incomplete')}
		>
			Incomplete
		</button>
	</div>

	<!-- Sessions list -->
	{#if loading}
		<div class="history-loading">
			<p>Loading sessions...</p>
		</div>
	{:else if groupedSessions().length === 0}
		<div class="history-empty">
			<div class="empty-icon">🧘</div>
			<p class="empty-message">No meditation sessions yet</p>
			<p class="empty-hint">Start practicing to build your mindfulness journey</p>
		</div>
	{:else}
		<div class="history-list">
			{#each groupedSessions() as group}
				<div class="date-group">
					<h2 class="date-heading">{formatDate(group.date)}</h2>

					<div class="sessions-grid">
						{#each group.sessions as session}
							<div class="session-card">
								<!-- Header -->
								<div class="session-header">
									<div class="session-practice">
										<span class="session-emoji">{practiceEmojis[session.practiceType]}</span>
										<span class="session-practice-name">
											{practiceLabels[session.practiceType]}
										</span>
									</div>
									<span class="session-time">{formatTime(session.timestamp)}</span>
								</div>

								<!-- Duration -->
								<div class="session-duration">
									<span class="duration-actual">
										{session.durationActual || 0} min
									</span>
									{#if !session.completed}
										<span class="duration-incomplete">(incomplete)</span>
									{/if}
								</div>

								<!-- Mood/Anxiety changes (if tracked) -->
								{#if session.moodBefore !== undefined && session.moodAfter !== undefined}
									<div class="session-tracking">
										<div class="tracking-row">
											<span class="tracking-label">Mood:</span>
											<div class="tracking-change">
												<span class="tracking-before">{session.moodBefore}</span>
												<span class="tracking-arrow">→</span>
												<span
													class="tracking-after"
													class:tracking-improved={session.moodAfter > session.moodBefore}
													class:tracking-worsened={session.moodAfter < session.moodBefore}
												>
													{session.moodAfter}
												</span>
											</div>
										</div>
										{#if session.anxietyBefore !== undefined && session.anxietyAfter !== undefined}
											<div class="tracking-row">
												<span class="tracking-label">Anxiety:</span>
												<div class="tracking-change">
													<span class="tracking-before">{session.anxietyBefore}</span>
													<span class="tracking-arrow">→</span>
													<span
														class="tracking-after"
														class:tracking-improved={session.anxietyAfter < session.anxietyBefore}
														class:tracking-worsened={session.anxietyAfter > session.anxietyBefore}
													>
														{session.anxietyAfter}
													</span>
												</div>
											</div>
										{/if}
										{#if session.focusQuality !== undefined}
											<div class="tracking-row">
												<span class="tracking-label">Focus:</span>
												<span class="tracking-value">{session.focusQuality}/10</span>
											</div>
										{/if}
									</div>
								{/if}

								<!-- Notes (if present) -->
								{#if session.notes}
									<div class="session-notes">
										{session.notes.length > 80
											? session.notes.substring(0, 80) + '...'
											: session.notes}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.mindfulness-history {
		max-width: 56rem;
		margin: 0 auto;
	}

	/* Stats Summary */
	.stats-summary {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-600, #7c3aed);
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		font-weight: 500;
	}

	/* Filters */
	.history-filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #e4e4e7;
		padding-bottom: 1rem;
	}

	.filter-button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: none;
		color: var(--text-secondary, #52525b);
		font-weight: 500;
		cursor: pointer;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	.filter-button:hover {
		background: var(--primary-50, #faf5ff);
		color: var(--primary-700, #6d28d9);
	}

	.filter-button-active {
		background: var(--primary-100, #f3e8ff);
		color: var(--primary-700, #6d28d9);
	}

	/* Loading & Empty states */
	.history-loading,
	.history-empty {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary, #52525b);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-message {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.5rem;
	}

	.empty-hint {
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
		margin-bottom: 2rem;
	}

	/* History list */
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
		padding-left: 0.5rem;
	}

	.sessions-grid {
		display: grid;
		gap: 1rem;
	}

	.session-card {
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.25rem;
		transition: all 0.2s ease;
	}

	.session-card:hover {
		border-color: var(--primary-400, #a78bfa);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.session-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.session-practice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.session-emoji {
		font-size: 1.5rem;
	}

	.session-practice-name {
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
	}

	.session-time {
		font-size: 0.875rem;
		color: var(--text-muted, #a1a1aa);
	}

	.session-duration {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.duration-actual {
		font-size: 1rem;
		font-weight: 600;
		color: var(--success-600, #16a34a);
	}

	.duration-incomplete {
		font-size: 0.875rem;
		color: var(--warning-600, #ca8a04);
		font-style: italic;
	}

	/* Tracking data */
	.session-tracking {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--gray-50, #f9fafb);
		border-radius: 8px;
		margin-bottom: 0.75rem;
	}

	.tracking-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
	}

	.tracking-label {
		color: var(--text-secondary, #52525b);
		font-weight: 500;
	}

	.tracking-change {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tracking-before,
	.tracking-after {
		font-weight: 600;
	}

	.tracking-before {
		color: var(--text-muted, #a1a1aa);
	}

	.tracking-after {
		color: var(--text-primary, #1a1a2e);
	}

	.tracking-improved {
		color: var(--success-600, #16a34a) !important;
	}

	.tracking-worsened {
		color: var(--danger-600, #dc2626) !important;
	}

	.tracking-arrow {
		color: var(--text-muted, #a1a1aa);
	}

	.tracking-value {
		font-weight: 600;
		color: var(--primary-600, #7c3aed);
	}

	/* Notes */
	.session-notes {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		font-style: italic;
		padding: 0.75rem;
		background: var(--primary-50, #faf5ff);
		border-radius: 8px;
		border-left: 3px solid var(--primary-400, #a78bfa);
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.stats-summary {
			grid-template-columns: 1fr;
		}

		.stat-card {
			padding: 1rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}

		.session-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.tracking-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.session-card,
		.filter-button {
			transition: none;
		}
	}
</style>
