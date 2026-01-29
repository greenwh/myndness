<!-- src/routes/plan/templates/+page.svelte -->
<!-- Routine Templates Page - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { RoutineTemplate, PlannedActivity, RoutineActivitySlot } from '$lib/db/types';

	let templates = $state<RoutineTemplate[]>([]);
	let todayActivities = $state<PlannedActivity[]>([]);
	let loading = $state(true);
	let saving = $state(false);

	onMount(async () => {
		await loadTemplates();
		await loadTodayActivities();
		await seedDefaultTemplates();
		loading = false;
	});

	async function loadTemplates() {
		templates = await db.routineTemplates.toArray();
	}

	async function loadTodayActivities() {
		const today = new Date().toISOString().split('T')[0];
		todayActivities = await db.plannedActivities.where('date').equals(today).toArray();
	}

	async function seedDefaultTemplates() {
		const existing = await db.routineTemplates.where('isDefault').equals(1).count();
		if (existing > 0) return;

		const defaults: Omit<RoutineTemplate, 'id'>[] = [
			{
				createdAt: new Date().toISOString(),
				name: 'Weekday Routine',
				description: 'Standard workday routine',
				isDefault: true,
				activities: [
					{ timeBlock: 'morning', activity: 'Morning routine', category: 'physical', estimatedDuration: 30, spoonCost: 5 },
					{ timeBlock: 'morning', activity: 'Exercise', category: 'physical', estimatedDuration: 30, spoonCost: 7 },
					{ timeBlock: 'afternoon', activity: 'Work/productive time', category: 'mastery', estimatedDuration: 120, spoonCost: 8 },
					{ timeBlock: 'afternoon', activity: 'Lunch break', category: 'pleasure', estimatedDuration: 30, spoonCost: 2 },
					{ timeBlock: 'evening', activity: 'Dinner', category: 'pleasure', estimatedDuration: 45, spoonCost: 3 },
					{ timeBlock: 'evening', activity: 'Relaxation', category: 'pleasure', estimatedDuration: 60, spoonCost: 1 }
				],
				tags: ['weekday', 'productive'],
				timesUsed: 0
			},
			{
				createdAt: new Date().toISOString(),
				name: 'Weekend Routine',
				description: 'Relaxed weekend schedule',
				isDefault: true,
				activities: [
					{ timeBlock: 'morning', activity: 'Sleep in / slow morning', category: 'pleasure', estimatedDuration: 60, spoonCost: 1 },
					{ timeBlock: 'morning', activity: 'Leisurely breakfast', category: 'pleasure', estimatedDuration: 30, spoonCost: 2 },
					{ timeBlock: 'afternoon', activity: 'Hobby or special interest', category: 'creative', estimatedDuration: 90, spoonCost: 4 },
					{ timeBlock: 'afternoon', activity: 'Light housework', category: 'mastery', estimatedDuration: 45, spoonCost: 5 },
					{ timeBlock: 'evening', activity: 'Social time (optional)', category: 'social', estimatedDuration: 60, spoonCost: 6 },
					{ timeBlock: 'evening', activity: 'Movie or show', category: 'pleasure', estimatedDuration: 90, spoonCost: 1 }
				],
				tags: ['weekend', 'relaxed'],
				timesUsed: 0
			},
			{
				createdAt: new Date().toISOString(),
				name: 'Low Energy Day',
				description: 'Gentle routine for difficult days',
				isDefault: true,
				activities: [
					{ timeBlock: 'morning', activity: 'Basic hygiene', category: 'physical', estimatedDuration: 15, spoonCost: 3 },
					{ timeBlock: 'morning', activity: 'Simple breakfast', category: 'pleasure', estimatedDuration: 15, spoonCost: 2 },
					{ timeBlock: 'afternoon', activity: 'Rest / nap', category: 'pleasure', estimatedDuration: 60, spoonCost: 1 },
					{ timeBlock: 'afternoon', activity: 'One small task', category: 'mastery', estimatedDuration: 20, spoonCost: 3 },
					{ timeBlock: 'evening', activity: 'Easy meal', category: 'pleasure', estimatedDuration: 20, spoonCost: 2 },
					{ timeBlock: 'evening', activity: 'Comfort activity', category: 'pleasure', estimatedDuration: 90, spoonCost: 1 }
				],
				tags: ['low-energy', 'gentle'],
				timesUsed: 0
			}
		];

		for (const template of defaults) {
			await db.routineTemplates.add(template);
		}
		await loadTemplates();
	}

	async function saveCurrentAsTemplate(name: string, tags: string[] = []) {
		if (todayActivities.length === 0) {
			alert('No activities today to save as template');
			return;
		}

		saving = true;
		const activities: RoutineActivitySlot[] = todayActivities.map(a => ({
			timeBlock: a.timeBlock,
			activity: a.activity,
			category: a.category,
			estimatedDuration: a.estimatedDuration,
			spoonCost: a.spoonCost
		}));

		await db.routineTemplates.add({
			createdAt: new Date().toISOString(),
			name,
			isDefault: false,
			activities,
			tags,
			timesUsed: 0
		});

		await loadTemplates();
		saving = false;
	}

	async function applyTemplate(templateId: number) {
		const template = await db.routineTemplates.get(templateId);
		if (!template) return;

		const today = new Date().toISOString().split('T')[0];

		// Clear today's plan
		const existing = await db.plannedActivities.where('date').equals(today).toArray();
		for (const activity of existing) {
			if (activity.id) await db.plannedActivities.delete(activity.id);
		}

		// Add template activities
		for (const slot of template.activities) {
			await db.plannedActivities.add({
				date: today,
				createdAt: new Date().toISOString(),
				activity: slot.activity,
				category: slot.category,
				timeBlock: slot.timeBlock,
				estimatedDuration: slot.estimatedDuration,
				spoonCost: slot.spoonCost,
				completed: false
			});
		}

		// Increment usage
		await db.routineTemplates.update(templateId, {
			timesUsed: (template.timesUsed || 0) + 1
		});

		window.location.href = `${base}/plan/today`;
	}

	async function deleteTemplate(id: number) {
		if (!confirm('Delete this template?')) return;
		await db.routineTemplates.delete(id);
		await loadTemplates();
	}

	let showSaveDialog = $state(false);
	let newTemplateName = $state('');
