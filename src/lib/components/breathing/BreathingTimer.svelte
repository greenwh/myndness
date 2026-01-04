<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import BreathingCircle, { type BreathPhase } from './BreathingCircle.svelte';

	interface Props {
		totalRounds?: number;
		onComplete?: () => void;
		onExit?: () => void;
	}

	let { totalRounds = 4, onComplete, onExit }: Props = $props();

	// Timer state
	let phase: BreathPhase = $state('idle');
	let countdown = $state(0);
	let currentRound = $state(1);
	let isRunning = $state(false);
	let isPaused = $state(false);

	// User preferences
	let reducedMotion = $state(false);
	let audioEnabled = $state(true);

	// Audio context for chimes
	let audioContext: AudioContext | null = null;

	// Timer interval reference
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Phase durations (in seconds)
	const PHASE_DURATIONS = {
		inhale: 4,
		hold: 7,
		exhale: 8
	};

	// Detect reduced motion preference
	onMount(() => {
		if (browser) {
			reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// Cleanup on destroy
	onDestroy(() => {
		stopTimer();
		if (audioContext) {
			audioContext.close();
		}
	});

	// Initialize audio context (must be done on user interaction)
	function initAudio() {
		if (!audioContext && browser && audioEnabled) {
			audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		}
	}

	// Play a gentle chime sound
	function playChime(frequency: number = 440, duration: number = 0.15) {
		if (!audioContext || !audioEnabled) return;

		try {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = frequency;
			oscillator.type = 'sine';

			// Gentle fade in/out
			const now = audioContext.currentTime;
			gainNode.gain.setValueAtTime(0, now);
			gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

			oscillator.start(now);
			oscillator.stop(now + duration);
		} catch (e) {
			console.warn('Audio playback failed:', e);
		}
	}

	// Phase transition chimes
	function playPhaseChime(newPhase: BreathPhase) {
		const chimes: Record<BreathPhase, number> = {
			idle: 0,
			inhale: 523.25, // C5 - gentle high note
			hold: 659.25, // E5 - slightly higher
			exhale: 392.0 // G4 - lower, calming
		};
		if (chimes[newPhase]) {
			playChime(chimes[newPhase]);
		}
	}

	// Start the breathing exercise
	function startExercise() {
		initAudio();
		isRunning = true;
		isPaused = false;
		currentRound = 1;
		startPhase('inhale');
	}

	// Start a specific phase
	function startPhase(newPhase: 'inhale' | 'hold' | 'exhale') {
		phase = newPhase;
		countdown = PHASE_DURATIONS[newPhase];
		playPhaseChime(newPhase);

		// Clear existing timer
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		// Start countdown
		timerInterval = setInterval(() => {
			if (isPaused) return;

			countdown--;

			if (countdown <= 0) {
				advancePhase();
			}
		}, 1000);
	}

	// Move to next phase
	function advancePhase() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		if (phase === 'inhale') {
			startPhase('hold');
		} else if (phase === 'hold') {
			startPhase('exhale');
		} else if (phase === 'exhale') {
			// Completed one round
			if (currentRound >= totalRounds) {
				completeExercise();
			} else {
				currentRound++;
				startPhase('inhale');
			}
		}
	}

	// Complete the exercise
	function completeExercise() {
		stopTimer();
		phase = 'idle';
		isRunning = false;
		playChime(523.25, 0.3); // Completion chime
		onComplete?.();
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

	// Exit early (no guilt!)
	function exitExercise() {
		stopTimer();
		phase = 'idle';
		isRunning = false;
		isPaused = false;
		onExit?.();
	}

	// Toggle audio
	function toggleAudio() {
		audioEnabled = !audioEnabled;
	}
</script>

<div class="flex flex-col items-center gap-8">
	<!-- Round indicator -->
	{#if isRunning}
		<div class="text-center">
			<span class="text-sm text-gray-500">Round</span>
			<span class="text-lg font-semibold text-gray-900 ml-1">
				{currentRound} / {totalRounds}
			</span>
		</div>
	{/if}

	<!-- Breathing Circle -->
	<BreathingCircle {phase} {countdown} {reducedMotion} />

	<!-- Controls -->
	<div class="flex flex-col items-center gap-4 w-full max-w-xs">
		{#if !isRunning}
			<!-- Start button -->
			<button
				onclick={startExercise}
				class="btn-primary w-full text-lg"
			>
				Start Breathing
			</button>
		{:else}
			<!-- Active controls -->
			<div class="flex gap-3 w-full">
				<button
					onclick={togglePause}
					class="btn-secondary flex-1"
				>
					{isPaused ? 'Resume' : 'Pause'}
				</button>
				<button
					onclick={exitExercise}
					class="btn-ghost flex-1"
				>
					I'm Done
				</button>
			</div>
		{/if}

		<!-- Audio toggle -->
		<button
			onclick={toggleAudio}
			class="btn-ghost text-sm flex items-center gap-2"
			aria-label={audioEnabled ? 'Mute audio cues' : 'Enable audio cues'}
		>
			{#if audioEnabled}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					/>
				</svg>
				Sound On
			{:else}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
					/>
				</svg>
				Sound Off
			{/if}
		</button>
	</div>
</div>
