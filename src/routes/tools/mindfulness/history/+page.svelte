<script lang="ts">
	import { base } from '$app/paths';
	import MindfulnessHistory from '$lib/components/mindfulness/MindfulnessHistory.svelte';
</script>

<svelte:head>
	<title>Mindfulness History - Myndness</title>
</svelte:head>

<div class="history-page">
	<!-- Header -->
	<header class="page-header">
		<a href="{base}/tools/mindfulness" class="back-link">
			← Back to mindfulness
		</a>
		<h1 class="page-title">Mindfulness History</h1>
		<p class="page-description">Your meditation practice over the last 30 days</p>
	</header>

	<!-- History Component -->
	<div class="history-container">
		<MindfulnessHistory />
	</div>
</div>

<style>
	.history-page {
		max-width: 56rem;
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
		margin-bottom: 0.5rem;
	}

	.page-description {
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
	}

	.history-container {
		padding: 1rem 0;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.history-page {
			padding: 1rem 0.75rem;
		}

		.page-title {
			font-size: 1.25rem;
		}

		.page-description {
			font-size: 0.875rem;
		}
	}
</style>
