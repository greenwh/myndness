<script lang="ts">
	/**
	 * HierarchyItemForm - 4-step form for creating anxiety hierarchy item
	 *
	 * Features:
	 * - Multi-step state machine (4 steps)
	 * - Auto-save with 500ms debounce
	 * - Suggested target distress calculation
	 * - SUDS (Subjective Units of Distress Scale) 0-100
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { AnxietyHierarchyItem } from '$lib/db/types';

	import ProgressSteps from '$lib/components/common/ProgressSteps.svelte';
	import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';
	import IntensitySlider from '$lib/components/common/IntensitySlider.svelte';

	// State machine
	let currentStep = $state(1);
	const totalSteps = 4;

	// Form data
	let formData = $state({
		situation: '',
		category: '',
		initialDistress: 50,
		targetDistress: 20
	});

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let currentEntryId = $state<number | undefined>(undefined);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Step labels
	const stepLabels = ['Describe', 'Category', 'Current', 'Target'];

	// Suggested target (30 points below current, minimum 10)
	const suggestedTarget = $derived(Math.max(10, formData.initialDistress - 30));

	// Validation per step
	function validateCurrentStep(): boolean {
		switch (currentStep) {
			case 1:
				return formData.situation.trim().length > 0;
			case 2:
				return true; // Optional
			case 3:
				return formData.initialDistress >= 0 && formData.initialDistress <= 100;
			case 4:
				return formData.targetDistress >= 0 && formData.targetDistress <= 100;
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
			const entry: Omit<AnxietyHierarchyItem, 'id'> = {
				createdAt: new Date().toISOString(),
				situation: formData.situation || '',
				category: formData.category.trim() || undefined,
				initialDistress: formData.initialDistress,
				currentDistress: formData.initialDistress, // Same as initial at creation
				exposureAttempts: [], // Empty array at creation
				targetDistress: formData.targetDistress,
				isComplete: false
			};

			if (currentEntryId) {
				await db.anxietyHierarchy.update(currentEntryId, entry);
			} else {
				currentEntryId = await db.anxietyHierarchy.add(entry as AnxietyHierarchyItem);
			}

			saveStatus = 'saved';

			setTimeout(() => {
				if (saveStatus === 'saved') {
					saveStatus = 'idle';
				}
			}, 2000);
		} catch (error) {
			console.error('Failed to save hierarchy item:', error);
			saveStatus = 'error';
		}
	}

	// Navigation
	function nextStep() {
		if (currentStep < totalSteps && validateCurrentStep()) {
			currentStep++;
			// Auto-update target when moving from step 3 to 4
			if (currentStep === 4) {
				formData.targetDistress = suggestedTarget;
			}
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
			goto(`${base}/tools/cbt/hierarchy`);
		}
	}

	function exitWithoutCompleting() {
		goto(`${base}/tools/cbt/hierarchy`);
	}

	// Derived validations
	const step1Valid = $derived(formData.situation.trim().length > 0);
	const canProceed = $derived(validateCurrentStep());
</script>

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
		<h1 class="form-title">Add to Anxiety Hierarchy</h1>
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

	<!-- Step 1: Describe Fear -->
	{#if currentStep === 1}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">What situation makes you anxious?</h2>
				<p class="step-description">
					Describe a specific situation or activity that causes you distress. Be as concrete as
					possible.
				</p>
			</div>

			<CharacterCounter
				bind:value={formData.situation}
				maxLength={200}
				rows={4}
				placeholder="e.g., Calling someone I don't know well"
				label="Feared Situation"
				id="situation"
				required={true}
				oninput={scheduleAutoSave}
			/>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={exitWithoutCompleting}>Exit</button>
			<button class="btn-primary" disabled={!step1Valid} onclick={nextStep}>Next</button>
		</div>
	{/if}

	<!-- Step 2: Category (Optional) -->
	{#if currentStep === 2}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">Category (Optional)</h2>
				<p class="step-description">
					You can group similar fears together by category. Common categories: Social, Health,
					Performance, Daily Tasks.
				</p>
			</div>

			<div class="form-field">
				<label for="category" class="field-label">Category</label>
				<input
					type="text"
					id="category"
					bind:value={formData.category}
					oninput={scheduleAutoSave}
					placeholder="e.g., Social"
					class="text-input"
				/>
				<p class="field-hint">Leave blank if you prefer not to categorize.</p>
			</div>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={prevStep}>Back</button>
			<button class="btn-primary" onclick={nextStep}>Next</button>
		</div>
	{/if}

	<!-- Step 3: Current Distress -->
	{#if currentStep === 3}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">How much distress does this cause now?</h2>
				<p class="step-description">
					Rate your current anxiety level using the SUDS scale (Subjective Units of Distress
					Scale).
				</p>
			</div>

			<div class="info-box">
				<div class="info-icon">ℹ️</div>
				<div class="info-text">
					<strong>SUDS Scale:</strong> 0 = No distress, 50 = Moderate distress, 100 = Extreme distress
				</div>
			</div>

			<IntensitySlider
				bind:value={formData.initialDistress}
				label="Current Distress Level"
				lowLabel="No distress"
				highLabel="Extreme"
				id="initialDistress"
				onchange={scheduleAutoSave}
			/>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={prevStep}>Back</button>
			<button class="btn-primary" onclick={nextStep}>Next</button>
		</div>
	{/if}

	<!-- Step 4: Target Goal -->
	{#if currentStep === 4}
		<div class="step-content">
			<div class="step-intro">
				<h2 class="step-title">What's your target distress level?</h2>
				<p class="step-description">
					Set a goal for how low you'd like to get your anxiety. You don't need to reach zero -
					just a manageable level.
				</p>
			</div>

			<div class="info-box">
				<div class="info-icon">💡</div>
				<div class="info-text">
					Based on your current distress of <strong>{formData.initialDistress}</strong>, we suggest a
					target of <strong>{suggestedTarget}</strong>.
				</div>
			</div>

			<IntensitySlider
				bind:value={formData.targetDistress}
				label="Target Distress Level"
				lowLabel="No distress"
				highLabel="Moderate"
				id="targetDistress"
				onchange={scheduleAutoSave}
			/>

			<div class="comparison-visual">
				<div class="comparison-item">
					<span class="comparison-label">Current:</span>
					<span class="comparison-value current">{formData.initialDistress}</span>
				</div>
				<svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 8l4 4m0 0l-4 4m4-4H3"
					/>
				</svg>
				<div class="comparison-item">
					<span class="comparison-label">Target:</span>
					<span class="comparison-value target">{formData.targetDistress}</span>
				</div>
			</div>
		</div>

		<div class="step-actions">
			<button class="btn-secondary" onclick={prevStep}>Back</button>
			<button class="btn-primary" onclick={submitAndExit}>Save & Exit</button>
		</div>
	{/if}
</div>

<style>
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

	/* Info box */
	.info-box {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: 8px;
	}

	.info-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.info-text {
		flex: 1;
		font-size: 0.875rem;
		color: #1e40af;
		line-height: 1.5;
	}

	.info-text strong {
		font-weight: 600;
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

	.text-input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		min-height: 44px;
		font-family: inherit;
		transition: border-color 0.2s ease;
	}

	.text-input:focus {
		outline: none;
		border-color: #7c3aed;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.text-input::placeholder {
		color: #a1a1aa;
	}

	.field-hint {
		font-size: 0.875rem;
		color: #52525b;
		line-height: 1.4;
	}

	/* Comparison visual */
	.comparison-visual {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f4f4f5;
		border-radius: 12px;
	}

	.comparison-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.comparison-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #52525b;
	}

	.comparison-value {
		font-size: 2rem;
		font-weight: 700;
		padding: 0.5rem 1rem;
		border-radius: 8px;
	}

	.comparison-value.current {
		background: #fef2f2;
		color: #dc2626;
	}

	.comparison-value.target {
		background: #dcfce7;
		color: #16a34a;
	}

	.arrow-icon {
		width: 32px;
		height: 32px;
		color: #52525b;
		flex-shrink: 0;
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
		.text-input {
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

		.comparison-visual {
			flex-direction: column;
			gap: 1.5rem;
		}

		.arrow-icon {
			transform: rotate(90deg);
		}
	}
</style>
