<script lang="ts">
	/**
	 * ExposureLogForm - Log an exposure attempt
	 *
	 * Features:
	 * - Explicit save pattern (like BP Logger)
	 * - Three distress ratings: before, during (peak), after
	 * - Duration tracking
	 * - Optional notes
	 * - Success view with visual distress flow
	 */

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { addExposureAttempt } from '$lib/db';
	import type { AnxietyHierarchyItem, ExposureAttempt } from '$lib/db/types';

	import CharacterCounter from '$lib/components/common/CharacterCounter.svelte';
	import IntensitySlider from '$lib/components/common/IntensitySlider.svelte';

	interface Props {
		item: AnxietyHierarchyItem;
	}

	let { item }: Props = $props();

	// Form state
	let distressBefore = $state(item.currentDistress);
	let distressDuring = $state(item.currentDistress);
	let distressAfter = $state(item.currentDistress);
	let duration = $state<number | undefined>(undefined);
	let notes = $state('');

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let showSuccess = $state(false);

	// Validation
	const isValid = $derived(
		duration !== undefined && duration > 0 && duration <= 300
	);

	// Save exposure
	async function saveExposure() {
		if (!browser || !isValid) return;

		saveStatus = 'saving';

		try {
			const exposure: ExposureAttempt = {
				date: new Date().toISOString().split('T')[0],
				distressBefore,
				distressDuring,
				distressAfter,
				duration: duration as number,
				notes: notes.trim() || undefined
			};

			// Use helper that handles array spreading!
			await addExposureAttempt(item.id!, exposure);

			saveStatus = 'saved';
			showSuccess = true;
		} catch (error) {
			console.error('Failed to save exposure:', error);
			saveStatus = 'error';
		}
	}

	function viewProgress() {
		goto(`${base}/tools/cbt/hierarchy/${item.id}`);
	}

	function goBack() {
		goto(`${base}/tools/cbt/hierarchy/${item.id}`);
	}
</script>

