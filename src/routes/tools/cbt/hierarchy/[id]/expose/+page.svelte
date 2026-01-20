<script lang="ts">
	/**
	 * Log Exposure - Form for logging an exposure attempt
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { AnxietyHierarchyItem } from '$lib/db/types';

	import ExposureLogForm from '$lib/components/cbt/ExposureLogForm.svelte';

	let item = $state<AnxietyHierarchyItem | null>(null);
	let isLoading = $state(true);
	let notFound = $state(false);

	// Load item
	onMount(async () => {
		if (!browser) return;

		const id = parseInt($page.params.id);
		if (isNaN(id)) {
			notFound = true;
			isLoading = false;
			return;
		}

		try {
			const loadedItem = await db.anxietyHierarchy.get(id);
			if (loadedItem) {
				item = loadedItem;
			} else {
				notFound = true;
			}
		} catch (error) {
			console.error('Failed to load hierarchy item:', error);
			notFound = true;
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Log Exposure - Myndness</title>
</svelte:head>

<div class="page-container">
	{#if isLoading}
		<!-- Loading state -->
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Loading...</p>
		</div>
	{:else if notFound || !item}
		<!-- Not found -->
		<div class="not-found">
			<div class="not-found-icon">📊</div>
			<h2 class="not-found-title">Hierarchy Item Not Found</h2>
			<p class="not-found-description">
				This item doesn't exist or has been deleted.
			</p>
			<a href="{base}/tools/cbt/hierarchy" class="btn-primary">Back to Hierarchy</a>
		</div>
	{:else}
		<!-- Header -->
		<div class="page-header">
			<a href="{base}/tools/cbt/hierarchy/{item.id}" class="back-button" aria-label="Back to detail">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</a>
			<h1 class="page-title">Log Exposure</h1>
		</div>

		<ExposureLogForm {item} />
	{/if}
</div>

<style>
	.page-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 1rem;
		min-height: 400px;
	}

	/* Loading state */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		gap: 1rem;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #e4e4e7;
		border-top-color: #7c3aed;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-state p {
		font-size: 1rem;
		color: #52525b;
	}

	/* Not found */
	.not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		gap: 1rem;
	}

	.not-found-icon {
		font-size: 4rem;
		line-height: 1;
	}

	.not-found-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.not-found-description {
		font-size: 1rem;
		color: #52525b;
		max-width: 400px;
	}

	/* Header */
	.page-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.back-button {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: white;
		border: 2px solid #e4e4e7;
		color: #52525b;
		text-decoration: none;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.back-button:hover {
		background: #f4f4f5;
		border-color: #d4d4d8;
	}

	.back-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	/* Button */
	.btn-primary {
		min-height: 44px;
		padding: 0 1.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: #7c3aed;
		border: none;
		border-radius: 8px;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary:hover {
		background: #6d28d9;
		box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.loading-spinner {
			animation: none;
		}

		.back-button,
		.btn-primary {
			transition: none;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.page-container {
			padding: 0.5rem;
		}
	}
</style>
