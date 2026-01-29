<!-- src/routes/track/interests/[id]/+page.svelte -->
<!-- Interest Detail Page with History & Insights - Phase 9 Autism Productivity -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { db, getInterestSessions, getInterestSessionStats } from '$lib/db';
	import type { SpecialInterest, InterestSession, InterestCategory } from '$lib/db/types';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	const interestId = $derived(parseInt($page.params.id));

	let interest = $state<SpecialInterest | undefined>(undefined);
	let sessions = $state<InterestSession[]>([]);
	let stats = $state<{
		totalSessions: number;
		totalMinutes: number;
		avgMoodBefore: number;
		avgMoodAfter: number;
		avgMoodImpact: number;
		avgEnergyImpact: number;
		byType: Record<string, number>;
	} | null>(null);
	let loading = $state(true);

	let moodChart: Chart | null = null;
	let typeChart: Chart | null = null;

	onMount(async () => {
		await loadData();
		loading = false;
	});

	async function loadData() {
		interest = await db.specialInterests.get(interestId);
		if (!interest) return;

		sessions = await getInterestSessions(interestId);
		stats = await getInterestSessionStats(interestId);

		// Wait for DOM to render
		await new Promise(r => setTimeout(r, 50));
		renderCharts();
	}

	function renderCharts() {
		if (!stats || sessions.length === 0) return;

		// Mood Impact Over Time Chart
		const sessionsWithMood = sessions
			.filter(s => s.moodBefore !== undefined && s.moodAfter !== undefined)
			.slice(0, 20)
			.reverse(); // Show oldest first for timeline

		if (sessionsWithMood.length >= 2) {
			const moodCanvas = document.getElementById('moodChart') as HTMLCanvasElement;
			if (moodCanvas) {
				if (moodChart) moodChart.destroy();

				moodChart = new Chart(moodCanvas, {
					type: 'line',
					data: {
						labels: sessionsWithMood.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
						datasets: [
							{
								label: 'Mood Before',
								data: sessionsWithMood.map(s => s.moodBefore),
								borderColor: '#9ca3af',
								backgroundColor: 'rgba(156, 163, 175, 0.1)',
								tension: 0.3,
								fill: false
							},
							{
								label: 'Mood After',
								data: sessionsWithMood.map(s => s.moodAfter),
								borderColor: '#14b8a6',
								backgroundColor: 'rgba(20, 184, 166, 0.1)',
								tension: 0.3,
								fill: false
							}
						]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								position: 'bottom'
							}
						},
						scales: {
							y: {
								min: 1,
								max: 10,
								ticks: {
									stepSize: 1
								}
							}
						}
					}
				});
			}
		}

		// Session Type Distribution Chart
		const typeData = Object.entries(stats.byType);
		if (typeData.length > 0) {
			const typeCanvas = document.getElementById('typeChart') as HTMLCanvasElement;
			if (typeCanvas) {
				if (typeChart) typeChart.destroy();

				const colors = [
					'#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6b7280'
				];

				typeChart = new Chart(typeCanvas, {
					type: 'doughnut',
					data: {
						labels: typeData.map(([type]) => formatSessionType(type)),
						datasets: [{
							data: typeData.map(([, count]) => count),
							backgroundColor: colors.slice(0, typeData.length)
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: {
								position: 'bottom'
							}
						}
					}
				});
			}
		}
	}

	function getCategoryColor(category: InterestCategory): string {
		const colors: Record<InterestCategory, string> = {
			stem: '#3b82f6',
			creative: '#8b5cf6',
			collection: '#10b981',
			media: '#f59e0b',
			gaming: '#ef4444',
			nature: '#059669',
			history: '#7c3aed',
			language: '#06b6d4',
			other: '#6b7280'
		};
		return colors[category] || '#6b7280';
	}

	function formatSessionType(type: string): string {
		const labels: Record<string, string> = {
			research: 'Research',
			creating: 'Creating',
			consuming: 'Consuming',
			organizing: 'Organizing',
			discussing: 'Discussing',
			practicing: 'Practicing',
			other: 'Other'
		};
		return labels[type] || type;
	}

	function formatDuration(minutes: number): string {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (mins === 0) return `${hours}h`;
		return `${hours}h ${mins}m`;
	}
</script>

<svelte:head>
	<title>{interest?.name || 'Interest'} - Myndness</title>
</svelte:head>

