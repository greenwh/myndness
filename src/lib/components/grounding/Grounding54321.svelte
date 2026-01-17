<script lang="ts">
	/**
	 * Grounding54321 - Complete 5-4-3-2-1 grounding exercise
	 *
	 * A sensory awareness technique to interrupt anxiety spirals.
	 * Guides user through identifying:
	 * - 5 things they SEE
	 * - 4 things they can TOUCH
	 * - 3 things they HEAR
	 * - 2 things they SMELL
	 * - 1 thing they TASTE
	 */

	import GroundingStep from './GroundingStep.svelte';

	interface Props {
		onComplete?: () => void;
		onExit?: () => void;
	}

	let { onComplete, onExit }: Props = $props();

	// Exercise state
	type Stage = 'intro' | 'exercise' | 'complete';
	let stage = $state<Stage>('intro');
	let currentStep = $state(0);

	// Define the 5-4-3-2-1 steps
	const steps: Array<{ sense: 'see' | 'touch' | 'hear' | 'smell' | 'taste'; count: number }> = [
		{ sense: 'see', count: 5 },
		{ sense: 'touch', count: 4 },
		{ sense: 'hear', count: 3 },
		{ sense: 'smell', count: 2 },
		{ sense: 'taste', count: 1 }
	];

	function startExercise() {
		stage = 'exercise';
		currentStep = 0;
	}

	function handleStepComplete() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			stage = 'complete';
		}
	}

	function handleComplete() {
		onComplete?.();
	}

	function handleExit() {
		onExit?.();
	}

	function restartExercise() {
		stage = 'intro';
		currentStep = 0;
	}
</script>

<div class="flex flex-col min-h-[60vh]">
	{#if stage === 'intro'}
		<!-- Introduction -->
		<div class="flex-1 flex flex-col items-center justify-center text-center px-4">
			<div class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
				<span class="text-4xl" role="img" aria-label="Grounding">🌿</span>
			</div>

			<h2 class="text-2xl font-bold text-gray-900 mb-3">
				5-4-3-2-1 Grounding
			</h2>

			<p class="text-gray-600 mb-2 max-w-sm">
				This exercise helps bring you back to the present moment by focusing on your senses.
			</p>

			<p class="text-sm text-gray-500 mb-8 max-w-sm">
				Take your time. There's no rush, and you can stop anytime.
			</p>

			<!-- How it works -->
			<div class="w-full max-w-xs space-y-2 mb-8 text-left">
				<div class="flex items-center gap-3 p-2">
					<span class="text-2xl">👁️</span>
					<span class="text-gray-700">5 things you can <strong>see</strong></span>
				</div>
				<div class="flex items-center gap-3 p-2">
					<span class="text-2xl">✋</span>
					<span class="text-gray-700">4 things you can <strong>touch</strong></span>
				</div>
				<div class="flex items-center gap-3 p-2">
					<span class="text-2xl">👂</span>
					<span class="text-gray-700">3 things you can <strong>hear</strong></span>
				</div>
				<div class="flex items-center gap-3 p-2">
					<span class="text-2xl">👃</span>
					<span class="text-gray-700">2 things you can <strong>smell</strong></span>
				</div>
				<div class="flex items-center gap-3 p-2">
					<span class="text-2xl">👅</span>
					<span class="text-gray-700">1 thing you can <strong>taste</strong></span>
				</div>
			</div>

			<button
				onclick={startExercise}
				class="btn-primary text-lg px-8 py-4 min-h-[56px]"
			>
				Begin Exercise
			</button>
		</div>

		<!-- Exit option -->
		<div class="text-center mt-6">
			<button
				onclick={handleExit}
				class="text-sm text-gray-400 hover:text-gray-600 transition-colors"
			>
				Not right now
			</button>
		</div>

	{:else if stage === 'exercise'}
		<!-- Exercise steps -->
		{#key currentStep}
			<GroundingStep
				sense={steps[currentStep].sense}
				count={steps[currentStep].count}
				stepNumber={currentStep + 1}
				totalSteps={steps.length}
				onComplete={handleStepComplete}
			/>
		{/key}

		<!-- Exit option -->
		<div class="text-center mt-4">
			<button
				onclick={handleExit}
				class="text-sm text-gray-400 hover:text-gray-600 transition-colors"
			>
				I'm feeling better
			</button>
		</div>

	{:else if stage === 'complete'}
		<!-- Completion -->
		<div class="flex-1 flex flex-col items-center justify-center text-center px-4">
			<div class="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center mb-6">
				<svg class="w-12 h-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>

			<h2 class="text-2xl font-bold text-gray-900 mb-3">
				Well done
			</h2>

			<p class="text-gray-600 mb-8 max-w-sm">
				You've completed the grounding exercise. Take a moment to notice how you're feeling now.
			</p>

			<div class="flex flex-col gap-3 w-full max-w-xs">
				<button onclick={handleComplete} class="btn-primary">
					I'm ready to continue
				</button>
				<button onclick={restartExercise} class="btn-secondary">
					Do it again
				</button>
			</div>
		</div>
	{/if}
</div>
