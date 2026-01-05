<script lang="ts">
	/**
	 * GroundingStep - Individual step of the 5-4-3-2-1 grounding exercise
	 *
	 * Each step focuses on one sense with a specific count.
	 * Designed for ADHD: one task per screen, clear progress, no time pressure.
	 */

	interface Props {
		sense: 'see' | 'touch' | 'hear' | 'smell' | 'taste';
		count: number;
		stepNumber: number;
		totalSteps: number;
		onComplete: () => void;
	}

	let { sense, count, stepNumber, totalSteps, onComplete }: Props = $props();

	// Track user's responses (optional - just for engagement)
	let responses = $state<string[]>(Array(count).fill(''));
	let currentItem = $state(0);

	// Sense configuration
	const senseConfig = {
		see: {
			icon: '👁️',
			prompt: 'Look around you',
			verb: 'you can see',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
			examples: ['a window', 'a plant', 'something blue', 'a shadow', 'a texture']
		},
		touch: {
			icon: '✋',
			prompt: 'Notice what you can feel',
			verb: 'you can touch or feel',
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
			examples: ['your feet on the floor', 'fabric against your skin', 'air temperature', 'chair beneath you']
		},
		hear: {
			icon: '👂',
			prompt: 'Listen carefully',
			verb: 'you can hear',
			color: 'text-green-600',
			bgColor: 'bg-green-50',
			examples: ['distant sounds', 'your breathing', 'air moving', 'nearby noises']
		},
		smell: {
			icon: '👃',
			prompt: 'Take a slow breath',
			verb: 'you can smell',
			color: 'text-amber-600',
			bgColor: 'bg-amber-50',
			examples: ['the air', 'something familiar', 'nothing (and that\'s okay!)']
		},
		taste: {
			icon: '👅',
			prompt: 'Notice your mouth',
			verb: 'you can taste',
			color: 'text-rose-600',
			bgColor: 'bg-rose-50',
			examples: ['your last drink', 'your tongue on your teeth', 'nothing specific']
		}
	};

	let config = $derived(senseConfig[sense]);

	// Progress through items one at a time
	function nextItem() {
		if (currentItem < count - 1) {
			currentItem++;
		} else {
			onComplete();
		}
	}

	// Skip to complete (no guilt - exit always available)
	function skipRemaining() {
		onComplete();
	}
</script>

<div class="flex flex-col h-full">
	<!-- Progress indicator -->
	<div class="flex justify-center gap-2 mb-6">
		{#each Array(totalSteps) as _, i}
			<div
				class="w-3 h-3 rounded-full transition-colors"
				class:bg-primary-500={i < stepNumber}
				class:bg-primary-200={i === stepNumber}
				class:bg-gray-200={i > stepNumber}
			></div>
		{/each}
	</div>

	<!-- Step header -->
	<div class="text-center mb-8">
		<span class="text-sm text-gray-500 uppercase tracking-wide">
			Step {stepNumber} of {totalSteps}
		</span>
	</div>

	<!-- Main content -->
	<div class="flex-1 flex flex-col items-center justify-center text-center px-4">
		<!-- Icon -->
		<div class="text-6xl mb-4" role="img" aria-hidden="true">
			{config.icon}
		</div>

		<!-- Count and sense -->
		<h2 class="text-3xl font-bold text-gray-900 mb-2">
			{count - currentItem} thing{count - currentItem !== 1 ? 's' : ''}
		</h2>
		<p class="text-xl text-gray-600 mb-6">
			{config.prompt}. Name something {config.verb}.
		</p>

		<!-- Progress dots for current step -->
		<div class="flex gap-2 mb-8">
			{#each Array(count) as _, i}
				<div
					class="w-4 h-4 rounded-full transition-all duration-300"
					class:bg-primary-500={i < currentItem}
					class:bg-primary-300={i === currentItem}
					class:bg-gray-200={i > currentItem}
					class:scale-125={i === currentItem}
				></div>
			{/each}
		</div>

		<!-- Hint -->
		<p class="text-sm text-gray-400 italic mb-8">
			For example: "{config.examples[Math.min(currentItem, config.examples.length - 1)]}"
		</p>

		<!-- Continue button -->
		<button
			onclick={nextItem}
			class="btn-primary text-lg px-8 py-4 min-h-[56px]"
		>
			{currentItem < count - 1 ? 'Found one - Next' : 'Done with this step'}
		</button>
	</div>

	<!-- Skip option (always available, no guilt) -->
	<div class="text-center mt-6">
		<button
			onclick={skipRemaining}
			class="text-sm text-gray-400 hover:text-gray-600 transition-colors"
		>
			Skip to next sense
		</button>
	</div>
</div>
