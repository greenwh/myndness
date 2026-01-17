<script lang="ts">
	/**
	 * IntensitySlider - 0-100 scale slider for emotion intensity
	 *
	 * Features:
	 * - 44px minimum touch targets (accessibility for 64+ user)
	 * - Color gradient: green (0-33), amber (34-66), red (67-100)
	 * - Labels at each end for context
	 * - Large thumb for easy grabbing
	 * - Respects reduced motion preference
	 * - Shows current value prominently
	 */

	interface Props {
		value: number;
		label: string;
		lowLabel?: string;
		highLabel?: string;
		id: string;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(50),
		label,
		lowLabel = 'None',
		highLabel = 'Extreme',
		id,
		onchange
	}: Props = $props();

	// Calculate position percentage for gradient fill
	const fillPercent = $derived((value / 100) * 100);

	// Color based on value (green → amber → red)
	function getTrackColor(val: number): string {
		if (val <= 33) return '#22c55e'; // success-500
		if (val <= 66) return '#f59e0b'; // warning-500
		return '#ef4444'; // danger-500
	}

	const trackColor = $derived(getTrackColor(value));

	// Handle value change
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = parseInt(target.value);
		onchange?.(value);
	}
</script>

<div class="intensity-slider-container">
	<label for={id} class="intensity-label">
		{label}
		<span class="intensity-value" style="color: {trackColor}">{value}</span>
	</label>

	<div class="intensity-wrapper">
		<span class="intensity-bound intensity-bound-low">{lowLabel}</span>

		<div class="intensity-track-container">
			<input
				type="range"
				{id}
				min={0}
				max={100}
				step={5}
				{value}
				oninput={handleInput}
				class="intensity-input"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={value}
				aria-label="{label}, current value {value}"
				style="--fill-percent: {fillPercent}%; --track-color: {trackColor}"
			/>
		</div>

		<span class="intensity-bound intensity-bound-high">{highLabel}</span>
	</div>

	<!-- Reference markers -->
	<div class="intensity-markers" aria-hidden="true">
		<span class="intensity-marker" style="color: #22c55e">0</span>
		<span class="intensity-marker" style="color: #f59e0b">50</span>
		<span class="intensity-marker" style="color: #ef4444">100</span>
	</div>
</div>

<style>
	.intensity-slider-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0;
	}

	.intensity-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--text-primary, #1a1a2e);
	}

	.intensity-value {
		font-size: 2rem;
		font-weight: 700;
		min-width: 3ch;
		text-align: right;
		transition: color 0.2s ease;
	}

	.intensity-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.intensity-bound {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		flex-shrink: 0;
		min-width: 4rem;
	}

	.intensity-bound-low {
		text-align: right;
	}

	.intensity-bound-high {
		text-align: left;
	}

	.intensity-track-container {
		flex: 1;
		position: relative;
		padding: 1rem 0;
	}

	.intensity-input {
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
	.intensity-input::-webkit-slider-thumb {
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

	.intensity-input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.intensity-input::-webkit-slider-thumb:active {
		transform: scale(1.05);
	}

	.intensity-input:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	/* Firefox */
	.intensity-input::-moz-range-thumb {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: white;
		border: 3px solid var(--track-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s ease;
	}

	.intensity-input::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.intensity-input::-moz-range-track {
		height: 8px;
		border-radius: 4px;
	}

	.intensity-input:focus::-moz-range-thumb {
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	/* Reference markers */
	.intensity-markers {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0;
		margin: 0 calc(22px + 0.75rem + 4rem); /* thumb radius + gap + bound width */
	}

	.intensity-marker {
		font-size: 0.875rem;
		font-weight: 500;
		text-align: center;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.intensity-input::-webkit-slider-thumb,
		.intensity-input::-moz-range-thumb,
		.intensity-value {
			transition: none;
		}
	}
</style>
