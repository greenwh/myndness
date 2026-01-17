<script lang="ts">
	/**
	 * ProgressSteps - Visual step indicator for multi-step forms
	 *
	 * Features:
	 * - Shows current step number and total steps
	 * - Visual dots for each step
	 * - Optional step labels
	 * - Accessible with ARIA labels
	 */

	interface Props {
		currentStep: number;
		totalSteps: number;
		stepLabels?: string[];
	}

	let { currentStep, totalSteps, stepLabels }: Props = $props();

	const steps = $derived(Array.from({ length: totalSteps }, (_, i) => i + 1));
</script>

<div class="progress-steps" role="navigation" aria-label="Form progress">
	<!-- Text indicator -->
	<div class="step-text">
		<span class="step-current" aria-current="step">Step {currentStep}</span>
		<span class="step-divider">/</span>
		<span class="step-total">{totalSteps}</span>
	</div>

	<!-- Visual dots -->
	<div class="step-dots" role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={currentStep}>
		{#each steps as step}
			<div
				class="step-dot"
				class:step-dot-completed={step < currentStep}
				class:step-dot-current={step === currentStep}
				aria-label={stepLabels?.[step - 1] || `Step ${step}`}
			>
				{#if step < currentStep}
					<svg
						class="step-check"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<span class="step-number">{step}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.progress-steps {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0;
	}

	.step-text {
		text-align: center;
		font-size: 1.125rem;
		color: var(--text-secondary, #52525b);
	}

	.step-current {
		font-weight: 600;
		color: var(--primary-600, #7c3aed);
	}

	.step-divider {
		margin: 0 0.5rem;
	}

	.step-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		align-items: center;
	}

	.step-dot {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #e4e4e7;
		color: #a1a1aa;
		font-weight: 500;
		font-size: 0.875rem;
		transition: all 0.3s ease;
	}

	.step-dot-current {
		background-color: var(--primary-600, #7c3aed);
		color: white;
		transform: scale(1.2);
		box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
	}

	.step-dot-completed {
		background-color: var(--success-500, #22c55e);
		color: white;
	}

	.step-check {
		width: 1.25rem;
		height: 1.25rem;
	}

	.step-number {
		line-height: 1;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.step-dot {
			transition: none;
		}
		.step-dot-current {
			transform: none;
		}
	}
</style>
