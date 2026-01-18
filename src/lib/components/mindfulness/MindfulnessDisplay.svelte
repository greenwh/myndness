<script lang="ts">
	interface Props {
		elapsedSeconds: number;
		totalSeconds: number;
		practiceType: string;
		reducedMotion?: boolean;
	}

	let { elapsedSeconds, totalSeconds, practiceType, reducedMotion = false }: Props = $props();

	// Calculate progress (0-100%)
	let progress = $derived(Math.min((elapsedSeconds / totalSeconds) * 100, 100));

	// Format time remaining as MM:SS
	let remainingSeconds = $derived(Math.max(0, totalSeconds - elapsedSeconds));
	let minutes = $derived(Math.floor(remainingSeconds / 60));
	let seconds = $derived(remainingSeconds % 60);
	let timeDisplay = $derived(
		`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	);

	// Color transitions based on progress
	// 0-33%: Blue (calm start)
	// 34-66%: Green (middle settling)
	// 67-100%: Purple (deep practice)
	let bgColor = $derived(
		progress < 34
			? 'from-blue-400 to-blue-500'
			: progress < 67
				? 'from-green-400 to-green-500'
				: 'from-purple-400 to-purple-500'
	);

	// Progress color (slightly darker for contrast)
	let progressColor = $derived(
		progress < 34
			? 'from-blue-500 to-blue-600'
			: progress < 67
				? 'from-green-500 to-green-600'
				: 'from-purple-500 to-purple-600'
	);
</script>

<div class="flex flex-col items-center justify-center gap-6">
	<!-- Circular Progress Timer -->
	<div
		class="mindfulness-circle bg-gradient-to-br {bgColor}"
		class:reduced-motion={reducedMotion}
		style="--progress: {progress}%; --progress-color-start: {progress < 34
			? '#3b82f6'
			: progress < 67
				? '#22c55e'
				: '#a855f7'}; --progress-color-end: {progress < 34
			? '#2563eb'
			: progress < 67
				? '#16a34a'
				: '#9333ea'};"
		aria-live="polite"
		aria-label="{timeDisplay} remaining"
	>
		<!-- Progress ring -->
		<div class="progress-ring"></div>

		<!-- Time display -->
		<div class="timer-content">
			<span class="text-6xl font-bold tabular-nums text-white">
				{timeDisplay}
			</span>
		</div>
	</div>

	<!-- Practice type label -->
	<p class="text-lg text-gray-600 text-center capitalize" aria-hidden="true">
		{practiceType.replace(/-/g, ' ')}
	</p>
</div>

<style>
	.mindfulness-circle {
		position: relative;
		width: 280px;
		height: 280px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
		transition: background 0.5s ease-in-out;
	}

	/* Reduced motion - instant transitions */
	.mindfulness-circle.reduced-motion {
		transition-duration: 0.01ms !important;
	}

	.mindfulness-circle.reduced-motion .progress-ring {
		transition-duration: 0.01ms !important;
	}

	/* Progress ring using conic-gradient */
	.progress-ring {
		position: absolute;
		inset: -8px;
		border-radius: 50%;
		background: conic-gradient(
			from 270deg,
			var(--progress-color-start) 0%,
			var(--progress-color-end) var(--progress),
			transparent var(--progress)
		);
		transition: background 0.3s ease-out;
		pointer-events: none;
		filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));
	}

	/* Timer content centered */
	.timer-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.mindfulness-circle {
			width: 240px;
			height: 240px;
		}

		.timer-content span {
			font-size: 3rem;
		}
	}
</style>
