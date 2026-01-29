<!-- src/lib/components/time/VisualTimer.svelte -->
<!-- Reusable circular countdown timer - Phase 9 Time Perception Aids -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		duration: number;          // Total duration in seconds
		size?: 'sm' | 'md' | 'lg'; // Timer size
		autoStart?: boolean;       // Start immediately
		onComplete?: () => void;   // Callback when timer ends
		onTick?: (remaining: number) => void; // Called every second
	}

	let {
		duration,
		size = 'md',
		autoStart = false,
		onComplete,
		onTick
	}: Props = $props();

	// Size configurations
	const sizes = {
		sm: { diameter: 64, strokeWidth: 4, fontSize: '0.875rem' },
		md: { diameter: 120, strokeWidth: 6, fontSize: '1.5rem' },
		lg: { diameter: 200, strokeWidth: 8, fontSize: '2.5rem' }
	};

	let remaining = $state(duration);
	let isRunning = $state(false);
	let isPaused = $state(false);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	// Derived values
	const config = $derived(sizes[size]);
	const radius = $derived((config.diameter - config.strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const progress = $derived(remaining / duration);
	const strokeDashoffset = $derived(circumference * (1 - progress));

	// Color based on remaining time
	const color = $derived(() => {
		const percent = (remaining / duration) * 100;
		if (percent > 50) return '#10b981'; // Green
		if (percent > 20) return '#f59e0b'; // Amber
		return '#ef4444'; // Red
	});

	// Format time as MM:SS
	const formattedTime = $derived(() => {
		const mins = Math.floor(remaining / 60);
		const secs = remaining % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	});

	// Check for reduced motion preference
	let prefersReducedMotion = $state(false);

	onMount(() => {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (autoStart) {
			start();
		}
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	export function start() {
		if (isRunning && !isPaused) return;

		isRunning = true;
		isPaused = false;

		intervalId = setInterval(() => {
			remaining--;
			onTick?.(remaining);

			if (remaining <= 0) {
				stop();
				onComplete?.();
			}
		}, 1000);
	}

	export function pause() {
		if (!isRunning || isPaused) return;

		isPaused = true;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	export function resume() {
		if (!isPaused) return;
		start();
	}

	export function stop() {
		isRunning = false;
		isPaused = false;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	export function reset() {
		stop();
		remaining = duration;
	}

	export function getRemaining() {
		return remaining;
	}

	export function isActive() {
		return isRunning && !isPaused;
	}
</script>

<div
	class="visual-timer"
	style="width: {config.diameter}px; height: {config.diameter}px;"
	role="timer"
	aria-label="Timer: {formattedTime()} remaining"
>
	<svg
		width={config.diameter}
		height={config.diameter}
		class="timer-svg"
	>
		<!-- Background circle -->
		<circle
			cx={config.diameter / 2}
			cy={config.diameter / 2}
			r={radius}
			fill="none"
			stroke="#e5e7eb"
			stroke-width={config.strokeWidth}
		/>

		<!-- Progress circle -->
		<circle
			cx={config.diameter / 2}
			cy={config.diameter / 2}
			r={radius}
			fill="none"
			stroke={color()}
			stroke-width={config.strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={strokeDashoffset}
			class="progress-ring"
			class:no-transition={prefersReducedMotion}
			transform="rotate(-90 {config.diameter / 2} {config.diameter / 2})"
		/>
	</svg>

	<!-- Time display -->
	<div
		class="time-display"
		style="font-size: {config.fontSize}"
	>
		<span class="time-text" style="color: {color()}">{formattedTime()}</span>
		{#if isPaused}
			<span class="paused-indicator">PAUSED</span>
		{/if}
	</div>
</div>

<style>
	.visual-timer {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.timer-svg {
		position: absolute;
		top: 0;
		left: 0;
	}

	.progress-ring {
		transition: stroke-dashoffset 0.5s ease-out, stroke 0.3s ease;
	}

	.progress-ring.no-transition {
		transition: none;
	}

	.time-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.time-text {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease;
	}

	.paused-indicator {
		font-size: 0.625rem;
		color: #6b7280;
		font-weight: 600;
		letter-spacing: 0.05em;
		margin-top: 0.25rem;
	}
</style>
