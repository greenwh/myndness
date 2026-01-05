<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import BreathingTimer from '$lib/components/breathing/BreathingTimer.svelte';

	// State for post-exercise check-in
	let exerciseCompleted = $state(false);

	function handleComplete() {
		exerciseCompleted = true;
	}

	function handleExit() {
		// User chose to exit early - that's totally fine!
		goto(base + '/');
	}

	function handleFeelingBetter() {
		goto(base + '/');
	}

	function handleTryAgain() {
		exerciseCompleted = false;
	}
</script>

<svelte:head>
	<title>4-7-8 Breathing - Myndness</title>
</svelte:head>

<div class="flex flex-col items-center min-h-[calc(100vh-10rem)]">
	{#if !exerciseCompleted}
		<!-- Header -->
		<header class="text-center mb-8">
			<h1 class="text-2xl font-semibold text-gray-900 mb-2">4-7-8 Breathing</h1>
			<p class="text-gray-600 max-w-xs">
				A calming technique that helps reduce anxiety by activating your body's relaxation response.
			</p>
		</header>

		<!-- Breathing Timer -->
		<div class="flex-1 flex items-center">
			<BreathingTimer onComplete={handleComplete} onExit={handleExit} />
		</div>

		<!-- Info -->
		<div class="mt-8 text-center text-sm text-gray-500 max-w-xs">
			<p>You can stop anytime. There's no wrong way to do this.</p>
		</div>
	{:else}
		<!-- Post-exercise check-in -->
		<div class="flex-1 flex flex-col items-center justify-center text-center">
			<div class="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-6">
				<svg class="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>

			<h2 class="text-2xl font-semibold text-gray-900 mb-2">Nice work!</h2>
			<p class="text-gray-600 mb-8 max-w-xs">
				You completed 4 rounds of breathing. How are you feeling now?
			</p>

			<div class="flex flex-col gap-3 w-full max-w-xs">
				<button onclick={handleFeelingBetter} class="btn-primary">
					Feeling better
				</button>
				<button onclick={handleTryAgain} class="btn-secondary">
					I'd like to do more
				</button>
				<a href="{base}/tools" class="btn-ghost">
					Try something else
				</a>
			</div>
		</div>
	{/if}

	<!-- Back link -->
	<div class="mt-6">
		<a href="{base}/" class="text-sm text-gray-500 hover:text-gray-700">
			← Back to home
		</a>
	</div>
</div>