<main class="container">
	{#if loading}
		<div class="loading">Loading...</div>
	{:else if !interest}
		<div class="error">
			<p>Interest not found</p>
			<a href="{base}/track/interests" class="btn-primary">Back to Interests</a>
		</div>
	{:else}
		<!-- Header -->
		<header class="header">
			<a href="{base}/track/interests" class="back-link" aria-label="Back to interests">
				← Back
			</a>
			<div class="header-content" style="border-left: 4px solid {getCategoryColor(interest.category)}">
				<div class="header-title">
					<h1>{interest.name}</h1>
					{#if interest.currentlyActive}
						<span class="badge badge-active">Active</span>
					{:else}
						<span class="badge badge-paused">Paused</span>
					{/if}
				</div>
				<span class="category-label" style="color: {getCategoryColor(interest.category)}">
					{interest.category}
				</span>
				{#if interest.description}
					<p class="description">{interest.description}</p>
				{/if}
			</div>
		</header>

		<!-- Quick Actions -->
		<div class="actions">
			<a href="{base}/track/interests/{interest.id}/log" class="btn-primary btn-large">
				Log Session
			</a>
		</div>

		<!-- Stats Overview -->
		{#if stats}
			<section class="stats-section">
				<h2 class="section-title">Overview</h2>
				<div class="stats-grid">
					<div class="stat-card">
						<span class="stat-value">{stats.totalSessions}</span>
						<span class="stat-label">Sessions</span>
					</div>
					<div class="stat-card">
						<span class="stat-value">{formatDuration(stats.totalMinutes)}</span>
						<span class="stat-label">Total Time</span>
					</div>
					{#if stats.avgMoodImpact !== 0}
						<div class="stat-card">
							<span class="stat-value" class:positive={stats.avgMoodImpact > 0} class:negative={stats.avgMoodImpact < 0}>
								{stats.avgMoodImpact > 0 ? '+' : ''}{stats.avgMoodImpact.toFixed(1)}
							</span>
							<span class="stat-label">Avg Mood Impact</span>
						</div>
					{/if}
				</div>

				<!-- Insight Text -->
				{#if stats.avgMoodImpact > 0}
					<div class="insight-card positive">
						<span class="insight-icon">✨</span>
						<p>This interest typically <strong>improves your mood by {stats.avgMoodImpact.toFixed(1)} points</strong>. Time well spent!</p>
					</div>
				{:else if stats.avgMoodImpact < -0.5}
					<div class="insight-card neutral">
						<span class="insight-icon">💡</span>
						<p>Sessions tend to leave you feeling a bit drained. Consider shorter sessions or taking breaks.</p>
					</div>
				{/if}
			</section>
		{/if}

		<!-- Charts -->
		{#if sessions.length >= 2}
			<section class="charts-section">
				<h2 class="section-title">Insights</h2>

				<!-- Mood Chart -->
				{#if sessions.some(s => s.moodBefore !== undefined && s.moodAfter !== undefined)}
					<div class="chart-container">
						<h3 class="chart-title">Mood Impact Over Time</h3>
						<div class="chart-wrapper">
							<canvas id="moodChart"></canvas>
						</div>
					</div>
				{/if}

				<!-- Session Type Chart -->
				{#if stats && Object.keys(stats.byType).length > 0}
					<div class="chart-container">
						<h3 class="chart-title">Session Types</h3>
						<div class="chart-wrapper small">
							<canvas id="typeChart"></canvas>
						</div>
					</div>
				{/if}
			</section>
		{/if}

		<!-- Session History -->
		<section class="history-section">
			<h2 class="section-title">Recent Sessions</h2>
			{#if sessions.length === 0}
				<div class="empty-state">
					<p>No sessions logged yet</p>
					<p class="text-sm">Start tracking your time with this interest</p>
				</div>
			{:else}
				<div class="session-list">
					{#each sessions.slice(0, 20) as session}
						<div class="session-item">
							<div class="session-date">
								{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
							</div>
							<div class="session-details">
								<span class="session-duration">{formatDuration(session.duration)}</span>
								<span class="session-type">{formatSessionType(session.sessionType)}</span>
								{#if session.moodBefore !== undefined && session.moodAfter !== undefined}
									{@const impact = session.moodAfter - session.moodBefore}
									<span class="session-impact" class:positive={impact > 0} class:negative={impact < 0}>
										{impact > 0 ? '+' : ''}{impact}
									</span>
								{/if}
							</div>
							{#if session.notes}
								<p class="session-notes">{session.notes}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</main>

<style>
	.container {
		max-width: 700px;
		margin: 0 auto;
		padding: 1rem;
	}

	.loading,
	.error {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.back-link {
		display: inline-block;
		color: #6b7280;
		text-decoration: none;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.back-link:hover {
		color: #14b8a6;
	}

	.header-content {
		background: #f9fafb;
		padding: 1rem 1rem 1rem 1.25rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.header-title h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	.category-label {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.description {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.badge {
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge-active {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-paused {
		background: #fee2e2;
		color: #991b1b;
	}

	.actions {
		margin-bottom: 2rem;
	}

	.btn-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		border: none;
		text-decoration: none;
		background: #14b8a6;
		color: white;
		transition: background 0.2s;
	}

	.btn-primary:hover {
		background: #0d9488;
	}

	.btn-large {
		width: 100%;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	/* Stats Section */
	.stats-section {
		margin-bottom: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.stat-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		padding: 1rem;
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	.stat-value.positive {
		color: #10b981;
	}

	.stat-value.negative {
		color: #ef4444;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.insight-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 10px;
		font-size: 0.9375rem;
	}

	.insight-card.positive {
		background: #d1fae5;
		color: #065f46;
	}

	.insight-card.neutral {
		background: #fef3c7;
		color: #92400e;
	}

	.insight-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	/* Charts Section */
	.charts-section {
		margin-bottom: 2rem;
	}

	.chart-container {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.chart-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.75rem;
	}

	.chart-wrapper {
		height: 200px;
	}

	.chart-wrapper.small {
		height: 180px;
	}

	/* History Section */
	.history-section {
		margin-bottom: 2rem;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: #6b7280;
		background: #f9fafb;
		border-radius: 12px;
	}

	.session-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.session-item {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		padding: 1rem;
	}

	.session-date {
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.session-details {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.session-duration {
		font-size: 1rem;
		font-weight: 700;
		color: #1f2937;
	}

	.session-type {
		font-size: 0.875rem;
		color: #6b7280;
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.session-impact {
		font-size: 0.875rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
	}

	.session-impact.positive {
		background: #d1fae5;
		color: #065f46;
	}

	.session-impact.negative {
		background: #fee2e2;
		color: #991b1b;
	}

	.session-notes {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.5rem;
		font-style: italic;
	}

	/* Mobile */
	@media (max-width: 480px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
