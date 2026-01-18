<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	type ScanDuration = 'short' | 'full';

	interface Props {
		duration?: ScanDuration;
		onComplete?: () => void;
		onExit?: () => void;
	}

	let { duration = 'short', onComplete, onExit }: Props = $props();

	// Practice state
	let isRunning = $state(false);
	let currentAreaIndex = $state(0);
	let elapsedSeconds = $state(0);
	let reducedMotion = $state(false);

	// Timer interval
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Body scan areas - IMPORTANT: Avoid heart-specific focus (pacemaker user)
	const shortScanAreas = [
		{
			name: 'Welcome',
			instruction:
				'Find a comfortable position. Close your eyes or soften your gaze. Take a few deep breaths to settle in.',
			duration: 40
		},
		{
			name: 'Feet and Legs',
			instruction:
				'Bring your attention to your feet. Notice any sensations - warmth, coolness, tingling, or nothing at all. Gradually move your awareness up through your ankles, calves, and thighs.',
			duration: 50
		},
		{
			name: 'Hips and Lower Back',
			instruction:
				'Shift your attention to your hips and lower back. Notice where your body makes contact with the surface beneath you. Observe any sensations of pressure, tension, or ease.',
			duration: 45
		},
		{
			name: 'Belly and Torso',
			instruction:
				'Move your awareness to your belly and torso. Feel the gentle rise and fall as you breathe. Notice the natural rhythm without trying to control it.',
			duration: 50
		},
		{
			name: 'Hands and Arms',
			instruction:
				'Bring attention to your hands. Notice the sensations in your fingers, palms, and the backs of your hands. Gradually move awareness up through your wrists, forearms, and upper arms.',
			duration: 50
		},
		{
			name: 'Shoulders and Neck',
			instruction:
				'Notice your shoulders. Are they holding any tension? Simply observe without trying to change anything. Move awareness to your neck, noticing any sensations there.',
			duration: 45
		},
		{
			name: 'Face and Head',
			instruction:
				'Bring attention to your face - your jaw, cheeks, eyes, and forehead. Notice your whole head, from your chin to the crown. Allow any tension to soften naturally.',
			duration: 45
		},
		{
			name: 'Closing',
			instruction:
				'Take a moment to feel your whole body. Notice the overall sense of yourself in this space. When ready, gently bring your awareness back to the room and open your eyes.',
			duration: 35
		}
	];

	const fullScanAreas = [
		{
			name: 'Welcome',
			instruction:
				'Find a comfortable position, either lying down or sitting. Allow your eyes to gently close. Take three slow, deep breaths to arrive in this moment.',
			duration: 60
		},
		{
			name: 'Left Foot',
			instruction:
				'Bring your attention to your left foot. Notice the toes, the sole, the top of the foot. Simply observe any sensations that are present - or the absence of sensation.',
			duration: 70
		},
		{
			name: 'Left Leg',
			instruction:
				'Move awareness up through your left ankle, calf, and shin. Notice your knee, then your thigh. Observe the whole left leg with gentle curiosity.',
			duration: 75
		},
		{
			name: 'Right Foot',
			instruction:
				'Shift attention to your right foot. Notice your toes, sole, and top of the foot. Simply observe with patient awareness.',
			duration: 70
		},
		{
			name: 'Right Leg',
			instruction:
				'Move awareness up through your right ankle, calf, and shin. Notice your knee and thigh. Feel the whole right leg.',
			duration: 75
		},
		{
			name: 'Hips and Lower Back',
			instruction:
				'Bring attention to your hips and pelvis. Notice where your body contacts the surface beneath you. Move awareness to your lower back, observing any sensations without judgment.',
			duration: 75
		},
		{
			name: 'Belly',
			instruction:
				'Rest your attention on your belly. Feel the gentle movement as you breathe - rising on the in-breath, falling on the out-breath. Notice the natural rhythm.',
			duration: 75
		},
		{
			name: 'Torso and Upper Back',
			instruction:
				'Expand awareness to include your whole torso. Notice your rib cage, your upper back. Feel the subtle movements with each breath.',
			duration: 75
		},
		{
			name: 'Hands',
			instruction:
				'Bring attention to both hands. Notice your fingers, palms, the backs of your hands. Observe any tingling, warmth, or other sensations.',
			duration: 70
		},
		{
			name: 'Arms',
			instruction:
				'Move awareness up through your wrists, forearms, elbows, and upper arms. Feel the weight of your arms resting.',
			duration: 75
		},
		{
			name: 'Shoulders and Neck',
			instruction:
				'Notice your shoulders. Are they holding tension? Simply observe. Move to your neck, noticing sensations from your collarbone to the base of your skull.',
			duration: 75
		},
		{
			name: 'Face and Head',
			instruction:
				'Bring gentle attention to your jaw, your cheeks, your eyes. Notice your forehead, temples, and the crown of your head. Allow any tightness to soften naturally.',
			duration: 75
		},
		{
			name: 'Whole Body',
			instruction:
				'Expand awareness to include your entire body. Feel yourself as a complete whole, from the top of your head to the tips of your toes. Rest in this awareness.',
			duration: 75
		},
		{
			name: 'Closing',
			instruction:
				'Begin to deepen your breath. Wiggle your fingers and toes. When you\'re ready, gently open your eyes and take a moment before moving.',
			duration: 45
		}
	];

	// Select areas based on duration
	let areas = $derived(duration === 'short' ? shortScanAreas : fullScanAreas);
	let totalDurationMinutes = $derived(duration === 'short' ? 5 : 15);

	// Current area
	let currentArea = $derived(areas[currentAreaIndex] || areas[areas.length - 1]);

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
		currentAreaIndex = 0;

		timerInterval = setInterval(() => {
			elapsedSeconds++;

			// Check if time to move to next area
			let accumulated = 0;
			for (let i = 0; i <= currentAreaIndex; i++) {
				accumulated += areas[i].duration;
			}

			if (elapsedSeconds >= accumulated && currentAreaIndex < areas.length - 1) {
				currentAreaIndex++;
			}

			// Check if complete
			const totalDuration = areas.reduce((sum, area) => sum + area.duration, 0);
			if (elapsedSeconds >= totalDuration) {
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

	// Calculate progress percentage
	let progressPercent = $derived.by(() => {
		const totalDuration = areas.reduce((sum, area) => sum + area.duration, 0);
		return Math.min((elapsedSeconds / totalDuration) * 100, 100);
	});

	// Format time remaining
	let timeRemaining = $derived.by(() => {
		const totalDuration = areas.reduce((sum, area) => sum + area.duration, 0);
		const remaining = totalDuration - elapsedSeconds;
		const mins = Math.floor(remaining / 60);
		const secs = remaining % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	});
</script>

<div class="body-scan">
	{#if !isRunning}
		<!-- Start Screen -->
		<div class="start-screen">
			<div class="text-6xl mb-6">🧘</div>
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">
				Body Scan {duration === 'short' ? '(Short)' : '(Full)'}
			</h2>
			<p class="text-gray-600 mb-6 max-w-md text-center">
				A {totalDurationMinutes}-minute progressive body scan practice. Move awareness through your
				body with gentle, non-judgmental attention.
			</p>
			<button onclick={startPractice} class="btn-primary w-full max-w-xs h-12 text-lg">
				Begin Practice
			</button>
		</div>
	{:else}
		<!-- Practice Screen -->
		<div class="practice-screen" class:reduced-motion={reducedMotion}>
			<!-- Progress bar -->
			<div class="progress-container">
				<div class="progress-bar" style="width: {progressPercent}%"></div>
			</div>

			<!-- Time remaining -->
			<div class="time-remaining">
				{timeRemaining}
			</div>

			<!-- Body area content -->
			<div class="area-content">
				<h3 class="area-name">{currentArea.name}</h3>
				<p class="area-instruction">{currentArea.instruction}</p>
			</div>

			<!-- Area indicator -->
			<div class="area-indicator">
				{currentAreaIndex + 1} / {areas.length}
			</div>

			<!-- Exit button -->
			<button onclick={exitPractice} class="btn-ghost mt-8">
				End Practice
			</button>
		</div>
	{/if}
</div>

<style>
	.body-scan {
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
		background: linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%);
		border-radius: 1rem;
		position: relative;
	}

	.progress-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: #e9d5ff;
		border-radius: 1rem 1rem 0 0;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #a855f7 0%, #9333ea 100%);
		transition: width 1s linear;
	}

	.reduced-motion .progress-bar {
		transition: none;
	}

	.time-remaining {
		font-size: 1rem;
		font-weight: 500;
		color: #64748b;
		margin-top: 1.5rem;
		margin-bottom: 2rem;
		font-variant-numeric: tabular-nums;
	}

	.area-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 36rem;
		padding: 0 2rem;
		text-align: center;
	}

	.area-name {
		font-size: 1.5rem;
		font-weight: 600;
		color: #6b21a8;
		margin-bottom: 2rem;
		animation: fadeIn 0.3s ease-in-out;
	}

	.area-instruction {
		font-size: 1.25rem;
		line-height: 1.8;
		color: #4c1d95;
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.reduced-motion .area-name,
	.reduced-motion .area-instruction {
		animation: none;
	}

	.area-indicator {
		font-size: 0.875rem;
		color: #9333ea;
		font-weight: 500;
		margin-top: 1.5rem;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.body-scan {
			padding: 1rem 0.5rem;
		}

		.practice-screen {
			padding: 1.5rem 0;
			min-height: 50vh;
		}

		.area-name {
			font-size: 1.25rem;
		}

		.area-instruction {
			font-size: 1.125rem;
			line-height: 1.7;
		}

		.area-content {
			padding: 0 1.5rem;
		}
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.progress-bar,
		.area-name,
		.area-instruction {
			animation: none;
			transition: none;
		}
	}
</style>
