<script lang="ts">
	import { base } from '$app/paths';
	import MindfulnessTimer from '$lib/components/mindfulness/MindfulnessTimer.svelte';
</script>

<svelte:head>
	<title>Meditation Timer - Myndness</title>
</svelte:head>

<div class="timer-page">
	<!-- Header -->
	<header class="page-header">
		<a href="{base}/tools/mindfulness" class="back-link">
			← Back to mindfulness
		</a>
		<h1 class="page-title">Meditation Timer</h1>
	</header>

	<!-- Timer Component -->
	<div class="timer-container">
		<MindfulnessTimer />
	</div>
</div>

<style>
	.timer-page {
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

	.timer-container {
		padding: 2rem 0;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.timer-page {
			padding: 1rem 0.75rem;
		}

		.page-title {
			font-size: 1.25rem;
		}
	}
</style>