{#if !showSuccess}
	<div class="log-form">
		<!-- Context -->
		<div class="context-section">
			<h2 class="section-title">Exposure</h2>
			<div class="context-card">
				<div class="context-label">Situation</div>
				<div class="context-value">{item.situation}</div>
				{#if item.category}
					<span class="category-badge">{item.category}</span>
				{/if}
				<div class="current-distress">
					<span class="label">Current distress level:</span>
					<span class="value">{item.currentDistress} SUDS</span>
				</div>
			</div>
		</div>

		<!-- Distress ratings -->
		<div class="ratings-section">
			<h2 class="section-title">Rate Your Distress</h2>

			<IntensitySlider
				bind:value={distressBefore}
				label="Before starting the exposure"
				lowLabel="No distress"
				highLabel="Extreme"
				id="distressBefore"
			/>

			<IntensitySlider
				bind:value={distressDuring}
				label="During the exposure (peak anxiety)"
				lowLabel="No distress"
				highLabel="Extreme"
				id="distressDuring"
			/>

			<IntensitySlider
				bind:value={distressAfter}
				label="After completing the exposure"
				lowLabel="No distress"
				highLabel="Extreme"
				id="distressAfter"
			/>
		</div>

		<!-- Duration & Notes -->
		<div class="details-section">
			<h2 class="section-title">Exposure Details</h2>

			<div class="form-field">
				<label for="duration" class="field-label">
					Duration (minutes) <span class="required">*</span>
				</label>
				<input
					type="number"
					id="duration"
					bind:value={duration}
					min="1"
					max="300"
					placeholder="Enter duration"
					class="number-input"
					required
				/>
				{#if duration !== undefined && (duration < 1 || duration > 300)}
					<p class="error-text">Duration must be between 1 and 300 minutes</p>
				{/if}
			</div>

			<CharacterCounter
				bind:value={notes}
				maxLength={300}
				rows={3}
				placeholder="Optional: How did it go? What did you notice?"
				label="Notes"
				id="notes"
				required={false}
			/>
		</div>

		<!-- Actions -->
		<div class="form-actions">
			<button class="btn-secondary" onclick={goBack}>Cancel</button>
			<button class="btn-primary" disabled={!isValid || saveStatus === 'saving'} onclick={saveExposure}>
				{#if saveStatus === 'saving'}
					Saving...
				{:else}
					Save Exposure
				{/if}
			</button>
		</div>

		{#if saveStatus === 'error'}
			<div class="error-message">
				Failed to save exposure. Please try again.
			</div>
		{/if}
	</div>
{:else}
	<!-- Success View -->
	<div class="success-view">
		<div class="success-icon">
			<svg
				class="checkmark"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 13l4 4L19 7"
				/>
			</svg>
		</div>

		<h2 class="success-title">Exposure Logged</h2>

		<div class="distress-flow">
			<div class="flow-item">
				<div class="flow-label">Before</div>
				<div class="flow-value before">{distressBefore}</div>
			</div>
			<svg class="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/>
			</svg>
			<div class="flow-item">
				<div class="flow-label">During</div>
				<div class="flow-value during">{distressDuring}</div>
			</div>
			<svg class="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/>
			</svg>
			<div class="flow-item">
				<div class="flow-label">After</div>
				<div class="flow-value after">{distressAfter}</div>
			</div>
		</div>

		{#if distressAfter < distressBefore}
			<p class="success-message positive">
				Your distress decreased by {distressBefore - distressAfter} points during this exposure.
				This is evidence of habituation working.
			</p>
		{:else if distressAfter > distressBefore}
			<p class="success-message">
				Your distress increased this time. That's okay - exposure takes practice, and not every
				attempt will show immediate reduction.
			</p>
		{:else}
			<p class="success-message">
				Your distress stayed the same. Keep practicing - habituation often happens gradually over
				multiple exposures.
			</p>
		{/if}

		<button class="btn-primary" onclick={viewProgress}>View Progress Chart</button>
	</div>
{/if}

<style>
	.log-form {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Context section */
	.context-section {
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a2e;
		margin-bottom: 1rem;
	}

	.context-card {
		background: #f4f4f5;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.context-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #52525b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.context-value {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a2e;
		line-height: 1.4;
	}

	.category-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 600;
		background: #ede9fe;
		color: #6d28d9;
		align-self: flex-start;
	}

	.current-distress {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #e4e4e7;
		font-size: 0.875rem;
	}

	.current-distress .label {
		color: #52525b;
	}

	.current-distress .value {
		font-weight: 600;
		color: #1a1a2e;
	}

	/* Ratings section */
	.ratings-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Details section */
	.details-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

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

	.required {
		color: #ef4444;
	}

	.number-input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		min-height: 44px;
		font-family: inherit;
		transition: border-color 0.2s ease;
	}

	.number-input:focus {
		outline: none;
		border-color: #7c3aed;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.error-text {
		font-size: 0.875rem;
		color: #ef4444;
		margin: 0;
	}

	/* Form actions */
	.form-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding-top: 1rem;
		border-top: 1px solid #e4e4e7;
	}

	.error-message {
		background: #fef2f2;
		color: #ef4444;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		font-weight: 500;
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

	/* Success view */
	.success-view {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.success-icon {
		width: 80px;
		height: 80px;
		background: #dcfce7;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkmark {
		width: 48px;
		height: 48px;
		stroke: #22c55e;
		stroke-width: 3;
	}

	.success-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	/* Distress flow */
	.distress-flow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f4f4f5;
		border-radius: 12px;
		width: 100%;
	}

	.flow-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.flow-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #52525b;
	}

	.flow-value {
		font-size: 1.75rem;
		font-weight: 700;
		padding: 0.5rem 1rem;
		border-radius: 8px;
	}

	.flow-value.before {
		background: #3b82f6;
		color: white;
	}

	.flow-value.during {
		background: #f59e0b;
		color: white;
	}

	.flow-value.after {
		background: #10b981;
		color: white;
	}

	.flow-arrow {
		width: 24px;
		height: 24px;
		color: #52525b;
		flex-shrink: 0;
	}

	.success-message {
		font-size: 1rem;
		color: #52525b;
		line-height: 1.6;
		max-width: 500px;
		margin: 0;
	}

	.success-message.positive {
		color: #166534;
		background: #dcfce7;
		padding: 1rem;
		border-radius: 8px;
		font-weight: 500;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.btn-primary,
		.btn-secondary,
		.number-input {
			transition: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.log-form {
			padding: 0.5rem;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
		}

		.distress-flow {
			flex-direction: column;
			gap: 1.5rem;
		}

		.flow-arrow {
			transform: rotate(90deg);
		}

		.flow-value {
			font-size: 1.5rem;
		}
	}
</style>
