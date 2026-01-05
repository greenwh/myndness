<script lang="ts">
	/**
	 * MoodLogger - Complete mood logging form with auto-save
	 *
	 * Features:
	 * - Mood slider (1-10)
	 * - Anxiety slider (0-10)
	 * - Optional notes
	 * - Auto-save to IndexedDB on any change
	 * - No submit button needed (ADHD accommodation)
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import MoodSlider from './MoodSlider.svelte';
	import { db } from '$lib/db';
	import type { MoodLog } from '$lib/db/types';

	interface Props {
		onSaved?: (entry: MoodLog) => void;
	}

	let { onSaved }: Props = $props();

	// Form state
	let mood = $state(5);
	let anxiety = $state(5);
	let notes = $state('');
	let isAnxietyEpisode = $state(false);

	// Save state
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let currentEntryId = $state<number | undefined>(undefined);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Debounced auto-save
	function scheduleAutoSave() {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		saveStatus = 'saving';

		saveTimeout = setTimeout(async () => {
			await saveEntry();
		}, 500); // 500ms debounce
	}

	// Save entry to IndexedDB
	async function saveEntry() {
		if (!browser) return;

		try {
			const now = new Date();
			const entry: Omit<MoodLog, 'id'> = {
				date: now.toISOString().split('T')[0],
				timestamp: now.toISOString(),
				mood,
				anxiety,
				notes: notes.trim() || undefined,
				isAnxietyEpisode
			};

			if (currentEntryId) {
				// Update existing entry
				await db.moodLogs.update(currentEntryId, entry);
			} else {
				// Create new entry
				currentEntryId = await db.moodLogs.add(entry as MoodLog);
			}

			saveStatus = 'saved';
			onSaved?.({ ...entry, id: currentEntryId });

			// Reset status after a moment
			setTimeout(() => {
				if (saveStatus === 'saved') {
					saveStatus = 'idle';
				}
			}, 2000);
		} catch (error) {
			console.error('Failed to save mood entry:', error);
			saveStatus = 'error';
		}
	}

	// Handle mood change
	function handleMoodChange(newMood: number) {
		mood = newMood;
		scheduleAutoSave();
	}

	// Handle anxiety change
	function handleAnxietyChange(newAnxiety: number) {
		anxiety = newAnxiety;
		// Auto-flag as anxiety episode if anxiety is high
		if (newAnxiety >= 7 && !isAnxietyEpisode) {
			isAnxietyEpisode = true;
		}
		scheduleAutoSave();
	}

	// Handle notes change
	function handleNotesChange() {
		scheduleAutoSave();
	}

	// Handle episode toggle
	function toggleEpisode() {
		isAnxietyEpisode = !isAnxietyEpisode;
		scheduleAutoSave();
	}

	// Load most recent entry for today (for editing)
	onMount(async () => {
		if (!browser) return;

		const today = new Date().toISOString().split('T')[0];
		const todaysLogs = await db.moodLogs.where('date').equals(today).toArray();

		if (todaysLogs.length > 0) {
			// Load the most recent entry
			const latest = todaysLogs.sort((a, b) =>
				b.timestamp.localeCompare(a.timestamp)
			)[0];

			// Only load if it was created in the last hour (fresh entry)
			const entryTime = new Date(latest.timestamp).getTime();
			const oneHourAgo = Date.now() - 60 * 60 * 1000;

			if (entryTime > oneHourAgo) {
				mood = latest.mood;
				anxiety = latest.anxiety;
				notes = latest.notes || '';
				isAnxietyEpisode = latest.isAnxietyEpisode;
				currentEntryId = latest.id;
			}
		}
	});
</script>

<div class="space-y-6">
	<!-- Mood Slider -->
	<div class="card p-6">
		<MoodSlider
			bind:value={mood}
			id="mood-slider"
			label="How is your mood?"
			lowLabel="Very low"
			highLabel="Great"
			min={1}
			max={10}
			colorScheme="mood"
			onchange={handleMoodChange}
		/>
	</div>

	<!-- Anxiety Slider -->
	<div class="card p-6">
		<MoodSlider
			bind:value={anxiety}
			id="anxiety-slider"
			label="Anxiety level"
			lowLabel="None"
			highLabel="Severe"
			min={0}
			max={10}
			colorScheme="anxiety"
			onchange={handleAnxietyChange}
		/>
	</div>

	<!-- Anxiety Episode Toggle -->
	{#if anxiety >= 5}
		<div class="card p-4">
			<label class="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					checked={isAnxietyEpisode}
					onchange={toggleEpisode}
					class="w-6 h-6 rounded border-gray-300 text-danger-500 focus:ring-danger-500"
				/>
				<div>
					<span class="font-medium text-gray-900">Mark as anxiety episode</span>
					<p class="text-sm text-gray-500">For tracking patterns</p>
				</div>
			</label>
		</div>
	{/if}

	<!-- Optional Notes -->
	<div class="card p-4">
		<label for="mood-notes" class="block text-sm font-medium text-gray-700 mb-2">
			Notes (optional)
		</label>
		<textarea
			id="mood-notes"
			bind:value={notes}
			oninput={handleNotesChange}
			placeholder="Anything you want to remember about how you're feeling..."
			rows="3"
			maxlength="500"
			class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
		></textarea>
		<div class="flex justify-between mt-1">
			<span class="text-xs text-gray-400">{notes.length}/500</span>
		</div>
	</div>

	<!-- Save Status -->
	<div class="flex items-center justify-center gap-2 text-sm h-6">
		{#if saveStatus === 'saving'}
			<svg class="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<span class="text-gray-400">Saving...</span>
		{:else if saveStatus === 'saved'}
			<svg class="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span class="text-success-600">Saved</span>
		{:else if saveStatus === 'error'}
			<svg class="w-4 h-4 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span class="text-danger-600">Save failed - try again</span>
		{/if}
	</div>
</div>