</script>

<svelte:head>
	<title>Routine Templates - Myndness</title>
</svelte:head>

<main class="container">
	<header class="header">
		<a href="{base}/plan" class="back-btn" aria-label="Back">
			←
		</a>
		<div>
			<h1 class="text-3xl font-bold">Routine Templates</h1>
			<p class="text-gray-600">Save and reuse daily routines</p>
		</div>
	</header>

	{#if todayActivities.length > 0}
		<button onclick={() => showSaveDialog = true} class="btn-primary btn-large">
			Save Today as Template
		</button>
	{/if}

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<div class="templates-grid">
			{#each templates as template}
				<div class="template-card">
					<div class="template-header">
						<div>
							<h3 class="template-name">{template.name}</h3>
							{#if template.description}
								<p class="template-desc">{template.description}</p>
							{/if}
						</div>
						{#if template.isDefault}
							<span class="badge badge-default">Default</span>
						{/if}
					</div>

					<div class="template-meta">
						<span>{template.activities.length} activities</span>
						{#if template.timesUsed > 0}
							<span>Used {template.timesUsed}×</span>
						{/if}
					</div>

					{#if template.tags && template.tags.length > 0}
						<div class="tags">
							{#each template.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					{/if}

					<div class="template-actions">
						<button onclick={() => applyTemplate(template.id!)} class="btn-primary">
							Apply to Today
						</button>
						{#if !template.isDefault}
							<button onclick={() => deleteTemplate(template.id!)} class="btn-text">
								Delete
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

{#if showSaveDialog}
	<div class="modal-backdrop" onclick={() => showSaveDialog = false}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h2 class="modal-title">Save as Template</h2>
			<input
				type="text"
				bind:value={newTemplateName}
				placeholder="Template name..."
				class="input"
				autofocus
			/>
			<div class="modal-actions">
				<button onclick={() => showSaveDialog = false} class="btn-secondary">
					Cancel
				</button>
				<button
					onclick={() => { saveCurrentAsTemplate(newTemplateName); showSaveDialog = false; newTemplateName = ''; }}
					disabled={!newTemplateName.trim()}
					class="btn-primary"
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.back-btn {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f3f4f6;
		border-radius: 50%;
		text-decoration: none;
		font-size: 1.5rem;
		color: #374151;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.templates-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}

	.template-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.template-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.template-name {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.template-desc {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.template-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		background: #f3f4f6;
		color: #6b7280;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge-default {
		background: #14b8a6;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.template-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
	}

	.btn-primary, .btn-secondary, .btn-text {
		min-height: 44px;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		flex: 1;
	}

	.btn-large {
		width: 100%;
		margin-bottom: 2rem;
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

	.btn-text {
		background: none;
		color: #ef4444;
		flex: 0;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.modal {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		max-width: 400px;
		width: 90%;
	}

	.modal-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.modal-actions {
		display: flex;
		gap: 0.5rem;
	}
</style>
