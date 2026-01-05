<script lang="ts">
	/**
	 * MoodSlider - Accessible range slider for mood/anxiety ratings
	 *
	 * Features:
	 * - 44px minimum touch targets (accessibility for 64+ user)
	 * - Labels at each end for context
	 * - Large thumb for easy grabbing
	 * - Visual feedback with color gradient
	 * - Respects reduced motion preference
	 */

	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label: string;
		lowLabel: string;
		highLabel: string;
		id: string;
		colorScheme?: 'mood' | 'anxiety';
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(5),
		min = 0,
		max = 10,
		step = 1,
		label,
		lowLabel,
		highLabel,
		id,
		colorScheme = 'mood',
		onchange
	}: Props = $props();

	// Calculate position percentage for gradient fill
	const fillPercent = $derived(((value - min) / (max - min)) * 100);

	// Color based on value and scheme
	function getTrackColor(val: number): string {
		if (colorScheme === 'anxiety') {
			// Green (low) to Red (high) for anxiety
			if (val <= 3) return '#22c55e'; // success-500
			if (val <= 6) return '#f59e0b'; // warning-500
			return '#ef4444'; // danger-500
		} else {
			// Red (low) to Green (high) for mood
			if (val <= 3) return '#ef4444'; // danger-500
			if (val <= 6) return '#f59e0b'; // warning-500
			return '#22c55e'; // success-500
		}
	}

	const trackColor = $derived(getTrackColor(value));

	// Handle value change
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = parseInt(target.value);
		onchange?.(value);
	}
</script>

<div class="slider-container">
	<label for={id} class="slider-label">
		{label}
		<span class="slider-value" style="color: {trackColor}">{value}</span>
	</label>

	<div class="slider-wrapper">
		<span class="slider-bound slider-bound-low">{lowLabel}</span>

		<div class="slider-track-container">
			<input
				type="range"
				{id}
				{min}
				{max}
				{step}
				{value}
				oninput={handleInput}
				class="slider-input"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-label="{label}, current value {value}"
				style="--fill-percent: {fillPercent}%; --track-color: {trackColor}"
			/>
		</div>

		<span class="slider-bound slider-bound-high">{highLabel}</span>
	</div>

	<!-- Visual tick marks for reference -->
	<div class="slider-ticks" aria-hidden="true">
		{#each Array(max - min + 1) as _, i}
			<span
				class="slider-tick"
				class:slider-tick-active={i + min === value}
			>
				{i + min}
			</span>
		{/each}
	</div>
</div>

<style>
	.slider-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0;
	}

	.slider-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--text-primary, #1a1a2e);
	}

	.slider-value {
		font-size: 2rem;
		font-weight: 700;
		min-width: 2.5ch;
		text-align: right;
		transition: color 0.2s ease;
	}

	.slider-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.slider-bound {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		flex-shrink: 0;
		min-width: 4rem;
	}

	.slider-bound-low {
		text-align: right;
	}

	.slider-bound-high {
		text-align: left;
	}

	.slider-track-container {
		flex: 1;
		position: relative;
		padding: 1rem 0;
	}

	.slider-input {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: 4px;
		background: linear-gradient(
			to right,
			var(--track-color) 0%,
			var(--track-color) var(--fill-percent),
			#e4e4e7 var(--fill-percent),
			#e4e4e7 100%
		);
		outline: none;
		cursor: pointer;
	}

	/* Webkit (Chrome, Safari, newer Edge) */
	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: white;
		border: 3px solid var(--track-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s ease;
	}

	.slider-input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.slider-input::-webkit-slider-thumb:active {
		transform: scale(1.05);
	}

	.slider-input:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	/* Firefox */
	.slider-input::-moz-range-thumb {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: white;
		border: 3px solid var(--track-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s ease;
	}

	.slider-input::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.slider-input::-moz-range-track {
		height: 8px;
		border-radius: 4px;
	}

	.slider-input:focus::-moz-range-thumb {
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	/* Tick marks */
	.slider-ticks {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0;
		margin: 0 calc(22px + 0.75rem + 4rem); /* thumb radius + gap + bound width */
	}

	.slider-tick {
		font-size: 0.75rem;
		color: var(--text-muted, #a1a1aa);
		width: 1.25rem;
		text-align: center;
		transition: color 0.2s ease, font-weight 0.2s ease;
	}

	.slider-tick-active {
		color: var(--track-color);
		font-weight: 600;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.slider-input::-webkit-slider-thumb,
		.slider-input::-moz-range-thumb,
		.slider-value,
		.slider-tick {
			transition: none;
		}
	}
</style>
