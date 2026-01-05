<script lang="ts">
	/**
	 * BPLogger - Blood pressure logging form
	 *
	 * Features:
	 * - Systolic/Diastolic number inputs
	 * - Optional heart rate
	 * - Anxiety flag (important for pacemaker user)
	 * - Auto-save to IndexedDB
	 * - Input validation with helpful feedback
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { db } from '$lib/db';
	import type { BPReading } from '$lib/db/types';

	interface Props {
		onSaved?: (entry: BPReading) => void;
	}

	let { onSaved }: Props = $props();

	// Form state
	let systolic = $state<number | ''>('');
	let diastolic = $state<number | ''>('');
	let heartRate = $state<number | ''>('');
	let isAnxietyRelated = $state(false);
	let notes = $state('');

	// Validation state
	let systolicError = $state('');
	let diastolicError = $state('');

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let savedEntry = $state<BPReading | null>(null);

	// Validate systolic (50-250 range)
	function validateSystolic(value: number | ''): string {
		if (value === '') return '';
		if (value < 50) return 'Too low - check your reading';
		if (value > 250) return 'Too high - check your reading';
		return '';
	}

	// Validate diastolic (30-150 range)
	function validateDiastolic(value: number | ''): string {
		if (value === '') return '';
		if (value < 30) return 'Too low - check your reading';
		if (value > 150) return 'Too high - check your reading';
		return '';
	}

	// Update validation on change
	$effect(() => {
		systolicError = validateSystolic(systolic);
	});

	$effect(() => {
		diastolicError = validateDiastolic(diastolic);
	});

	// Check if form is valid for saving
	const isValid = $derived(
		systolic !== '' &&
		diastolic !== '' &&
		!systolicError &&
		!diastolicError
	);

	// Save entry to IndexedDB
	async function saveEntry() {
		if (!browser || !isValid) return;

		saveStatus = 'saving';

		try {
			const now = new Date();
			const entry: Omit<BPReading, 'id'> = {
				date: now.toISOString().split('T')[0],
				timestamp: now.toISOString(),
				systolic: systolic as number,
				diastolic: diastolic as number,
				heartRate: heartRate !== '' ? heartRate : undefined,
				isAnxietyRelated,
				isPostExercise: false,
				isPostMedication: false,
				notes: notes.trim() || undefined
			};

			const id = await db.bpReadings.add(entry as BPReading);
			savedEntry = { ...entry, id };

			saveStatus = 'saved';
			onSaved?.(savedEntry);
		} catch (error) {
			console.error('Failed to save BP reading:', error);
			saveStatus = 'error';
		}
	}

	// Reset form for new entry
	function resetForm() {
		systolic = '';
		diastolic = '';
		heartRate = '';
		isAnxietyRelated = false;
		notes = '';
		saveStatus = 'idle';
		savedEntry = null;
	}

	// Handle input changes - convert to number or empty
	function handleNumberInput(event: Event, field: 'systolic' | 'diastolic' | 'heartRate') {
		const target = event.target as HTMLInputElement;
		const value = target.value === '' ? '' : parseInt(target.value);

		if (field === 'systolic') systolic = value;
		else if (field === 'diastolic') diastolic = value;
		else heartRate = value;
	}
</script>

<div class="space-y-6">
	{#if !savedEntry}
		<!-- Input Form -->
		<div class="card p-6">
			<h3 class="text-lg font-medium text-gray-900 mb-4">Blood Pressure Reading</h3>

			<div class="grid grid-cols-2 gap-4">
				<!-- Systolic -->
				<div>
					<label for="systolic" class="block text-sm font-medium text-gray-700 mb-1">
						Systolic (top)
					</label>
					<input
						type="number"
						id="systolic"
						inputmode="numeric"
						pattern="[0-9]*"
						min="50"
						max="250"
						value={systolic}
						oninput={(e) => handleNumberInput(e, 'systolic')}
						placeholder="120"
						class="w-full px-4 py-3 text-xl font-semibold text-center border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						class:border-gray-200={!systolicError}
						class:border-danger-500={systolicError}
					/>
					{#if systolicError}
						<p class="mt-1 text-xs text-danger-600">{systolicError}</p>
					{/if}
				</div>

				<!-- Diastolic -->
				<div>
					<label for="diastolic" class="block text-sm font-medium text-gray-700 mb-1">
						Diastolic (bottom)
					</label>
					<input
						type="number"
						id="diastolic"
						inputmode="numeric"
						pattern="[0-9]*"
						min="30"
						max="150"
						value={diastolic}
						oninput={(e) => handleNumberInput(e, 'diastolic')}
						placeholder="80"
						class="w-full px-4 py-3 text-xl font-semibold text-center border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						class:border-gray-200={!diastolicError}
						class:border-danger-500={diastolicError}
					/>
					{#if diastolicError}
						<p class="mt-1 text-xs text-danger-600">{diastolicError}</p>
					{/if}
				</div>
			</div>

			<!-- Display format hint -->
			{#if systolic !== '' && diastolic !== ''}
				<p class="text-center mt-3 text-lg text-gray-600">
					<span class="font-semibold">{systolic}/{diastolic}</span> mmHg
				</p>
			{/if}
		</div>

		<!-- Heart Rate (Optional) -->
		<div class="card p-4">
			<label for="heart-rate" class="block text-sm font-medium text-gray-700 mb-1">
				Heart Rate (optional)
			</label>
			<div class="flex items-center gap-2">
				<input
					type="number"
					id="heart-rate"
					inputmode="numeric"
					pattern="[0-9]*"
					min="40"
					max="200"
					value={heartRate}
					oninput={(e) => handleNumberInput(e, 'heartRate')}
					placeholder="72"
					class="w-24 px-4 py-3 text-xl font-semibold text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				/>
				<span class="text-gray-600">BPM</span>
			</div>
		</div>

		<!-- Anxiety Flag -->
		<div class="card p-4">
			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={isAnxietyRelated}
					class="w-6 h-6 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
				/>
				<div>
					<span class="font-medium text-gray-900">Taken during anxiety</span>
					<p class="text-sm text-gray-500">Helps track anxiety's effect on BP</p>
				</div>
			</label>
		</div>

		<!-- Optional Notes -->
		<div class="card p-4">
			<label for="bp-notes" class="block text-sm font-medium text-gray-700 mb-2">
				Notes (optional)
			</label>
			<textarea
				id="bp-notes"
				bind:value={notes}
				placeholder="Any context about this reading..."
				rows="2"
				maxlength="200"
				class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
			></textarea>
		</div>

		<!-- Save Button -->
		<button
			onclick={saveEntry}
			disabled={!isValid || saveStatus === 'saving'}
			class="btn-primary w-full py-4 text-lg"
			class:opacity-50={!isValid}
		>
			{#if saveStatus === 'saving'}
				Saving...
			{:else}
				Save Reading
			{/if}
		</button>

		{#if saveStatus === 'error'}
			<p class="text-center text-sm text-danger-600">Failed to save - please try again</p>
		{/if}

	{:else}
		<!-- Success View -->
		<div class="card p-6 text-center">
			<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-success-100 flex items-center justify-center">
				<svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>

			<h3 class="text-xl font-semibold text-gray-900 mb-2">Reading Saved</h3>

			<p class="text-3xl font-bold text-gray-900 mb-1">
				{savedEntry.systolic}/{savedEntry.diastolic}
			</p>
			<p class="text-gray-600 mb-4">mmHg</p>

			{#if savedEntry.heartRate}
				<p class="text-gray-600">Heart rate: {savedEntry.heartRate} BPM</p>
			{/if}

			{#if savedEntry.isAnxietyRelated}
				<span class="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
					During anxiety
				</span>
			{/if}

			<div class="mt-6 space-y-3">
				<button onclick={resetForm} class="btn-secondary w-full">
					Log Another Reading
				</button>
			</div>
		</div>
	{/if}
</div>
