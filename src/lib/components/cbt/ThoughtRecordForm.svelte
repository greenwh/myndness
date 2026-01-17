<script lang="ts">
	/**
	 * ThoughtRecordForm - 7-step thought record with auto-save
	 *
	 * Features:
	 * - Multi-step state machine (7 steps)
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
	import type { ThoughtRecord, EmotionType, CognitiveDistortion } from '$lib/db/types';

	import ProgressSteps from '$lib/components/common/ProgressSteps.svelte';
	import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';
	import EmotionSelect from '$lib/components/common/EmotionSelect.svelte';
	import DistortionChecklist from '$lib/components/common/DistortionChecklist.svelte';
	import IntensitySlider from '$lib/components/common/IntensitySlider.svelte';

	interface Props {
		editId?: number;
	}

	let { editId }: Props = $props();

	// State machine
	let currentStep = $state(1);
	const totalSteps = 7;

	// Form data
	let formData = $state<Partial<ThoughtRecord>>({
		situation: '',
		automaticThought: '',
		emotion: 'anxious',
		emotionOther: undefined,
		emotionIntensity: 50,
		distortions: [],
		evidenceFor: '',
		evidenceAgainst: '',
		balancedThought: '',
		outcomeEmotion: undefined,
		outcomeIntensity: 50,
		isComplete: false
	});

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let currentEntryId = $state<number | undefined>(undefined);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Draft prompt
	let showDraftPrompt = $state(false);
	let draftEntry: ThoughtRecord | null = null;

	// Step labels
	const stepLabels = [
		'Situation',
		'Thought',
		'Emotion',
		'Distortions',
		'Evidence',
		'Balance',
		'Outcome'
	];

	// Validation per step
	function validateCurrentStep(): boolean {
		switch (currentStep) {
			case 1:
				return formData.situation.trim().length > 0;
			case 2:
				return formData.automaticThought.trim().length > 0;
			case 3:
				return formData.emotionIntensity >= 0 &&
				       (formData.emotion !== 'other' || (formData.emotionOther?.trim().length || 0) > 0);
			case 4:
				return formData.distortions.length > 0;
			case 5:
				return formData.evidenceFor.trim().length > 0 &&
				       formData.evidenceAgainst.trim().length > 0;
			case 6:
				return formData.balancedThought.trim().length > 0;
			case 7:
				return formData.outcomeIntensity >= 0;
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
			const entry: Omit<ThoughtRecord, 'id'> = {
				date: now.toISOString().split('T')[0],
				timestamp: now.toISOString(),
				situation: formData.situation,
				automaticThought: formData.automaticThought,
				emotion: formData.emotion || 'anxious',
				emotionOther: formData.emotionOther,
				emotionIntensity: formData.emotionIntensity || 50,
				distortions: formData.distortions || [],
				evidenceFor: formData.evidenceFor || '',
				evidenceAgainst: formData.evidenceAgainst || '',
				balancedThought: formData.balancedThought || '',
				outcomeEmotion: formData.outcomeEmotion,
				outcomeIntensity: formData.outcomeIntensity || 50,
				isComplete: formData.isComplete || false,
				theme: formData.theme,
				notes: formData.notes
			};

			if (currentEntryId) {
				await db.thoughtRecords.update(currentEntryId, entry);
			} else {
				currentEntryId = await db.thoughtRecords.add(entry as ThoughtRecord);
			}

			saveStatus = 'saved';

			setTimeout(() => {
				if (saveStatus === 'saved') {
					saveStatus = 'idle';
				}
			}, 2000);
		} catch (error) {
			console.error('Failed to save thought record:', error);
			saveStatus = 'error';
		}
	}

	// Handle field changes
	function handleFieldChange() {
		scheduleAutoSave();
	}

	function handleEmotionChange(emotion: EmotionType, emotionOther: string | undefined, intensity: number) {
		formData.emotion = emotion;
		formData.emotionOther = emotionOther;
		formData.emotionIntensity = intensity;
		scheduleAutoSave();
	}

	function handleDistortionsChange(distortions: CognitiveDistortion[]) {
		formData.distortions = distortions;
		scheduleAutoSave();
	}

	function handleOutcomeIntensityChange(intensity: number) {
		formData.outcomeIntensity = intensity;
		scheduleAutoSave();
	}

	// Navigation
	function handleNext() {
		if (!validateCurrentStep()) {
			return;
		}

		if (currentStep < totalSteps) {
			currentStep++;
		} else {
			handleComplete();
		}
	}

	function handleBack() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	async function handleComplete() {
		formData.isComplete = true;
		await saveEntry();
		goto(`${base}/tools/cbt/history?new=true`);
	}

	async function handleExit() {
		await saveEntry();
		goto(`${base}/tools/cbt`);
	}

	function loadDraft() {
		if (draftEntry) {
			formData = {
				situation: draftEntry.situation,
				automaticThought: draftEntry.automaticThought,
				emotion: draftEntry.emotion,
				emotionOther: draftEntry.emotionOther,
				emotionIntensity: draftEntry.emotionIntensity,
				distortions: draftEntry.distortions,
				evidenceFor: draftEntry.evidenceFor,
				evidenceAgainst: draftEntry.evidenceAgainst,
				balancedThought: draftEntry.balancedThought,
				outcomeEmotion: draftEntry.outcomeEmotion,
				outcomeIntensity: draftEntry.outcomeIntensity,
				isComplete: false
			};
			currentEntryId = draftEntry.id;

			// Find first incomplete step
			if (!formData.situation) currentStep = 1;
			else if (!formData.automaticThought) currentStep = 2;
			else if (formData.emotionIntensity === undefined) currentStep = 3;
			else if (formData.distortions.length === 0) currentStep = 4;
			else if (!formData.evidenceFor || !formData.evidenceAgainst) currentStep = 5;
			else if (!formData.balancedThought) currentStep = 6;
			else currentStep = 7;
		}
		showDraftPrompt = false;
	}

	function startFresh() {
		showDraftPrompt = false;
		draftEntry = null;
	}

	// Load draft on mount
	onMount(async () => {
		if (!browser) return;

		// If editing existing, load it
		if (editId) {
			const existing = await db.thoughtRecords.get(editId);
			if (existing) {
				formData = existing;
				currentEntryId = existing.id;

				// Find first incomplete step if not complete
				if (!existing.isComplete) {
					if (!formData.situation) currentStep = 1;
					else if (!formData.automaticThought) currentStep = 2;
					else if (formData.emotionIntensity === undefined) currentStep = 3;
					else if (formData.distortions.length === 0) currentStep = 4;
					else if (!formData.evidenceFor || !formData.evidenceAgainst) currentStep = 5;
					else if (!formData.balancedThought) currentStep = 6;
					else currentStep = 7;
				}
			}
			return;
		}

		// Check for recent drafts
		const today = new Date().toISOString().split('T')[0];
		const incompleteRecords = await db.thoughtRecords
			.where('isComplete')
			.equals(0)
			.toArray();

		if (incompleteRecords.length > 0) {
			// Find most recent draft from today
			const todayDrafts = incompleteRecords.filter(r => r.date === today);

			if (todayDrafts.length > 0) {
				const latest = todayDrafts.sort((a, b) =>
					b.timestamp.localeCompare(a.timestamp)
				)[0];

				// Only show prompt if draft is < 24 hours old
				const draftTime = new Date(latest.timestamp).getTime();
				const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

				if (draftTime > twentyFourHoursAgo) {
					draftEntry = latest;
					showDraftPrompt = true;
				}
			}
		}
	});
</script>

<!-- Draft prompt overlay -->
{#if showDraftPrompt}
	<div class="draft-overlay">
		<div class="draft-dialog">
			<h2 class="draft-title">Continue previous thought record?</h2>
			<p class="draft-message">
				You have an incomplete thought record from earlier. Would you like to continue where you left off?
			</p>
			<div class="draft-actions">
				<button onclick={loadDraft} class="btn-primary">
					Continue Draft
				</button>
				<button onclick={startFresh} class="btn-secondary">
					Start Fresh
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="thought-record-form">
	<!-- Header -->
	<div class="form-header">
		<h1 class="form-title">Thought Record</h1>
		<div class="save-status">
			{#if saveStatus === 'saving'}
				<span class="status-saving">Saving...</span>
			{:else if saveStatus === 'saved'}
				<span class="status-saved">✓ Saved</span>
			{:else if saveStatus === 'error'}
				<span class="status-error">⚠ Error saving</span>
			{/if}
		</div>
	</div>

	<!-- Progress -->
	<ProgressSteps {currentStep} {totalSteps} {stepLabels} />

	<!-- Steps -->
	<div class="form-content">
		{#if currentStep === 1}
			<!-- Step 1: Situation -->
			<div class="step-card">
				<h2 class="step-heading">What happened?</h2>
				<p class="step-description">
					Describe the situation that triggered this thought. Be specific: where were you, what was happening?
				</p>
				<CharacterCounter
					bind:value={formData.situation}
					maxLength={200}
					rows={3}
					placeholder="Example: My daughter didn't answer when I called her this morning..."
					label="Situation"
					id="situation-input"
					required
					oninput={handleFieldChange}
				/>
			</div>

		{:else if currentStep === 2}
			<!-- Step 2: Automatic Thought -->
			<div class="step-card">
				<h2 class="step-heading">What went through your mind?</h2>
				<p class="step-description">
					What thought popped into your head? Try to capture it exactly as it occurred.
				</p>
				<CharacterCounter
					bind:value={formData.automaticThought}
					maxLength={500}
					rows={4}
					placeholder="Example: Something terrible must have happened to her..."
					label="Automatic thought"
					id="thought-input"
					required
					oninput={handleFieldChange}
				/>
			</div>

		{:else if currentStep === 3}
			<!-- Step 3: Emotion + Intensity -->
			<div class="step-card">
				<h2 class="step-heading">How did you feel?</h2>
				<p class="step-description">
					Identify the emotion and rate how intense it was at the time.
				</p>
				<EmotionSelect
					bind:emotion={formData.emotion}
					bind:emotionOther={formData.emotionOther}
					bind:intensity={formData.emotionIntensity}
					label="What emotion did you feel?"
					intensityLabel="How intense was this feeling?"
					onchange={handleEmotionChange}
				/>
			</div>

		{:else if currentStep === 4}
			<!-- Step 4: Distortions -->
			<div class="step-card">
				<h2 class="step-heading">What thinking traps are present?</h2>
				<p class="step-description">
					Look for patterns in your thinking. Select all that apply.
				</p>
				<DistortionChecklist
					bind:selected={formData.distortions}
					onchange={handleDistortionsChange}
					showLearnMore={true}
				/>
			</div>

		{:else if currentStep === 5}
			<!-- Step 5: Evidence -->
			<div class="step-card">
				<h2 class="step-heading">What's the evidence?</h2>
				<p class="step-description">
					Look at the facts objectively. What supports this thought? What goes against it?
				</p>

				<div class="evidence-section">
					<CharacterCounter
						bind:value={formData.evidenceFor}
						maxLength={500}
						rows={4}
						placeholder="Facts that support the thought..."
						label="Evidence FOR the thought"
						id="evidence-for-input"
						required
						oninput={handleFieldChange}
					/>
				</div>

				<div class="evidence-section">
					<CharacterCounter
						bind:value={formData.evidenceAgainst}
						maxLength={500}
						rows={4}
						placeholder="Facts that contradict the thought..."
						label="Evidence AGAINST the thought"
						id="evidence-against-input"
						required
						oninput={handleFieldChange}
					/>
				</div>
			</div>

		{:else if currentStep === 6}
			<!-- Step 6: Balanced Thought -->
			<div class="step-card">
				<h2 class="step-heading">What's a more balanced perspective?</h2>
				<p class="step-description">
					Based on the evidence, what's a more realistic way to view this situation?
				</p>
				<CharacterCounter
					bind:value={formData.balancedThought}
					maxLength={500}
					rows={4}
					placeholder="A more balanced thought might be..."
					label="Balanced thought"
					id="balanced-thought-input"
					required
					oninput={handleFieldChange}
				/>
			</div>

		{:else if currentStep === 7}
			<!-- Step 7: Outcome -->
			<div class="step-card">
				<h2 class="step-heading">How do you feel now?</h2>
				<p class="step-description">
					Re-rate the intensity of your emotion after going through this process.
				</p>

				<div class="outcome-comparison">
					<div class="comparison-item">
						<span class="comparison-label">Before:</span>
						<span class="comparison-value" style="color: {formData.emotionIntensity <= 33 ? '#22c55e' : formData.emotionIntensity <= 66 ? '#f59e0b' : '#ef4444'}">
							{formData.emotionIntensity}
						</span>
					</div>
				</div>

				<IntensitySlider
					bind:value={formData.outcomeIntensity}
					id="outcome-intensity-slider"
					label="Current intensity"
					lowLabel="Much better"
					highLabel="Same/worse"
					onchange={handleOutcomeIntensityChange}
				/>

				<div class="outcome-change">
					{#if formData.outcomeIntensity < formData.emotionIntensity}
						<p class="change-positive">
							↓ Intensity reduced by {formData.emotionIntensity - formData.outcomeIntensity} points
						</p>
					{:else if formData.outcomeIntensity > formData.emotionIntensity}
						<p class="change-negative">
							↑ Intensity increased by {formData.outcomeIntensity - formData.emotionIntensity} points
						</p>
					{:else}
						<p class="change-neutral">
							→ Intensity unchanged
						</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Navigation -->
	<div class="form-navigation">
		{#if currentStep > 1}
			<button onclick={handleBack} class="btn-secondary nav-button">
				← Back
			</button>
		{:else}
			<div></div>
		{/if}

		{#if currentStep < totalSteps}
			<button
				onclick={handleNext}
				disabled={!validateCurrentStep()}
				class="btn-primary nav-button"
			>
				Next →
			</button>
		{:else}
			<button
				onclick={handleComplete}
				disabled={!validateCurrentStep()}
				class="btn-primary nav-button"
			>
				Complete
			</button>
		{/if}
	</div>

	<!-- Exit option -->
	<div class="form-exit">
		<button onclick={handleExit} class="exit-button">
			Save and exit
		</button>
	</div>
</div>

<style>
	.draft-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 1000;
	}

	.draft-dialog {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		max-width: 28rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.draft-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.75rem;
	}

	.draft-message {
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.draft-actions {
		display: flex;
		gap: 0.75rem;
	}

	.draft-actions button {
		flex: 1;
		min-height: 44px;
	}

	.thought-record-form {
		max-width: 42rem;
		margin: 0 auto;
		padding: 1rem;
	}

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.form-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a2e);
	}

	.save-status {
		font-size: 0.875rem;
		min-height: 1.5rem;
	}

	.status-saving {
		color: var(--text-secondary, #52525b);
	}

	.status-saved {
		color: var(--success-600, #16a34a);
		font-weight: 500;
	}

	.status-error {
		color: var(--danger-600, #dc2626);
		font-weight: 500;
	}

	.form-content {
		margin: 2rem 0;
	}

	.step-card {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.step-heading {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.5rem;
	}

	.step-description {
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.evidence-section {
		margin-bottom: 1.5rem;
	}

	.evidence-section:last-child {
		margin-bottom: 0;
	}

	.outcome-comparison {
		background: var(--primary-50, #faf5ff);
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.comparison-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.comparison-label {
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-secondary, #52525b);
	}

	.comparison-value {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.outcome-change {
		margin-top: 1rem;
		text-align: center;
	}

	.outcome-change p {
		font-size: 1.125rem;
		font-weight: 500;
		padding: 0.5rem;
		border-radius: 6px;
	}

	.change-positive {
		color: var(--success-700, #15803d);
		background: var(--success-50, #f0fdf4);
	}

	.change-negative {
		color: var(--danger-700, #b91c1c);
		background: var(--danger-50, #fef2f2);
	}

	.change-neutral {
		color: var(--text-secondary, #52525b);
		background: #f4f4f5;
	}

	.form-navigation {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 2rem 0 1rem;
	}

	.nav-button {
		min-width: 120px;
		min-height: 48px;
		font-size: 1.125rem;
	}

	.form-exit {
		text-align: center;
		padding-top: 1rem;
		border-top: 1px solid #e4e4e7;
		margin-top: 1.5rem;
	}

	.exit-button {
		background: none;
		border: none;
		color: var(--text-secondary, #52525b);
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: color 0.2s ease;
		min-height: 44px;
	}

	.exit-button:hover {
		color: var(--text-primary, #1a1a2e);
	}
</style>
