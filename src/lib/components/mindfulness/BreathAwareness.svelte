<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		durationMinutes?: number;
		onComplete?: () => void;
		onExit?: () => void;
	}

	let { durationMinutes = 5, onComplete, onExit }: Props = $props();

	// Practice state
	let isRunning = $state(false);
	let currentPhase = $state(0);
	let elapsedSeconds = $state(0);
	let reducedMotion = $state(false);

	// Timer interval
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Practice phases with instructions
	const phases = [
		{
			title: 'Welcome',
			instructions: [
				'Find a comfortable position, either sitting or lying down.',
				'Allow your eyes to gently close, or soften your gaze.',
				'Take a moment to settle in and notice how your body feels right now.'
			],
			duration: 60 // seconds
		},
		{
			title: 'Finding the Breath',
			instructions: [
				'Begin to notice your natural breathing.',
				'You don\'t need to change anything about your breath.',
				'Simply observe the gentle rhythm of breathing in and breathing out.',
				'Notice where you feel the breath most clearly - perhaps at your nostrils, chest, or belly.'
			],
			duration: 90
		},
		{
			title: 'Staying Present',
			instructions: [
				'As you continue to breathe naturally, your mind may wander.',
				'This is completely normal and part of the practice.',
				'When you notice your attention has drifted, gently guide it back to the breath.',
				'No judgment, no frustration - just a kind return to this moment.'
			],
			duration: 90
		},
		{
			title: 'Deepening Awareness',
			instructions: [
				'Continue observing each breath with gentle curiosity.',
				'Notice the slight pause between breathing in and breathing out.',
				'Feel the subtle sensations of air moving through your body.',
				'Each breath is an anchor to the present moment.'
			],
			duration: 90
		},
		{
			title: 'Closing',
			instructions: [
				'Begin to bring your awareness back to your surroundings.',
				'Notice any sounds around you.',
				'When you\'re ready, gently open your eyes.',
				'Take a moment to appreciate this time you\'ve given yourself.'
			],
			duration: 60
		}
	];

	// Calculate phase timing based on total duration
	let phaseDurations = $derived.by(() => {
		const totalSeconds = durationMinutes * 60;
		const phaseCount = phases.length;
		const avgDuration = Math.floor(totalSeconds / phaseCount);

		// Distribute time evenly across phases
		return phases.map(() => avgDuration);
	});

	// Get current phase index based on elapsed time
	let currentPhaseIndex = $derived.by(() => {
		let accumulated = 0;
		for (let i = 0; i < phaseDurations.length; i++) {
			accumulated += phaseDurations[i];
			if (elapsedSeconds < accumulated) {
				return i;
			}
		}
		return phaseDurations.length - 1;
	});

	// Current phase data
	let currentPhaseData = $derived(phases[currentPhaseIndex]);

	// Detect reduced motion
	onMount(() => {
		if (browser) {
			reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// Cleanup
	onDestroy(() => {
		stopPractice();
	});

	// Start practice
	function startPractice() {
		isRunning = true;
		elapsedSeconds = 0;
		currentPhase = 0;

		timerInterval = setInterval(() => {
			elapsedSeconds++;

			// Check if complete
			if (elapsedSeconds >= durationMinutes * 60) {
				completePractice();
			}
		}, 1000);
	}

	// Stop practice
	function stopPractice() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	// Complete practice
	function completePractice() {
		stopPractice();
		isRunning = false;
		onComplete?.();
	}

	// Exit early
	function exitPractice() {
		stopPractice();
		isRunning = false;
		onExit?.();
	}

	// Format time remaining
	let timeRemaining = $derived.by(() => {
		const remaining = durationMinutes * 60 - elapsedSeconds;
		const mins = Math.floor(remaining / 60);
		const secs = remaining % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	});
</script>

<div class="breath-awareness">
	{#if !isRunning}
		<!-- Start Screen -->
		<div class="start-screen">
			<div class="text-6xl mb-6">🌬️</div>
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">Breath Awareness</h2>
			<p class="text-gray-600 mb-6 max-w-md text-center">
				A {durationMinutes}-minute guided practice focusing attention on your natural breath.
			</p>
			<button onclick={startPractice} class="btn-primary w-full max-w-xs h-12 text-lg">
				Begin Practice
			</button>
		</div>
	{:else}
		<!-- Practice Screen -->
		<div class="practice-screen" class:reduced-motion={reducedMotion}>
			<!-- Time remaining -->
			<div class="time-remaining">
				{timeRemaining}
			</div>

			<!-- Phase content -->
			<div class="phase-content">
				<h3 class="phase-title">{currentPhaseData.title}</h3>
				<div class="instructions">
					{#each currentPhaseData.instructions as instruction}
						<p class="instruction-text">{instruction}</p>
					{/each}
				</div>
			</div>

			<!-- Progress dots -->
			<div class="progress-dots" aria-label="Practice progress">
				{#each phases as phase, i}
					<button
						type="button"
						class="progress-dot"
						class:active={i === currentPhaseIndex}
						class:completed={i < currentPhaseIndex}
						aria-label="{phase.title}{i === currentPhaseIndex ? ' - current' : ''}{i < currentPhaseIndex ? ' - completed' : ''}"
					/>
				{/each}
			</div>

			<!-- Exit button -->
			<button onclick={exitPractice} class="btn-ghost mt-8">
				End Practice
			</button>
		</div>
	{/if}
</div>

<style>
	.breath-awareness {
		width: 100%;
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.start-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem 0;
	}

	.practice-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 60vh;
		padding: 2rem 0;
		background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%);
		border-radius: 1rem;
		transition: background 0.5s ease;
	}

	.practice-screen.reduced-motion {
		transition: none;
	}

	.time-remaining {
		font-size: 1rem;
		font-weight: 500;
		color: #64748b;
		margin-bottom: 2rem;
		font-variant-numeric: tabular-nums;
	}

	.phase-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 36rem;
		padding: 0 2rem;
		text-align: center;
	}

	.phase-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 2rem;
	}

	.instructions {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.instruction-text {
		font-size: 1.25rem;
		line-height: 1.8;
		color: #334155;
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.reduced-motion .instruction-text {
		animation: none;
	}

	.progress-dots {
		display: flex;
		gap: 0.75rem;
		margin-top: 2rem;
		padding: 1rem;
	}

	.progress-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #cbd5e1;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		padding: 0;
	}

	.progress-dot.active {
		background: #3b82f6;
		transform: scale(1.5);
	}

	.progress-dot.completed {
		background: #22c55e;
	}

	.reduced-motion .progress-dot {
		transition: none;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.breath-awareness {
			padding: 1rem 0.5rem;
		}

		.practice-screen {
			padding: 1.5rem 0;
			min-height: 50vh;
		}

		.phase-title {
			font-size: 1.25rem;
		}

		.instruction-text {
			font-size: 1.125rem;
			line-height: 1.7;
		}

		.phase-content {
			padding: 0 1.5rem;
		}
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.practice-screen,
		.instruction-text,
		.progress-dot {
			animation: none;
			transition: none;
		}
	}
</style>
