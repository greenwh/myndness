<!-- src/lib/components/taskBreakdown/TaskBreakdownForm.svelte -->
<!-- Multi-step form for creating task breakdowns - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { TaskBreakdown, TaskBreakdownStep } from '$lib/db/types';
	import ProgressSteps from '$lib/components/common/ProgressSteps.svelte';

	interface Props {
		existingId?: number;
	}

	let { existingId }: Props = $props();

	// Form state
	let currentStep = $state(1);
	let taskName = $state('');
	let description = $state('');
	let steps = $state<TaskBreakdownStep[]>([]);
	let saveAsTemplate = $state(false);
	let templateCategory = $state('household');
	let savedId = $state<number | undefined>(existingId);
	let saving = $state(false);
	let lastSaved = $state<Date | null>(null);

	// Step input for adding new steps
	let newStepDescription = $state('');
	let newStepDuration = $state<number | undefined>(undefined);
	let editingStepIndex = $state<number | undefined>(undefined);

	const stepLabels = ['Define Task', 'Add Steps', 'Review'];
	const totalSteps = 3;

	// Auto-save debounce
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Load existing or check for draft
	onMount(async () => {
		if (existingId) {
			const existing = await db.taskBreakdowns.get(existingId);
			if (existing) {
				taskName = existing.taskName;
				description = existing.description || '';
				steps = existing.steps;
				currentStep = existing.status === 'draft' ? 2 : 3;
				savedId = existingId;
			}
		} else {
			// Check for recent draft
			const drafts = await db.taskBreakdowns
				.where('status')
				.equals('draft')
				.reverse()
				.sortBy('createdAt');

			if (drafts.length > 0) {
				const recent = drafts[0];
				const age = Date.now() - new Date(recent.createdAt).getTime();
				if (age < 24 * 60 * 60 * 1000) {
					// Less than 24h old
					taskName = recent.taskName;
					description = recent.description || '';
					steps = recent.steps;
					currentStep = 2;
					savedId = recent.id;
				}
			}
		}
	});

	// Auto-save function
	async function autoSave() {
		if (!taskName.trim()) return;

		saving = true;
		try {
			const breakdown: Omit<TaskBreakdown, 'id'> = {
				createdAt: new Date().toISOString(),
				taskName: taskName.trim(),
				description: description.trim() || undefined,
				steps: [...steps], // Spread to avoid proxy issues
				status: 'draft',
				currentStepIndex: 0,
				isTemplate: false,
				timesUsed: 0
			};

			if (savedId) {
				await db.taskBreakdowns.update(savedId, breakdown);
			} else {
				savedId = await db.taskBreakdowns.add(breakdown);
			}

			lastSaved = new Date();
		} catch (error) {
			console.error('Auto-save failed:', error);
		} finally {
			saving = false;
		}
	}

	// Debounced auto-save
	function scheduleAutoSave() {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(autoSave, 500);
	}

	// Watch for changes to trigger auto-save
	$effect(() => {
		if (taskName || description) {
			scheduleAutoSave();
		}
	});

	// Add step
	function addStep() {
		if (!newStepDescription.trim()) return;

		const newStep: TaskBreakdownStep = {
			order: steps.length,
			description: newStepDescription.trim(),
			estimatedDuration: newStepDuration,
			completed: false
		};

		steps = [...steps, newStep];
		newStepDescription = '';
		newStepDuration = undefined;
		scheduleAutoSave();
	}

	// Remove step
	function removeStep(index: number) {
		steps = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
		scheduleAutoSave();
	}

	// Move step up/down
	function moveStep(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index === 0) return;
		if (direction === 'down' && index === steps.length - 1) return;

		const newIndex = direction === 'up' ? index - 1 : index + 1;
		const newSteps = [...steps];
		[newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
		steps = newSteps.map((s, i) => ({ ...s, order: i }));
		scheduleAutoSave();
	}

	// Navigate steps
	function nextStep() {
		if (currentStep === 1 && !taskName.trim()) {
			alert('Please enter a task name');
			return;
		}
		if (currentStep === 2 && steps.length === 0) {
			alert('Please add at least one step');
			return;
		}
		if (currentStep < totalSteps) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	// Final save
	async function handleSave() {
		if (!savedId) {
			alert('Draft not found. Please try again.');
			return;
		}

		saving = true;
		try {
			const updates: Partial<TaskBreakdown> = {
				status: 'ready',
				isTemplate: saveAsTemplate,
				templateCategory: saveAsTemplate ? templateCategory : undefined
			};

			await db.taskBreakdowns.update(savedId, updates);
			goto(`${base}/tools/breakdown/${savedId}`);
		} catch (error) {
			console.error('Save failed:', error);
			alert('Failed to save. Please try again.');
		} finally {
			saving = false;
		}
	}

	// Cancel
	function handleCancel() {
		if (savedId) {
			// Delete draft
			db.taskBreakdowns.delete(savedId);
		}
		goto(`${base}/tools/breakdown`);
	}
</script>

<div class="max-w-3xl mx-auto p-4">
	<!-- Progress indicator -->
	<ProgressSteps {currentStep} {totalSteps} labels={stepLabels} />

	<!-- Auto-save indicator -->
	{#if lastSaved}
		<p class="text-xs text-gray-500 text-center mt-2">
			{saving ? 'Saving...' : `Saved at ${lastSaved.toLocaleTimeString()}`}
		</p>
	{/if}

	<!-- Step 1: Define Task -->
	{#if currentStep === 1}
		<div class="form-section">
			<h2 class="text-2xl font-bold mb-6">What task needs breaking down?</h2>

			<div class="mb-6">
				<label for="task-name" class="form-label">Task Name</label>
				<input
					id="task-name"
					type="text"
					bind:value={taskName}
					placeholder="e.g., Clean the kitchen"
					maxlength="100"
					class="input"
					autofocus
				/>
				<div class="char-count">{taskName.length}/100</div>
			</div>

			<div class="mb-6">
				<label for="description" class="form-label">
					Description (optional)
				</label>
				<textarea
					id="description"
					bind:value={description}
					placeholder="Any context or details..."
					maxlength="200"
					rows="3"
					class="textarea"
				></textarea>
				<div class="char-count">{description.length}/200</div>
			</div>
		</div>
	{/if}

	<!-- Step 2: Add Steps -->
	{#if currentStep === 2}
		<div class="form-section">
			<h2 class="text-2xl font-bold mb-2">Break "{taskName}" into steps</h2>
			<p class="text-gray-600 mb-6">Add specific, actionable steps in order</p>

			<!-- Existing steps -->
			{#if steps.length > 0}
				<div class="space-y-2 mb-6">
					{#each steps as step, index (step.order)}
						<div class="card p-4 flex items-start gap-3">
							<span class="text-lg font-bold text-gray-400 min-w-[2rem]">{index + 1}.</span>
							<div class="flex-1 min-w-0">
								<p class="font-medium">{step.description}</p>
								{#if step.estimatedDuration}
									<p class="text-sm text-gray-500">{step.estimatedDuration} min</p>
								{/if}
							</div>
							<div class="flex gap-1">
								<button
									type="button"
									onclick={() => moveStep(index, 'up')}
									disabled={index === 0}
									class="btn-icon text-gray-400 hover:text-gray-600"
									aria-label="Move up"
								>
									↑
								</button>
								<button
									type="button"
									onclick={() => moveStep(index, 'down')}
									disabled={index === steps.length - 1}
									class="btn-icon text-gray-400 hover:text-gray-600"
									aria-label="Move down"
								>
									↓
								</button>
								<button
									type="button"
									onclick={() => removeStep(index)}
									class="btn-icon text-red-400 hover:text-red-600"
									aria-label="Remove"
								>
									×
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Add new step -->
			<div class="card p-4 bg-teal-50 border-teal-200">
				<h3 class="font-semibold mb-3">Add Step {steps.length + 1}</h3>
				<div class="space-y-3">
					<div>
						<label for="step-desc" class="form-label">What to do</label>
						<input
							id="step-desc"
							type="text"
							bind:value={newStepDescription}
							placeholder="e.g., Clear dishes from counter"
							maxlength="100"
							class="input"
							onkeydown={(e) => e.key === 'Enter' && addStep()}
						/>
					</div>
					<div>
						<label for="step-duration" class="form-label">Estimated time (optional)</label>
						<input
							id="step-duration"
							type="number"
							bind:value={newStepDuration}
							placeholder="Minutes"
							min="1"
							max="180"
							class="input"
						/>
					</div>
					<button
						type="button"
						onclick={addStep}
						disabled={!newStepDescription.trim()}
						class="btn-primary w-full"
					>
						Add Step
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Step 3: Review -->
	{#if currentStep === 3}
		<div class="form-section">
			<h2 class="text-2xl font-bold mb-2">Review your breakdown</h2>
			<p class="text-gray-600 mb-6">
				{steps.length} step{steps.length !== 1 ? 's' : ''} for "{taskName}"
			</p>

			<!-- Summary -->
			<div class="card p-4 mb-6">
				<h3 class="font-bold text-lg mb-3">{taskName}</h3>
				{#if description}
					<p class="text-gray-600 mb-4">{description}</p>
				{/if}

				<ol class="space-y-2">
					{#each steps as step, index}
						<li class="flex gap-3">
							<span class="font-bold text-teal-600">{index + 1}.</span>
							<div>
								<p>{step.description}</p>
								{#if step.estimatedDuration}
									<p class="text-sm text-gray-500">{step.estimatedDuration} minutes</p>
								{/if}
							</div>
						</li>
					{/each}
				</ol>

				{#if steps.some(s => s.estimatedDuration)}
					{@const totalTime = steps.reduce((sum, s) => sum + (s.estimatedDuration || 0), 0)}
					{#if totalTime > 0}
						<p class="mt-4 pt-4 border-t text-sm font-semibold">
							Total estimated time: {totalTime} minutes
						</p>
					{/if}
				{/if}
			</div>

			<!-- Save as template option -->
			<div class="card p-4 bg-gray-50 mb-6">
				<label class="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={saveAsTemplate}
						class="w-5 h-5 text-teal-600"
					/>
					<span class="font-medium">Save as reusable template</span>
				</label>

				{#if saveAsTemplate}
					<div class="mt-3">
						<label for="template-category" class="form-label">Category</label>
						<select id="template-category" bind:value={templateCategory} class="input">
							<option value="household">Household</option>
							<option value="communication">Communication</option>
							<option value="hygiene">Personal Care</option>
							<option value="work">Work/Study</option>
							<option value="errands">Errands</option>
							<option value="other">Other</option>
						</select>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Navigation buttons -->
	<div class="flex gap-3 mt-8">
		{#if currentStep === 1}
			<button type="button" onclick={handleCancel} class="btn-secondary flex-1">
				Cancel
			</button>
		{:else}
			<button type="button" onclick={prevStep} class="btn-secondary flex-1">
				Back
			</button>
		{/if}

		{#if currentStep < totalSteps}
			<button type="button" onclick={nextStep} class="btn-primary flex-1">
				Next
			</button>
		{:else}
			<button
				type="button"
				onclick={handleSave}
				disabled={saving}
				class="btn-primary flex-1"
			>
				{saving ? 'Saving...' : 'Start Task'}
			</button>
		{/if}
	</div>
</div>

<style>
	.form-section {
		margin: 2rem 0;
	}

	.form-label {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 1rem;
		min-height: 44px;
	}

	.input:focus {
		outline: none;
		border-color: #14b8a6;
	}

	.textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
		min-height: 44px;
	}

	.textarea:focus {
		outline: none;
		border-color: #14b8a6;
	}

	.char-count {
		text-align: right;
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
	}

	.btn-primary,
	.btn-secondary {
		min-height: 44px;
		padding: 0.75rem 1.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	.btn-primary {
		background-color: #14b8a6;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #0d9488;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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
		font-size: 1.25rem;
	}

	.btn-icon:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>
