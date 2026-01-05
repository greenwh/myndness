<script lang="ts">
	/**
	 * Crisis Flow Page
	 *
	 * A guided flow for acute anxiety moments.
	 * Connects breathing → grounding exercises with gentle transitions.
	 * Accessible via the floating AnxietyHelpButton.
	 */

	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import BreathingTimer from '$lib/components/breathing/BreathingTimer.svelte';
	import Grounding54321 from '$lib/components/grounding/Grounding54321.svelte';

	// Flow stages
	type Stage = 'select' | 'breathing' | 'breathing-done' | 'grounding' | 'complete';
	let stage = $state<Stage>('select');

	// Track what exercises were done
	let didBreathing = $state(false);
	let didGrounding = $state(false);

	// Stage handlers
	function startBreathing() {
		stage = 'breathing';
	}

	function startGrounding() {
		stage = 'grounding';
	}

	function handleBreathingComplete() {
		didBreathing = true;
		stage = 'breathing-done';
	}

	function handleBreathingExit() {
		didBreathing = true;
		stage = 'breathing-done';
	}

	function handleGroundingComplete() {
		didGrounding = true;
		stage = 'complete';
	}

	function handleGroundingExit() {
		didGrounding = true;
		stage = 'complete';
	}

	function handleDone() {
		goto(base + '/');
	}

	function goBack() {
		if (stage === 'breathing' || stage === 'grounding') {
			stage = 'select';
		} else if (stage === 'breathing-done') {
			stage = 'select';
		} else {
			goto(base + '/');
		}
	}
</script>

<svelte:head>
	<title>Anxiety Help - Myndness</title>
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-10rem)]">
	{#if stage === 'select'}
		<!-- Tool Selection -->
		<header class="text-center mb-8">
			<h1 class="text-2xl font-semibold text-gray-900 mb-2">What would help right now?</h1>
			<p class="text-gray-600 max-w-xs mx-auto">
				Take your time. Pick whatever feels right.
			</p>
		</header>

		<div class="flex-1 flex flex-col items-center justify-center gap-4 max-w-sm mx-auto w-full">
			<!-- Breathing option -->
			<button
				onclick={startBreathing}
				class="card card-hover p-6 w-full text-left flex items-start gap-4"
			>
				<div class="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-1">4-7-8 Breathing</h3>
					<p class="text-sm text-gray-600">
						Slow, paced breathing to calm your nervous system.
					</p>
					{#if didBreathing}
						<span class="inline-block mt-2 text-xs text-success-600 bg-success-50 px-2 py-1 rounded">
							Completed
						</span>
					{/if}
				</div>
			</button>

			<!-- Grounding option -->
			<button
				onclick={startGrounding}
				class="card card-hover p-6 w-full text-left flex items-start gap-4"
			>
				<div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
					<span class="text-2xl">🌿</span>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900 mb-1">5-4-3-2-1 Grounding</h3>
					<p class="text-sm text-gray-600">
						Use your senses to reconnect with the present.
					</p>
					{#if didGrounding}
						<span class="inline-block mt-2 text-xs text-success-600 bg-success-50 px-2 py-1 rounded">
							Completed
						</span>
					{/if}
				</div>
			</button>

			<!-- I'm okay button -->
			<button
				onclick={handleDone}
				class="btn-ghost mt-4"
			>
				I'm feeling okay now
			</button>
		</div>

		<!-- Back link -->
		<div class="text-center mt-6">
			<a href="{base}/" class="text-sm text-gray-500 hover:text-gray-700">
				← Back to home
			</a>
		</div>

	{:else if stage === 'breathing'}
		<!-- Breathing Exercise -->
		<header class="text-center mb-6">
			<h1 class="text-2xl font-semibold text-gray-900 mb-2">4-7-8 Breathing</h1>
			<p class="text-gray-600 max-w-xs mx-auto">
				Let this breathing pattern calm your body.
			</p>
		</header>

		<div class="flex-1 flex items-center justify-center">
			<BreathingTimer
				onComplete={handleBreathingComplete}
				onExit={handleBreathingExit}
			/>
		</div>

		<div class="text-center mt-6">
			<button onclick={goBack} class="text-sm text-gray-500 hover:text-gray-700">
				← Try something else
			</button>
		</div>

	{:else if stage === 'breathing-done'}
		<!-- Post-breathing check -->
		<div class="flex-1 flex flex-col items-center justify-center text-center px-4">
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

			<h2 class="text-2xl font-semibold text-gray-900 mb-2">How are you feeling?</h2>
			<p class="text-gray-600 mb-8 max-w-xs">
				You've done some breathing. Would you like to try grounding, or are you ready to continue?
			</p>

			<div class="flex flex-col gap-3 w-full max-w-xs">
				<button onclick={handleDone} class="btn-primary">
					I'm feeling better
				</button>
				<button onclick={startGrounding} class="btn-secondary">
					Try grounding exercise
				</button>
				<button onclick={() => stage = 'select'} class="btn-ghost">
					See other options
				</button>
			</div>
		</div>

	{:else if stage === 'grounding'}
		<!-- Grounding Exercise -->
		<div class="flex-1">
			<Grounding54321
				onComplete={handleGroundingComplete}
				onExit={handleGroundingExit}
			/>
		</div>

		<div class="text-center mt-4">
			<button onclick={goBack} class="text-sm text-gray-500 hover:text-gray-700">
				← Try something else
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
				You've taken good care of yourself
			</h2>

			<p class="text-gray-600 mb-8 max-w-sm">
				{#if didBreathing && didGrounding}
					You completed both breathing and grounding exercises.
				{:else if didGrounding}
					You completed the grounding exercise.
				{:else}
					You completed the breathing exercise.
				{/if}
				Take a moment to notice how you're feeling now.
			</p>

			<div class="flex flex-col gap-3 w-full max-w-xs">
				<button onclick={handleDone} class="btn-primary">
					Back to home
				</button>
				<button onclick={() => stage = 'select'} class="btn-secondary">
					Do another exercise
				</button>
			</div>
		</div>
	{/if}
</div>
