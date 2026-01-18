<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import MindfulnessDisplay from './MindfulnessDisplay.svelte';
	import SessionTracker, { type TrackingData } from './SessionTracker.svelte';
	import { db } from '$lib/db';
	import type { MindfulnessPracticeType, MindfulnessSession } from '$lib/db/types';

	type TimerState = 'config' | 'tracking' | 'practice' | 'complete';

	interface Props {
		onComplete?: () => void;
		onExit?: () => void;
	}

	let { onComplete, onExit }: Props = $props();

	// Timer state
	let state: TimerState = $state('config');
	let elapsedSeconds = $state(0);
	let totalSeconds = $state(0);
	let isPaused = $state(false);
	let reducedMotion = $state(false);

	// Session tracking
	let currentSessionId = $state<number | null>(null);
	let sessionStartTime = $state<number>(0);
	let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');

	// Configuration
	let selectedDuration = $state(5); // Default to 5 minutes
	let selectedPractice: MindfulnessPracticeType = $state('breath-awareness');
	let trackingEnabled = $state(true); // Enable mood tracking by default

	// Before/after tracking data
	let beforeData: TrackingData | null = null;

	// Timer and save interval references
	let timerInterval: ReturnType<typeof setInterval> | null = null;
	let saveInterval: ReturnType<typeof setInterval> | null = null;
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Duration options (in minutes)
	const DURATION_OPTIONS = [3, 5, 10, 15, 20];

	// Practice type options
	const PRACTICE_OPTIONS: { value: MindfulnessPracticeType; label: string }[] = [
		{ value: 'breath-awareness', label: 'Breath Awareness' },
		{ value: 'body-scan-short', label: 'Body Scan (Short)' },
		{ value: 'body-scan-full', label: 'Body Scan (Full)' },
		{ value: 'loving-kindness', label: 'Loving-Kindness' },
		{ value: 'open-awareness', label: 'Open Awareness' },
		{ value: 'walking-meditation', label: 'Walking Meditation' },
		{ value: 'sound-awareness', label: 'Sound Awareness' },
		{ value: 'other', label: 'Other' }
	];

	// Detect reduced motion preference
	onMount(() => {
		if (browser) {
			reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// Cleanup on destroy
	onDestroy(() => {
		stopTimer();
		stopAutoSave();
	});

	// Start configuration -> tracking or practice
	async function handleStartSession() {
		if (trackingEnabled) {
			state = 'tracking';
		} else {
			await startPractice(null);
		}
	}

	// Handle before-session tracking complete
	async function handleBeforeTrackingComplete(data: TrackingData) {
		beforeData = data;
		await startPractice(data);
	}

	// Handle before-session tracking skipped
	async function handleBeforeTrackingSkip() {
		await startPractice(null);
	}

	// Start the practice session
	async function startPractice(trackingData: TrackingData | null) {
		const now = new Date();
		const session: MindfulnessSession = {
			date: now.toISOString().split('T')[0],
			timestamp: now.toISOString(),
			practiceType: selectedPractice,
			durationPlanned: selectedDuration,
			durationActual: 0,
			completed: false,
			moodBefore: trackingData?.mood,
			anxietyBefore: trackingData?.anxiety
		};

		// Save initial session to DB
		try {
			const id = await db.mindfulnessSessions.add(session);
			currentSessionId = id;
		} catch (error) {
			console.error('Failed to save mindfulness session:', error);
		}

		// Start timer
		state = 'practice';
		totalSeconds = selectedDuration * 60;
		elapsedSeconds = 0;
		isPaused = false;
		sessionStartTime = Date.now();

		// Start countdown
		timerInterval = setInterval(() => {
			if (!isPaused) {
				elapsedSeconds++;

				// Check if complete
				if (elapsedSeconds >= totalSeconds) {
					completeSession();
				}
			}
		}, 1000);

		// Start auto-save (every 30 seconds)
		startAutoSave();
	}

	// Auto-save session data
	function startAutoSave() {
		saveInterval = setInterval(() => {
			if (!isPaused && currentSessionId) {
				debouncedSave();
			}
		}, 30000); // Every 30 seconds
	}

	// Stop auto-save
	function stopAutoSave() {
		if (saveInterval) {
			clearInterval(saveInterval);
			saveInterval = null;
		}
		if (saveTimeout) {
			clearTimeout(saveTimeout);
			saveTimeout = null;
		}
	}

	// Debounced save (500ms)
	function debouncedSave() {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		saveStatus = 'saving';
		saveTimeout = setTimeout(async () => {
			await saveSession(false);
			saveStatus = 'saved';
			// Reset to idle after 2 seconds
			setTimeout(() => {
				saveStatus = 'idle';
			}, 2000);
		}, 500);
	}

	// Save session to database
	async function saveSession(isComplete: boolean) {
		if (!currentSessionId) return;

		const actualMinutes = Math.round((elapsedSeconds / 60) * 10) / 10;

		try {
			await db.mindfulnessSessions.update(currentSessionId, {
				durationActual: actualMinutes,
				completed: isComplete
			});
		} catch (error) {
			console.error('Failed to update mindfulness session:', error);
		}
	}

	// Complete the session
	async function completeSession() {
		stopTimer();
		stopAutoSave();

		// Final save
		await saveSession(true);

		state = 'complete';
	}

	// Handle after-session tracking complete
	async function handleAfterTrackingComplete(data: TrackingData) {
		if (currentSessionId) {
			try {
				await db.mindfulnessSessions.update(currentSessionId, {
					moodAfter: data.mood,
					anxietyAfter: data.anxiety,
					focusQuality: data.focusQuality,
					notes: data.notes
				});
			} catch (error) {
				console.error('Failed to update session tracking:', error);
			}
		}

		onComplete?.();
		resetSession();
	}

	// Stop the timer
	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	// Pause/resume
	function togglePause() {
		isPaused = !isPaused;
	}

	// Exit early
	async function exitSession() {
		stopTimer();
		stopAutoSave();

		// Save actual duration
		await saveSession(false);

		const actualMinutes = Math.floor(elapsedSeconds / 60);
		const actualSeconds = elapsedSeconds % 60;

		// Show supportive message
		alert(
			`You meditated for ${actualMinutes > 0 ? `${actualMinutes} minute${actualMinutes !== 1 ? 's' : ''}` : ''} ${actualSeconds > 0 ? `${actualSeconds} second${actualSeconds !== 1 ? 's' : ''}` : ''}.`
		);

		onExit?.();
		resetSession();
	}

	// Reset session state
	function resetSession() {
		state = 'config';
		elapsedSeconds = 0;
		isPaused = false;
		currentSessionId = null;
		beforeData = null;
	}

	// Format time as MM:SS
	function formatTime(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}
</script>

<div class="flex flex-col items-center gap-8">
	{#if state === 'config'}
		<!-- Configuration Screen -->
		<div class="w-full max-w-md space-y-6">
			<h2 class="text-2xl font-semibold text-gray-900 text-center">Meditation Timer</h2>

			<!-- Duration Selection -->
			<div class="space-y-3">
				<div class="block text-sm font-medium text-gray-700">Duration</div>
				<div class="grid grid-cols-5 gap-2">
					{#each DURATION_OPTIONS as duration}
						<button
							type="button"
							onclick={() => (selectedDuration = duration)}
							class="btn-secondary h-12 {selectedDuration === duration
								? 'ring-2 ring-blue-500 bg-blue-50'
								: ''}"
						>
							{duration}m
						</button>
					{/each}
				</div>
			</div>

			<!-- Practice Type Selection -->
			<div class="space-y-3">
				<div class="block text-sm font-medium text-gray-700">Practice Type</div>
				<div class="space-y-2">
					{#each PRACTICE_OPTIONS as practice}
						<label
							class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
						>
							<input
								type="radio"
								name="practice"
								value={practice.value}
								bind:group={selectedPractice}
								class="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<span class="text-gray-900">{practice.label}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Mood Tracking Toggle -->
			<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
				<input
					type="checkbox"
					bind:checked={trackingEnabled}
					class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
				/>
				<div class="flex-1">
					<div class="font-medium text-gray-900">Track mood before/after</div>
					<div class="text-sm text-gray-600">Optional mood and focus tracking</div>
				</div>
			</label>

			<!-- Start Button -->
			<button onclick={handleStartSession} class="btn-primary w-full text-lg h-12">
				Start Session
			</button>
		</div>
	{:else if state === 'tracking'}
		<!-- Before-Session Tracking -->
		<SessionTracker
			mode="before"
			onComplete={handleBeforeTrackingComplete}
			onSkip={handleBeforeTrackingSkip}
		/>
	{:else if state === 'practice'}
		<!-- Practice Screen -->
		<div class="flex flex-col items-center gap-6">
			<!-- Timer Display -->
			<MindfulnessDisplay
				{elapsedSeconds}
				{totalSeconds}
				practiceType={selectedPractice}
				{reducedMotion}
			/>

			<!-- Save status -->
			{#if saveStatus !== 'idle'}
				<div class="text-xs text-gray-500">
					{saveStatus === 'saving' ? 'Saving...' : 'Saved'}
				</div>
			{/if}

			<!-- Controls -->
			<div class="flex gap-3 w-full max-w-xs">
				<button onclick={togglePause} class="btn-secondary flex-1 h-12">
					{isPaused ? 'Resume' : 'Pause'}
				</button>
				<button onclick={exitSession} class="btn-ghost flex-1 h-12"> End Session </button>
			</div>
		</div>
	{:else if state === 'complete'}
		<!-- After-Session Tracking -->
		<SessionTracker mode="after" onComplete={handleAfterTrackingComplete} />
	{/if}
</div>
