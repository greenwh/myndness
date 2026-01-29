<!-- src/routes/track/interests/[id]/log/+page.svelte -->
<!-- Interest Session Logging - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { SpecialInterest, InterestSessionType } from '$lib/db/types';

	const interestId = $derived(parseInt($page.params.id));
	let interest = $state<SpecialInterest | undefined>(undefined);
	let duration = $state(60);
	let sessionType = $state<InterestSessionType>('consuming');
	let moodBefore = $state<number | undefined>(undefined);
	let moodAfter = $state<number | undefined>(undefined);
	let showMoodRatings = $state(false);
	let notes = $state('');
	let saving = $state(false);
	let saved = $state(false);

	onMount(async () => {
		interest = await db.specialInterests.get(interestId);
	});

	async function handleSave() {
		if (!interest?.id) return;

		saving = true;
		await db.interestSessions.add({
			date: new Date().toISOString().split('T')[0],
			timestamp: new Date().toISOString(),
			interestId: interest.id,
			duration,
			sessionType,
			moodBefore: showMoodRatings ? moodBefore : undefined,
			moodAfter: showMoodRatings ? moodAfter : undefined,
			notes: notes.trim() || undefined
		});

		saved = true;
		saving = false;
	}
</script>

<svelte:head>
	<title>Log Session - Myndness</title>
</svelte:head>

<main class="container">
	{#if saved}
		<div class="success-view">
			<div class="success-icon">✓</div>
			<h2 class="text-2xl font-bold mb-2">Session Logged!</h2>
			<p class="mb-6">{duration} minutes of {interest?.name}</p>
			<div class="button-group">
				<a href="{base}/track/interests" class="btn-secondary">View All Interests</a>
				<button onclick={() => { saved = false; duration = 60; notes = ''; }} class="btn-primary">
					Log Another
				</button>
			</div>
		</div>
	{:else if !interest}
		<p>Loading...</p>
	{:else}
		<header class="header">
			<h1 class="text-2xl font-bold">Log Session</h1>
			<p class="text-lg text-gray-600">{interest.name}</p>
		</header>

		<div class="form-section">
			<label class="form-label">How long did you engage?</label>
			<input type="range" bind:value={duration} min="5" max="300" step="5" class="range" />
			<div class="range-value">{duration} minutes</div>
		</div>

		<div class="form-section">
			<label class="form-label">What were you doing?</label>
			<select bind:value={sessionType} class="input">
				<option value="research">Research / Learning</option>
				<option value="creating">Creating / Making</option>
				<option value="consuming">Consuming (watching, reading, playing)</option>
				<option value="organizing">Organizing / Cataloging</option>
				<option value="discussing">Discussing / Community</option>
				<option value="practicing">Practicing / Skill Building</option>
				<option value="other">Other</option>
			</select>
		</div>

		{#if !showMoodRatings}
			<button onclick={() => showMoodRatings = true} class="btn-link">
				+ Track mood impact
			</button>
		{:else}
			<div class="form-section">
				<label class="form-label">Mood before (optional)</label>
				<input type="range" bind:value={moodBefore} min="1" max="10" class="range" />
				<div class="range-value">{moodBefore || 5}/10</div>
			</div>
			<div class="form-section">
				<label class="form-label">Mood after (optional)</label>
				<input type="range" bind:value={moodAfter} min="1" max="10" class="range" />
				<div class="range-value">{moodAfter || 5}/10</div>
			</div>
		{/if}

		<div class="form-section">
			<label class="form-label">Notes (optional)</label>
			<textarea bind:value={notes} maxlength="200" rows="3" class="input"></textarea>
			<div class="char-count">{notes.length}/200</div>
		</div>

		<div class="button-group">
			<a href="{base}/track/interests" class="btn-secondary">Cancel</a>
			<button onclick={handleSave} disabled={saving} class="btn-primary">
				{saving ? 'Saving...' : 'Save Session'}
			</button>
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.success-view {
		text-align: center;
		padding: 2rem 1rem;
	}

	.success-icon {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #14b8a6;
		color: white;
		font-size: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.5rem;
	}

	.form-section {
		margin-bottom: 2rem;
	}

	.form-label {
		display: block;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 1rem;
	}

	.range {
		width: 100%;
		height: 44px;
	}

	.range-value {
		text-align: center;
		font-size: 1.5rem;
		font-weight: 700;
		color: #14b8a6;
		margin-top: 0.5rem;
	}

	.char-count {
		text-align: right;
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		min-height: 44px;
		padding: 0.75rem 1.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-primary {
		background: #14b8a6;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0d9488;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		color: #374151;
		border: 2px solid #d1d5db;
	}

	.btn-link {
		background: none;
		border: none;
		color: #14b8a6;
		text-decoration: underline;
		padding: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		margin-bottom: 1rem;
	}
</style>
