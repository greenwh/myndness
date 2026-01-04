<script lang="ts">
	export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

	interface Props {
		phase: BreathPhase;
		countdown: number;
		reducedMotion?: boolean;
	}

	let { phase, countdown, reducedMotion = false }: Props = $props();

	// Phase-specific styles and labels
	const phaseConfig = {
		idle: {
			label: 'Ready',
			instruction: 'Tap to begin',
			bgClass: 'bg-gray-200',
			scale: 1
		},
		inhale: {
			label: 'INHALE',
			instruction: 'Breathe in slowly',
			bgClass: 'breathing-inhale',
			scale: 1.5
		},
		hold: {
			label: 'HOLD',
			instruction: 'Hold your breath',
			bgClass: 'breathing-hold',
			scale: 1.5
		},
		exhale: {
			label: 'EXHALE',
			instruction: 'Breathe out slowly',
			bgClass: 'breathing-exhale',
			scale: 1
		}
	};

	// Get current phase config
	let config = $derived(phaseConfig[phase]);

	// Duration mapping for CSS transitions
	const phaseDurations: Record<BreathPhase, number> = {
		idle: 0,
		inhale: 4,
		hold: 0,
		exhale: 8
	};
</script>

<div class="flex flex-col items-center justify-center gap-6">
	<!-- Breathing Circle -->
	<div
		class="breathing-circle {config.bgClass}"
		class:reduced-motion={reducedMotion}
		style="
			--scale: {config.scale};
			--duration: {phaseDurations[phase]}s;
		"
		aria-live="polite"
		aria-label="{config.label}: {countdown} seconds remaining"
	>
		<!-- Phase label -->
		<span class="text-2xl font-bold tracking-wider">
			{config.label}
		</span>

		<!-- Countdown -->
		{#if phase !== 'idle'}
			<span class="text-5xl font-bold tabular-nums">
				{countdown}
			</span>
		{/if}
	</div>

	<!-- Instruction text -->
	<p class="text-lg text-gray-600 text-center" aria-hidden="true">
		{config.instruction}
	</p>
</div>

<style>
	.breathing-circle {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
		transform: scale(var(--scale, 1));
		transition-property: transform, background;
		transition-timing-function: ease-in-out;
		transition-duration: var(--duration, 0s);
		box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
	}

	/* Reduced motion - instant transitions */
	.breathing-circle.reduced-motion {
		transition-duration: 0.01ms !important;
	}

	/* Override for idle state - gray circle */
	.breathing-circle.bg-gray-200 {
		color: theme('colors.gray.600');
		background: theme('colors.gray.200');
	}

	/* Breathing phase gradients are defined in app.css */
</style>
