<!-- src/routes/track/interests/+page.svelte -->
<!-- Special Interests Hub - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { db, getInterestSessionStats } from '$lib/db';
	import type { SpecialInterest, InterestCategory } from '$lib/db/types';

	let interests = $state<SpecialInterest[]>([]);
	let loading = $state(true);
	let showAddForm = $state(false);
	let newInterestName = $state('');
	let newInterestCategory = $state<InterestCategory>('other');
	let newInterestDescription = $state('');

	onMount(async () => {
		await loadInterests();
		loading = false;
	});

	async function loadInterests() {
		interests = await db.specialInterests.orderBy('createdAt').reverse().toArray();

		// Load stats for each
		for (const interest of interests) {
			if (interest.id) {
				const stats = await getInterestSessionStats(interest.id);
				interest.totalSessions = stats.totalSessions;
				interest.totalMinutes = stats.totalMinutes;
				interest.avgMoodImpact = stats.avgMoodImpact;
			}
		}
	}

	async function addInterest() {
		if (!newInterestName.trim()) return;

		await db.specialInterests.add({
			createdAt: new Date().toISOString(),
			name: newInterestName.trim(),
			category: newInterestCategory,
			description: newInterestDescription.trim() || undefined,
			startedDate: new Date().toISOString().split('T')[0],
			currentlyActive: true
		});

		newInterestName = '';
		newInterestDescription = '';
		showAddForm = false;
		await loadInterests();
	}

	async function toggleActive(id: number, currentlyActive: boolean) {
		await db.specialInterests.update(id, {
			currentlyActive: !currentlyActive,
			pausedDate: !currentlyActive ? undefined : new Date().toISOString().split('T')[0]
		});
		await loadInterests();
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
</script>

<svelte:head>
	<title>Special Interests - Myndness</title>
</svelte:head>

<main class="container">
	<header class="header">
		<h1 class="text-3xl font-bold">Special Interests</h1>
		<p class="text-gray-600">Track the things you love - time well spent</p>
	</header>

	<button onclick={() => showAddForm = !showAddForm} class="btn-primary btn-large">
		{showAddForm ? '- Cancel' : '+ Add New Interest'}
	</button>

	{#if showAddForm}
		<div class="add-form">
			<h2 class="form-title">Add Special Interest</h2>
			<div class="form-group">
				<label for="name">Interest Name</label>
				<input
					id="name"
					type="text"
					bind:value={newInterestName}
					placeholder="e.g., Photography, Model trains, Medieval history..."
					class="input"
				/>
			</div>
			<div class="form-group">
				<label for="category">Category</label>
				<select id="category" bind:value={newInterestCategory} class="input">
					<option value="stem">STEM (Science, Tech, Engineering, Math)</option>
					<option value="creative">Creative (Art, Music, Writing)</option>
					<option value="collection">Collection & Organizing</option>
					<option value="media">Media (Shows, Movies, Books, Podcasts)</option>
					<option value="gaming">Gaming</option>
					<option value="nature">Nature (Animals, Plants, Outdoors)</option>
					<option value="history">History & Culture</option>
					<option value="language">Languages</option>
					<option value="other">Other</option>
				</select>
			</div>
			<div class="form-group">
				<label for="description">Description (optional)</label>
				<textarea
					id="description"
					bind:value={newInterestDescription}
					placeholder="What do you love about it?"
					rows="2"
					class="input"
				></textarea>
			</div>
			<button onclick={addInterest} class="btn-primary">Add Interest</button>
		</div>
	{/if}

	{#if loading}
		<div class="loading">Loading...</div>
	{:else if interests.length === 0}
		<div class="empty-state">
			<p>No interests tracked yet</p>
			<p class="text-sm">Add your special interests to track time and see how they impact your mood</p>
		</div>
	{:else}
		<div class="interests-grid">
			{#each interests as interest}
				<div class="interest-card" style="border-left: 4px solid {getCategoryColor(interest.category)}">
					<div class="interest-header">
						<div>
							<h3 class="interest-name">{interest.name}</h3>
							<span class="interest-category" style="color: {getCategoryColor(interest.category)}">
								{interest.category}
							</span>
						</div>
						{#if interest.currentlyActive}
							<span class="badge badge-active">Active</span>
						{:else}
							<span class="badge badge-paused">Paused</span>
						{/if}
					</div>

					{#if interest.description}
						<p class="interest-desc">{interest.description}</p>
					{/if}

					<div class="interest-stats">
						{#if interest.totalSessions}
							<div class="stat">
								<span class="stat-value">{interest.totalSessions}</span>
								<span class="stat-label">sessions</span>
							</div>
							<div class="stat">
								<span class="stat-value">{Math.round((interest.totalMinutes || 0) / 60)}h</span>
								<span class="stat-label">total time</span>
							</div>
							{#if interest.avgMoodImpact && interest.avgMoodImpact > 0}
								<div class="stat">
									<span class="stat-value positive">+{interest.avgMoodImpact.toFixed(1)}</span>
									<span class="stat-label">avg mood</span>
								</div>
							{/if}
						{:else}
							<p class="text-sm text-gray-500">No sessions logged yet</p>
						{/if}
					</div>

					<div class="interest-actions">
						<a href="{base}/track/interests/{interest.id}/log" class="btn-primary btn-sm">
							Log Session
						</a>
						<button
							onclick={() => toggleActive(interest.id!, interest.currentlyActive)}
							class="btn-secondary btn-sm"
						>
							{interest.currentlyActive ? 'Pause' : 'Resume'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.add-form {
		background: #f9fafb;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 1rem;
	}

	.loading,
	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.interests-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}

	.interest-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.interest-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.interest-name {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.interest-category {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.interest-desc {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.interest-stats {
		display: flex;
		gap: 1.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.stat-value.positive {
		color: #10b981;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.interest-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
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

	.btn-primary,
	.btn-secondary {
		min-height: 44px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		flex: 1;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-large {
		width: 100%;
		margin-bottom: 1.5rem;
	}

	.btn-sm {
		padding: 0.5rem 1rem;
		min-height: 38px;
		font-size: 0.875rem;
	}

	.btn-primary {
		background: #14b8a6;
		color: white;
	}

	.btn-primary:hover {
		background: #0d9488;
	}

	.btn-secondary {
		background: white;
		color: #374151;
		border: 2px solid #d1d5db;
	}
</style>
