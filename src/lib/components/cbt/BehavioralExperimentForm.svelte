<script lang="ts">
	/**
	 * BehavioralExperimentForm - 4-step experiment creation with auto-save
	 *
	 * Features:
	 * - Multi-step state machine (4 steps)
	 * - Auto-save with 500ms debounce
	 * - Draft resume if < 24 hours old
	 * - Validation per step
	 * - Exit always available
	 * - ADHD-friendly (one task per screen)
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { BehavioralExperiment, PlannedActivity } from '$lib/db/types';

	import ProgressSteps from '$lib/components/common/ProgressSteps.svelte';
	import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';
	import IntensitySlider from '$lib/components/common/IntensitySlider.svelte';

	interface Props {
		editId?: number;
	}

	let { editId }: Props = $props();

	// State machine
	let currentStep = $state(1);
	const totalSteps = 4;

	// Form data
	let formData = $state({
		belief: '',
		beliefStrength: 50,
		experiment: '',
		prediction: '',
		predictionConfidence: 50,
		plannedDate: '',
		linkedActivityId: undefined as number | undefined
	});

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let currentEntryId = $state<number | undefined>(editId);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Draft prompt
	let showDraftPrompt = $state(false);
	let draftEntry = $state<BehavioralExperiment | null>(null);

	// Planned activities for linking
	let plannedActivities = $state<PlannedActivity[]>([]);

	// Step labels
	const stepLabels = ['Belief', 'Experiment', 'Prediction', 'Schedule'];

	// Validation per step
	function validateCurrentStep(): boolean {
		switch (currentStep) {
			case 1:
				return formData.belief.trim().length > 0;
			case 2:
				return formData.experiment.trim().length > 0;
			case 3:
				return formData.prediction.trim().length > 0;
			case 4:
				return true; // Step 4 is optional
			default:
				return false;
		}
	}

	// Debounced auto-save
	function scheduleAutoSave() {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		saveStatus = 'saving';

		saveTimeout = setTimeout(async () => {
			await saveEntry();
		}, 500);
	}

	// Save entry to IndexedDB
	async function saveEntry() {
		if (!browser) return;

		try {
			const now = new Date();
			const entry: Omit<BehavioralExperiment, 'id'> = {
				date: now.toISOString().split('T')[0],
				createdAt: now.toISOString(),
				belief: formData.belief || '',
				beliefStrength: formData.beliefStrength,
				experiment: formData.experiment || '',
				prediction: formData.prediction || '',
				predictionConfidence: formData.predictionConfidence,
				plannedDate: formData.plannedDate || undefined,
				linkedActivityId: formData.linkedActivityId,
				completed: false
			};

			if (currentEntryId) {
				await db.behavioralExperiments.update(currentEntryId, entry);
			} else {
				currentEntryId = await db.behavioralExperiments.add(entry as BehavioralExperiment);
			}

			saveStatus = 'saved';

			setTimeout(() => {
				if (saveStatus === 'saved') {
					saveStatus = 'idle';
				}
			}, 2000);
		} catch (error) {
			console.error('Failed to save behavioral experiment:', error);
			saveStatus = 'error';
		}
	}

	// Navigation
	function nextStep() {
		if (currentStep < totalSteps && validateCurrentStep()) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	async function submitAndExit() {
		if (validateCurrentStep()) {
			await saveEntry();
			goto(`${base}/tools/cbt/experiment`);
		}
	}

	function exitWithoutCompleting() {
		// Auto-save already handled, just navigate away
		goto(`${base}/tools/cbt/experiment`);
	}

	async function resumeDraft() {
		if (draftEntry) {
			currentEntryId = draftEntry.id;
			formData.belief = draftEntry.belief;
			formData.beliefStrength = draftEntry.beliefStrength;
			formData.experiment = draftEntry.experiment;
			formData.prediction = draftEntry.prediction;
			formData.predictionConfidence = draftEntry.predictionConfidence;
			formData.plannedDate = draftEntry.plannedDate || '';
			formData.linkedActivityId = draftEntry.linkedActivityId;
		}
		showDraftPrompt = false;
	}

	function startFresh() {
		showDraftPrompt = false;
		draftEntry = null;
		currentEntryId = undefined;
	}

	// Load planned activities for step 4
	async function loadPlannedActivities() {
		if (!browser) return;

		try {
			const today = new Date().toISOString().split('T')[0];
			const activities = await db.plannedActivities.where('date').equals(today).toArray();
			plannedActivities = activities;
		} catch (error) {
			console.error('Failed to load planned activities:', error);
		}
	}

	// Check for draft on mount
	onMount(async () => {
		if (!browser) return;

		// Load planned activities for step 4
		await loadPlannedActivities();

		// If editing existing entry, load it
		if (editId) {
			const entry = await db.behavioralExperiments.get(editId);
			if (entry) {
				formData.belief = entry.belief;
				formData.beliefStrength = entry.beliefStrength;
				formData.experiment = entry.experiment;
				formData.prediction = entry.prediction;
				formData.predictionConfidence = entry.predictionConfidence;
				formData.plannedDate = entry.plannedDate || '';
				formData.linkedActivityId = entry.linkedActivityId;
			}
			return;
		}

		// Check for recent incomplete experiments
		const incompleteExperiments = await db.behavioralExperiments
			.where('completed')
			.equals(0)
			.toArray();

		const recentDraft = incompleteExperiments.find((exp) => {
			const createdDate = new Date(exp.createdAt);
			const hoursSince = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
			return hoursSince < 24;
		});

		if (recentDraft) {
			draftEntry = recentDraft;
			showDraftPrompt = true;
		}
	});

	// Derived validations
	const step1Valid = $derived(formData.belief.trim().length > 0);
	const step2Valid = $derived(formData.experiment.trim().length > 0);
	const step3Valid = $derived(formData.prediction.trim().length > 0);
	const canProceed = $derived(validateCurrentStep());
</script>

<!-- Draft resume prompt -->
{#if showDraftPrompt && draftEntry}
	<div class="draft-prompt-overlay">
		<div class="draft-prompt-card">
			<h2 class="draft-prompt-title">Resume Your Experiment?</h2>
			<p class="draft-prompt-text">
				You have an incomplete experiment from {new Date(draftEntry.createdAt).toLocaleString()}.
			</p>
			<div class="draft-prompt-preview">
				<strong>Belief:</strong>
				{draftEntry.belief.slice(0, 80)}{draftEntry.belief.length > 80 ? '...' : ''}
			</div>
			<div class="draft-prompt-actions">
				<button class="btn-secondary" onclick={startFresh}>Start Fresh</button>
				<button class="btn-primary" onclick={resumeDraft}>Resume</button>
			</div>
		</div>
	</div>
{/if}

<div class="form-container">
	<!-- Header -->
	<div class="form-header">
		<button class="back-button" onclick={exitWithoutCompleting} aria-label="Exit form">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
		<h1 class="form-title">
			{editId ? 'Edit Experiment' : 'New Behavioral Experiment'}
		</h1>
		<div class="save-indicator">
			{#if saveStatus === 'saving'}
				<span class="save-status saving">Saving...</span>
			{:else if saveStatus === 'saved'}
				<span class="save-status saved">Saved ✓</span>
			{:else if saveStatus === 'error'}
				<span class="save-status error">Error</span>
			{/if}
		</div>
	</div>

	<!-- Progress -->
	<ProgressSteps {currentStep} {totalSteps} {stepLabels} />

	<!-- Step 1: Identify Belief -->
	{#if currentStep === 1}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">What belief do you want to test?</h2>
				<p class="step-description">
					Choose a specific belief that causes you anxiety or distress. Make it concrete and
					testable.
				</p>
			</div>

			<CharacterCounter
				bind:value={formData.belief}
				maxLength={300}
				rows={4}
				placeholder="e.g., If I call my doctor, I'll sound stupid"
				label="Belief to Test"
				id="belief"
				required={true}
				oninput={scheduleAutoSave}
			/>

			<IntensitySlider
				bind:value={formData.beliefStrength}
				label="How strongly do you believe this?"
				lowLabel="Not at all"
				highLabel="Completely"
				id="beliefStrength"
				onchange={scheduleAutoSave}
			/>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={exitWithoutCompleting}>Exit</button>
			<button class="btn-primary" disabled={!step1Valid} onclick={nextStep}>Next</button>
		</div>
	{/if}

	<!-- Step 2: Design Experiment -->
	{#if currentStep === 2}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">What will you do to test this belief?</h2>
				<p class="step-description">
					Describe a specific action you can take to gather evidence about whether your belief is
					accurate.
				</p>
			</div>

			<CharacterCounter
				bind:value={formData.experiment}
				maxLength={300}
				rows={4}
				placeholder="e.g., Call my doctor's office to schedule an appointment"
				label="Your Experiment"
				id="experiment"
				required={true}
				oninput={scheduleAutoSave}
			/>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={prevStep}>Back</button>
			<button class="btn-primary" disabled={!step2Valid} onclick={nextStep}>Next</button>
		</div>
	{/if}

	<!-- Step 3: Make Prediction -->
	{#if currentStep === 3}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">What do you predict will happen?</h2>
				<p class="step-description">
					Based on your belief, what outcome do you expect? Be specific so you can compare this with
					reality later.
				</p>
			</div>

			<CharacterCounter
				bind:value={formData.prediction}
				maxLength={300}
				rows={4}
				placeholder="e.g., The receptionist will think I'm confused and I'll stumble over my words"
				label="Your Prediction"
				id="prediction"
				required={true}
				oninput={scheduleAutoSave}
			/>

			<IntensitySlider
				bind:value={formData.predictionConfidence}
				label="How confident are you in this prediction?"
				lowLabel="Not sure"
				highLabel="Very sure"
				id="predictionConfidence"
				onchange={scheduleAutoSave}
			/>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={prevStep}>Back</button>
			<button class="btn-primary" disabled={!step3Valid} onclick={nextStep}>Next</button>
		</div>
	{/if}

	<!-- Step 4: Schedule (Optional) -->
	{#if currentStep === 4}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">When will you do this? (Optional)</h2>
				<p class="step-description">
					Set a date to help you follow through, or skip this if you plan to do it soon.
				</p>
			</div>

			<div class="form-field">
				<label for="plannedDate" class="field-label">Planned Date</label>
				<input
					type="date"
					id="plannedDate"
					bind:value={formData.plannedDate}
					oninput={scheduleAutoSave}
					class="date-input"
				/>
			</div>

			{#if plannedActivities.length > 0}
				<div class="form-field">
					<label for="linkedActivity" class="field-label">
						Link to Planned Activity (Optional)
					</label>
					<select
						id="linkedActivity"
						bind:value={formData.linkedActivityId}
						onchange={scheduleAutoSave}
						class="select-input"
					>
						<option value={undefined}>None</option>
						{#each plannedActivities as activity}
							<option value={activity.id}>
								{activity.activityName}
							</option>
						{/each}
					</select>
					<p class="field-hint">
						If this experiment is part of a planned activity, you can link them together.
					</p>
				</div>
			{/if}
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={prevStep}>Back</button>
			<button class="btn-primary" onclick={submitAndExit}>Save & Exit</button>
		</div>
	{/if}
</div>

<style>
	/* Draft prompt overlay */
	.draft-prompt-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		padding: 1rem;
	}

	.draft-prompt-card {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.draft-prompt-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
		margin-bottom: 0.75rem;
	}

	.draft-prompt-text {
		font-size: 1rem;
		color: #52525b;
		margin-bottom: 1rem;
	}

	.draft-prompt-preview {
		background: #f4f4f5;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: #1a1a2e;
	}

	.draft-prompt-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	/* Form container */
	.form-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	/* Header */
	.form-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		position: relative;
	}

	.back-button {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: white;
		border: 2px solid #e4e4e7;
		color: #52525b;
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.back-button:hover {
		background: #f4f4f5;
		border-color: #d4d4d8;
	}

	.back-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.form-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
		flex: 1;
	}

	.save-indicator {
		min-width: 80px;
		text-align: right;
	}

	.save-status {
		font-size: 0.875rem;
		font-weight: 500;
	}

	.save-status.saving {
		color: #f59e0b;
	}

	.save-status.saved {
		color: #22c55e;
	}

	.save-status.error {
		color: #ef4444;
	}

	/* Step content */
	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.step-intro {
		margin-bottom: 1rem;
	}

	.step-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.step-description {
		font-size: 1rem;
		color: #52525b;
		line-height: 1.6;
	}

	/* Form fields */
	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-label {
		font-size: 1rem;
		font-weight: 500;
		color: #1a1a2e;
	}

	.date-input,
	.select-input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		min-height: 44px;
		font-family: inherit;
		transition: border-color 0.2s ease;
	}

	.date-input:focus,
	.select-input:focus {
		outline: none;
		border-color: #7c3aed;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.field-hint {
		font-size: 0.875rem;
		color: #52525b;
		line-height: 1.4;
	}

	/* Step actions */
	.step-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e4e4e7;
	}

	/* Buttons */
	.btn-primary,
	.btn-secondary {
		min-width: 44px;
		min-height: 44px;
		padding: 0 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 2px solid transparent;
	}

	.btn-primary {
		background: #7c3aed;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #6d28d9;
		box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		color: #52525b;
		border-color: #e4e4e7;
	}

	.btn-secondary:hover {
		background: #f4f4f5;
		border-color: #d4d4d8;
	}

	.btn-primary:focus,
	.btn-secondary:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.back-button,
		.btn-primary,
		.btn-secondary,
		.date-input,
		.select-input {
			transition: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.form-container {
			padding: 0.5rem;
		}

		.form-title {
			font-size: 1.25rem;
		}

		.step-actions {
			flex-direction: column;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
		}
	}
</style>
