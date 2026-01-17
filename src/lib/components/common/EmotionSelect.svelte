<script lang="ts">
	/**
	 * EmotionSelect - Emotion picker with intensity slider
	 *
	 * Features:
	 * - Grid of emotion buttons (44px minimum)
	 * - Optional "other" text input
	 * - Integrated intensity slider (0-100)
	 * - Reusable in thought record steps 3 & 7
	 */

	import type { EmotionType } from '$lib/db/types';
	import IntensitySlider from './IntensitySlider.svelte';

	interface Props {
		emotion: EmotionType;
		emotionOther?: string;
		intensity: number;
		label: string;
		intensityLabel?: string;
		onchange?: (emotion: EmotionType, emotionOther: string | undefined, intensity: number) => void;
	}

	let {
		emotion = $bindable<EmotionType>('anxious'),
		emotionOther = $bindable<string | undefined>(undefined),
		intensity = $bindable(50),
		label,
		intensityLabel = 'How intense is this feeling?',
		onchange
	}: Props = $props();

	const emotions: Array<{ value: EmotionType; label: string; emoji: string }> = [
		{ value: 'anxious', label: 'Anxious', emoji: '😰' },
		{ value: 'sad', label: 'Sad', emoji: '😢' },
		{ value: 'angry', label: 'Angry', emoji: '😠' },
		{ value: 'guilty', label: 'Guilty', emoji: '😔' },
		{ value: 'ashamed', label: 'Ashamed', emoji: '😳' },
		{ value: 'frustrated', label: 'Frustrated', emoji: '😤' },
		{ value: 'hopeless', label: 'Hopeless', emoji: '😞' },
		{ value: 'overwhelmed', label: 'Overwhelmed', emoji: '😫' },
		{ value: 'fearful', label: 'Fearful', emoji: '😨' },
		{ value: 'other', label: 'Other', emoji: '🤔' }
	];

	function handleEmotionSelect(newEmotion: EmotionType) {
		emotion = newEmotion;
		if (newEmotion !== 'other') {
			emotionOther = undefined;
		}
		onchange?.(emotion, emotionOther, intensity);
	}

	function handleOtherChange(event: Event) {
		const target = event.target as HTMLInputElement;
		emotionOther = target.value;
		onchange?.(emotion, emotionOther, intensity);
	}

	function handleIntensityChange(newIntensity: number) {
		intensity = newIntensity;
		onchange?.(emotion, emotionOther, intensity);
	}
</script>

<div class="emotion-select">
	<div class="emotion-select-label" role="heading" aria-level="2">{label}</div>

	<!-- Emotion grid -->
	<div class="emotion-grid">
		{#each emotions as emotionOption}
			<button
				type="button"
				class="emotion-button"
				class:emotion-button-selected={emotion === emotionOption.value}
				onclick={() => handleEmotionSelect(emotionOption.value)}
				aria-pressed={emotion === emotionOption.value}
			>
				<span class="emotion-emoji" aria-hidden="true">{emotionOption.emoji}</span>
				<span class="emotion-label-text">{emotionOption.label}</span>
			</button>
		{/each}
	</div>

	<!-- Other emotion input -->
	{#if emotion === 'other'}
		<div class="emotion-other">
			<label for="emotion-other-input" class="sr-only">Describe your emotion</label>
			<input
				id="emotion-other-input"
				type="text"
				placeholder="Describe how you're feeling..."
				value={emotionOther || ''}
				oninput={handleOtherChange}
				class="emotion-other-input"
			/>
		</div>
	{/if}

	<!-- Intensity slider -->
	<div class="emotion-intensity">
		<IntensitySlider
			bind:value={intensity}
			id="emotion-intensity-slider"
			label={intensityLabel}
			lowLabel="Mild"
			highLabel="Extreme"
			onchange={handleIntensityChange}
		/>
	</div>
</div>

<style>
	.emotion-select {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.emotion-select-label {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--text-primary, #1a1a2e);
	}

	.emotion-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.emotion-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem 0.5rem;
		min-height: 88px;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		gap: 0.5rem;
	}

	.emotion-button:hover {
		border-color: var(--primary-400, #a78bfa);
		background: var(--primary-50, #faf5ff);
	}

	.emotion-button:focus {
		outline: none;
		border-color: var(--primary-600, #7c3aed);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.emotion-button-selected {
		border-color: var(--primary-600, #7c3aed);
		background: var(--primary-100, #ede9fe);
		box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
	}

	.emotion-emoji {
		font-size: 2rem;
		line-height: 1;
	}

	.emotion-label-text {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary, #1a1a2e);
	}

	.emotion-other {
		margin-top: -0.5rem;
	}

	.emotion-other-input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		transition: border-color 0.2s ease;
	}

	.emotion-other-input:focus {
		outline: none;
		border-color: var(--primary-600, #7c3aed);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.emotion-intensity {
		margin-top: 0.5rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.emotion-button {
			transition: none;
		}
	}
</style>
