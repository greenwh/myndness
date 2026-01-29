<!-- src/routes/tools/breakdown/+page.svelte -->
<!-- Task Breakdown Hub Page -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { TaskBreakdown } from '$lib/db/types';

	let inProgressTasks = $state<TaskBreakdown[]>([]);
	let templates = $state<TaskBreakdown[]>([]);
	let completedTasks = $state<TaskBreakdown[]>([]);
	let loading = $state(true);

	onMount(async () => {
		await loadData();
		await seedDefaultTemplates();
		loading = false;
	});

	async function loadData() {
		// In-progress tasks
		inProgressTasks = await db.taskBreakdowns
			.where('status')
			.equals('in-progress')
			.reverse()
			.sortBy('startedAt');

		// Templates
		templates = await db.taskBreakdowns
			.where('isTemplate')
			.equals(1)
			.reverse()
			.sortBy('timesUsed');

		// Completed (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const allCompleted = await db.taskBreakdowns
			.where('status')
			.equals('completed')
			.toArray();

		completedTasks = allCompleted
			.filter(t => t.completedAt && new Date(t.completedAt) >= thirtyDaysAgo)
			.sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
			.slice(0, 10);
	}

	async function seedDefaultTemplates() {
		const existingTemplates = await db.taskBreakdowns
			.where({ isTemplate: 1, isDefault: true })
			.count();

		if (existingTemplates > 0) return; // Already seeded

		const defaultTemplates: Omit<TaskBreakdown, 'id'>[] = [
			{
				createdAt: new Date().toISOString(),
				taskName: 'Clean the kitchen',
				description: 'Complete kitchen cleaning routine',
				steps: [
					{ order: 0, description: 'Clear dishes from counter and sink', estimatedDuration: 5, completed: false },
					{ order: 1, description: 'Load dishwasher or wash dishes', estimatedDuration: 10, completed: false },
					{ order: 2, description: 'Wipe down countertops', estimatedDuration: 5, completed: false },
					{ order: 3, description: 'Clean stovetop', estimatedDuration: 5, completed: false },
					{ order: 4, description: 'Sweep or vacuum floor', estimatedDuration: 5, completed: false },
					{ order: 5, description: 'Take out trash', estimatedDuration: 2, completed: false }
				],
				status: 'ready',
				currentStepIndex: 0,
				isTemplate: true,
				isDefault: true,
				templateCategory: 'household',
				timesUsed: 0
			},
			{
				createdAt: new Date().toISOString(),
				taskName: 'Do laundry',
				description: 'Complete laundry cycle',
				steps: [
					{ order: 0, description: 'Gather dirty clothes', estimatedDuration: 5, completed: false },
					{ order: 1, description: 'Sort by color/fabric', estimatedDuration: 3, completed: false },
					{ order: 2, description: 'Load washing machine', estimatedDuration: 3, completed: false },
					{ order: 3, description: 'Add detergent and start', estimatedDuration: 2, completed: false },
					{ order: 4, description: 'Transfer to dryer or hang', estimatedDuration: 5, completed: false }
				],
				status: 'ready',
				currentStepIndex: 0,
				isTemplate: true,
				isDefault: true,
				templateCategory: 'household',
				timesUsed: 0
			},
			{
				createdAt: new Date().toISOString(),
				taskName: 'Morning routine',
				description: 'Complete morning preparation',
				steps: [
					{ order: 0, description: 'Get out of bed', estimatedDuration: 1, completed: false },
					{ order: 1, description: 'Use bathroom', estimatedDuration: 5, completed: false },
					{ order: 2, description: 'Brush teeth', estimatedDuration: 3, completed: false },
					{ order: 3, description: 'Shower', estimatedDuration: 10, completed: false },
					{ order: 4, description: 'Get dressed', estimatedDuration: 5, completed: false },
					{ order: 5, description: 'Make coffee/breakfast', estimatedDuration: 10, completed: false },
					{ order: 6, description: 'Review day\'s plan', estimatedDuration: 5, completed: false }
				],
				status: 'ready',
				currentStepIndex: 0,
				isTemplate: true,
				isDefault: true,
				templateCategory: 'hygiene',
				timesUsed: 0
			},
			{
				createdAt: new Date().toISOString(),
				taskName: 'Write an email',
				description: 'Compose and send email',
				steps: [
					{ order: 0, description: 'Identify key points to communicate', estimatedDuration: 3, completed: false },
					{ order: 1, description: 'Write greeting and context', estimatedDuration: 3, completed: false },
					{ order: 2, description: 'Write main message body', estimatedDuration: 5, completed: false },
					{ order: 3, description: 'Add closing and signature', estimatedDuration: 2, completed: false },
					{ order: 4, description: 'Proofread for errors', estimatedDuration: 3, completed: false },
					{ order: 5, description: 'Send email', estimatedDuration: 1, completed: false }
				],
				status: 'ready',
				currentStepIndex: 0,
				isTemplate: true,
				isDefault: true,
				templateCategory: 'communication',
				timesUsed: 0
			}
		];

		for (const template of defaultTemplates) {
			await db.taskBreakdowns.add(template);
		}

		await loadData();
	}

	async function startFromTemplate(templateId: number) {
		const template = await db.taskBreakdowns.get(templateId);
		if (!template) return;

		// Create new instance from template
		const newBreakdown: Omit<TaskBreakdown, 'id'> = {
			createdAt: new Date().toISOString(),
			taskName: template.taskName,
			description: template.description,
			steps: template.steps.map(s => ({ ...s, completed: false, completedAt: undefined })),
			status: 'ready',
			currentStepIndex: 0,
			isTemplate: false,
			timesUsed: 0
		};

		const newId = await db.taskBreakdowns.add(newBreakdown);

		// Increment template usage
		await db.taskBreakdowns.update(templateId, {
			timesUsed: (template.timesUsed || 0) + 1
		});

		// Navigate to execution
		window.location.href = `${base}/tools/breakdown/${newId}`;
	}

	async function resumeTask(taskId: number) {
		window.location.href = `${base}/tools/breakdown/${taskId}`;
	}

	async function deleteTask(taskId: number) {
		if (!confirm('Delete this task?')) return;
		await db.taskBreakdowns.delete(taskId);
		await loadData();
	}

	function formatDate(isoString: string): string {
		return new Date(isoString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Task Breakdown - Myndness</title>
</svelte:head>

<main class="container">
	<div class="header">
		<h1 class="text-3xl font-bold">Task Breakdown</h1>
		<p class="text-gray-600">Break overwhelming tasks into manageable steps</p>
	</div>

	<!-- Quick action -->
	<a href="{base}/tools/breakdown/new" class="btn-primary btn-large">
		+ Start New Task
	</a>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<!-- In-progress tasks -->
		{#if inProgressTasks.length > 0}
			<section class="section">
				<h2 class="section-title">In Progress</h2>
				<div class="space-y-3">
					{#each inProgressTasks as task}
						<div class="card p-4">
							<div class="flex items-start justify-between gap-3">
								<div class="flex-1">
									<h3 class="font-semibold text-lg">{task.taskName}</h3>
									<p class="text-sm text-gray-600 mt-1">
										Step {task.currentStepIndex + 1} of {task.steps.length}
									</p>
									<div class="progress-bar-container mt-2">
										<div
											class="progress-bar"
											style="width: {Math.round((task.currentStepIndex / task.steps.length) * 100)}%"
										></div>
									</div>
								</div>
								<button
									onclick={() => resumeTask(task.id!)}
									class="btn-primary"
								>
									Resume
								</button>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Templates -->
		<section class="section">
			<h2 class="section-title">Templates</h2>
			{#if templates.length === 0}
				<p class="text-gray-500">No templates yet. Create a task and save it as a template.</p>
			{:else}
				<div class="grid gap-3">
					{#each templates as template}
						<div class="card p-4 hover:border-teal-300 transition-colors cursor-pointer"
							onclick={() => startFromTemplate(template.id!)}>
							<div class="flex items-start justify-between gap-3">
								<div class="flex-1">
									<h3 class="font-semibold">{template.taskName}</h3>
									{#if template.description}
										<p class="text-sm text-gray-600 mt-1">{template.description}</p>
									{/if}
									<div class="flex gap-3 mt-2 text-xs text-gray-500">
										<span>{template.steps.length} steps</span>
										{#if template.timesUsed > 0}
											<span>Used {template.timesUsed}× </span>
										{/if}
										{#if template.templateCategory}
											<span class="badge bg-gray-100 text-gray-700">
												{template.templateCategory}
											</span>
										{/if}
									</div>
								</div>
								<button
									onclick={(e) => { e.stopPropagation(); startFromTemplate(template.id!); }}
									class="btn-secondary"
								>
									Use
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Recent completed -->
		{#if completedTasks.length > 0}
			<section class="section">
				<h2 class="section-title">Recently Completed</h2>
				<div class="space-y-2">
					{#each completedTasks as task}
						<div class="card p-3 bg-green-50 border-green-200">
							<div class="flex items-center justify-between gap-3">
								<div class="flex-1">
									<h3 class="font-medium">{task.taskName}</h3>
									<p class="text-xs text-gray-500 mt-1">
										{task.completedAt ? formatDate(task.completedAt) : ''}
									</p>
								</div>
								<button
									onclick={() => deleteTask(task.id!)}
									class="btn-icon text-gray-400 hover:text-red-500"
									aria-label="Delete"
								>
									×
								</button>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.section {
		margin-top: 3rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: #6b7280;
	}

	.card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
	}

	.space-y-2 > * + * {
		margin-top: 0.5rem;
	}

	.space-y-3 > * + * {
		margin-top: 0.75rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
	}

	.gap-3 {
		gap: 0.75rem;
	}

	.progress-bar-container {
		width: 100%;
		height: 6px;
		background: #e5e7eb;
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: #14b8a6;
		transition: width 0.3s ease;
	}

	.badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
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
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn-large {
		width: 100%;
		font-size: 1.125rem;
		min-height: 52px;
		margin-bottom: 2rem;
	}

	.btn-primary {
		background-color: #14b8a6;
		color: white;
	}

	.btn-primary:hover {
		background-color: #0d9488;
	}

	.btn-secondary {
		background-color: white;
		color: #374151;
		border: 2px solid #d1d5db;
	}

	.btn-secondary:hover {
		background-color: #f3f4f6;
	}

	.btn-icon {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 1.5rem;
	}
</style>
