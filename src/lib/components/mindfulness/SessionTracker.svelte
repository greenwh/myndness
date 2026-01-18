<script lang="ts">
	/**
	 * SessionTracker - Before/after session mood and focus tracking
	 *
	 * Features:
	 * - Optional before-session mood/anxiety tracking
	 * - After-session mood/anxiety/focus tracking with notes
	 * - Skip option (never required)
	 * - Large touch targets for accessibility
	 */

	import MoodSlider from '$lib/components/mood/MoodSlider.svelte';

	type TrackingMode = 'before' | 'after';

	interface Props {
		mode: TrackingMode;
		onComplete: (data: TrackingData) => void;
		onSkip?: () => void;
	}

	export interface TrackingData {
		mood?: number;
		anxiety?: number;
		focusQuality?: number;
		notes?: string;
	}

	let { mode, onComplete, onSkip }: Props = $props();

	// Tracking data
	let mood = $state(5);
	let anxiety = $state(5);
	let focusQuality = $state(5);
	let notes = $state('');

	// Submit tracking data
	function handleComplete() {
		const data: TrackingData = {
			mood,
			anxiety
		};

		if (mode === 'after') {
			data.focusQuality = focusQuality;
			if (notes.trim()) {
				data.notes = notes.trim();
			}
		}

		onComplete(data);
	}

	// Skip tracking
	function handleSkip() {
		onSkip?.();
	}
</script>

<div class="tracker-container">
	{#if mode === 'before'}
		<!-- Before Session Tracking -->
		<div class="space-y-6">
			<header class="text-center">
				<h2 class="text-xl font-semibold text-gray-900">Before You Begin</h2>
				<p class="text-sm text-gray-600 mt-1">
					How are you feeling right now? (Optional)
				</p>
			</header>

			<div class="space-y-4">
				<MoodSlider
					bind:value={mood}
					id="mood-before"
					label="Mood"
					lowLabel="Low"
					highLabel="High"
					colorScheme="mood"
					min={1}
					max={10}
				/>

				<MoodSlider
					bind:value={anxiety}
					id="anxiety-before"
					label="Anxiety"
					lowLabel="Calm"
					highLabel="Anxious"
					colorScheme="anxiety"
					min={0}
					max={10}
				/>
			</div>

			<div class="flex gap-3">
				{#if onSkip}
					<button onclick={handleSkip} class="btn-ghost flex-1 h-12">
						Skip
					</button>
				{/if}
				<button onclick={handleComplete} class="btn-primary flex-1 h-12">
					Continue
				</button>
			</div>
		</div>
	{:else}
		<!-- After Session Tracking -->
		<div class="space-y-6">
			<header class="text-center">
				<h2 class="text-xl font-semibold text-gray-900">Session Complete</h2>
				<p class="text-sm text-gray-600 mt-1">
					How are you feeling now?
				</p>
			</header>

			<div class="space-y-4">
				<MoodSlider
					bind:value={mood}
					id="mood-after"
					label="Mood"
					lowLabel="Low"
					highLabel="High"
					colorScheme="mood"
					min={1}
					max={10}
				/>

				<MoodSlider
					bind:value={anxiety}
					id="anxiety-after"
					label="Anxiety"
					lowLabel="Calm"
					highLabel="Anxious"
					colorScheme="anxiety"
					min={0}
					max={10}
				/>

				<MoodSlider
					bind:value={focusQuality}
					id="focus-quality"
					label="Focus"
					lowLabel="Distracted"
					highLabel="Focused"
					colorScheme="mood"
					min={0}
					max={10}
				/>
			</div>

			<!-- Notes (optional) -->
			<div class="space-y-2">
				<label for="session-notes" class="block text-sm font-medium text-gray-700">
					Notes (optional)
				</label>
				<textarea
					id="session-notes"
					bind:value={notes}
					placeholder="Any reflections or observations..."
					rows="3"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
					maxlength="500"
				></textarea>
				<div class="text-xs text-gray-500 text-right">
					{notes.length}/500
				</div>
			</div>

			<button onclick={handleComplete} class="btn-primary w-full h-12">
				Done
			</button>
		</div>
	{/if}
</div>

<style>
	.tracker-container {
		max-width: 28rem;
		margin: 0 auto;
		padding: 1rem;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.tracker-container {
			padding: 0.5rem;
		}
	}
</style>
