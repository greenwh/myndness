<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import BreathAwareness from '$lib/components/mindfulness/BreathAwareness.svelte';

	function handleComplete() {
		// Return to mindfulness hub on completion
		goto(`${base}/tools/mindfulness`);
	}

	function handleExit() {
		// Return to mindfulness hub on exit
		goto(`${base}/tools/mindfulness`);
	}
</script>

<svelte:head>
	<title>Breath Awareness - Myndness</title>
</svelte:head>

<div class="breath-page">
	<!-- Header -->
	<header class="page-header">
		<a href="{base}/tools/mindfulness" class="back-link">
			← Back to mindfulness
		</a>
		<h1 class="page-title">Breath Awareness</h1>
	</header>

	<!-- Practice Component -->
	<div class="practice-container">
		<BreathAwareness durationMinutes={5} onComplete={handleComplete} onExit={handleExit} />
	</div>
</div>

<style>
	.breath-page {
		max-width: 42rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		min-height: 100vh;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
		min-height: 44px;
		padding: 0.5rem 0;
		margin-bottom: 0.5rem;
	}

	.back-link:hover {
		color: var(--primary-600, #7c3aed);
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a2e);
	}

	.practice-container {
		padding: 1rem 0;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.breath-page {
			padding: 1rem 0.75rem;
		}

		.page-title {
			font-size: 1.25rem;
		}
	}
</style>
