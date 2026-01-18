<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BodyScan from '$lib/components/mindfulness/BodyScan.svelte';

	// Get duration from URL query param (default to 'short')
	let duration = $derived(
		($page.url.searchParams.get('duration') as 'short' | 'full') || 'short'
	);

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
	<title>Body Scan - Myndness</title>
</svelte:head>

<div class="body-scan-page">
	<!-- Header -->
	<header class="page-header">
		<a href="{base}/tools/mindfulness" class="back-link">
			← Back to mindfulness
		</a>
		<h1 class="page-title">Body Scan</h1>
	</header>

	<!-- Duration selector -->
	<div class="duration-selector">
		<a
			href="{base}/tools/mindfulness/body-scan?duration=short"
			class="duration-btn"
			class:active={duration === 'short'}
		>
			Short (5 min)
		</a>
		<a
			href="{base}/tools/mindfulness/body-scan?duration=full"
			class="duration-btn"
			class:active={duration === 'full'}
		>
			Full (15 min)
		</a>
	</div>

	<!-- Practice Component -->
	<div class="practice-container">
		{#key duration}
			<BodyScan {duration} onComplete={handleComplete} onExit={handleExit} />
		{/key}
	</div>
</div>

<style>
	.body-scan-page {
		max-width: 42rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		min-height: 100vh;
	}

	.page-header {
		margin-bottom: 1rem;
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

	.duration-selector {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		justify-content: center;
	}

	.duration-btn {
		padding: 0.75rem 1.5rem;
		border: 2px solid #e4e4e7;
		border-radius: 0.5rem;
		background: white;
		color: var(--text-secondary, #52525b);
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s ease;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.duration-btn:hover {
		border-color: var(--primary-400, #a78bfa);
		background: var(--primary-50, #faf5ff);
	}

	.duration-btn.active {
		border-color: var(--primary-600, #7c3aed);
		background: var(--primary-50, #faf5ff);
		color: var(--primary-700, #6d28d9);
	}

	.practice-container {
		padding: 1rem 0;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.body-scan-page {
			padding: 1rem 0.75rem;
		}

		.page-title {
			font-size: 1.25rem;
		}

		.duration-btn {
			font-size: 0.875rem;
			padding: 0.625rem 1.25rem;
		}
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.duration-btn {
			transition: none;
		}
	}
</style>
