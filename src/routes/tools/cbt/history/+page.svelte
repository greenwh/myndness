<script lang="ts">
	/**
	 * Thought Record History - List of all thought records
	 */

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import ThoughtRecordHistory from '$lib/components/cbt/ThoughtRecordHistory.svelte';

	let showNewToast = $state(false);

	onMount(() => {
		// Check for new record completion
		if ($page.url.searchParams.get('new') === 'true') {
			showNewToast = true;
			setTimeout(() => {
				showNewToast = false;
			}, 3000);
		}
	});
</script>

<svelte:head>
	<title>Thought Record History - Myndness</title>
</svelte:head>

<div class="history-page">
	<div class="page-header">
		<h1 class="page-title">Thought Records</h1>
		<a href="{base}/tools/cbt/thought-record" class="btn-primary">
			+ New Record
		</a>
	</div>

	<ThoughtRecordHistory />

	<!-- Success toast -->
	{#if showNewToast}
		<div class="toast toast-success">
			<span class="toast-icon">✓</span>
			<span>Thought record completed</span>
		</div>
	{/if}
</div>

<style>
	.history-page {
		min-height: 100vh;
		background: #fafafa;
	}

	.page-header {
		max-width: 48rem;
		margin: 0 auto;
		padding: 1.5rem 1rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a2e);
	}

	.toast {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-radius: 8px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		font-weight: 500;
		z-index: 100;
		animation: slideUp 0.3s ease;
	}

	.toast-success {
		background: var(--success-500, #22c55e);
		color: white;
	}

	.toast-icon {
		font-size: 1.25rem;
	}

	@keyframes slideUp {
		from {
			transform: translateX(-50%) translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) translateY(0);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toast {
			animation: none;
		}
	}
</style>
