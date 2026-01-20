<script lang="ts">
	/**
	 * Anxiety Hierarchy Hub
	 *
	 * Shows hierarchy list with filter tabs and "Add New Fear" button
	 */

	import { base } from '$app/paths';
	import HierarchyList from '$lib/components/cbt/HierarchyList.svelte';
</script>

<svelte:head>
	<title>Anxiety Hierarchy - Myndness</title>
</svelte:head>

<div class="page-container">
	<!-- Header -->
	<div class="page-header">
		<div class="header-content">
			<a href="{base}/tools/cbt" class="back-button" aria-label="Back to CBT Tools">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</a>
			<div class="header-text">
				<h1 class="page-title">Anxiety Hierarchy</h1>
				<p class="page-description">Gradually face your fears with exposure therapy</p>
			</div>
		</div>

		<a href="{base}/tools/cbt/hierarchy/new" class="btn-primary">
			<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/>
			</svg>
			Add New Fear
		</a>
	</div>

	<!-- Info card -->
	<div class="info-card">
		<div class="info-icon">💡</div>
		<div class="info-content">
			<h3 class="info-title">How Exposure Therapy Works</h3>
			<ol class="info-list">
				<li>Create a ladder of feared situations ranked by distress (SUDS 0-100)</li>
				<li>Start with lower-anxiety situations and work your way up</li>
				<li>Face each fear repeatedly until distress decreases (habituation)</li>
				<li>Track your progress with before/during/after distress ratings</li>
				<li>Move to the next level when current distress reaches your target</li>
			</ol>
		</div>
	</div>

	<!-- Hierarchy list -->
	<HierarchyList />
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Header */
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
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

	.header-text {
		flex: 1;
	}

	.page-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1a1a2e;
		margin-bottom: 0.25rem;
	}

	.page-description {
		font-size: 1rem;
		color: #52525b;
	}

	/* Button */
	.btn-primary {
		min-height: 44px;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: #7c3aed;
		border: none;
		border-radius: 8px;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.btn-primary:hover {
		background: #6d28d9;
		box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
	}

	.btn-primary:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.btn-icon {
		width: 20px;
		height: 20px;
	}

	/* Info card */
	.info-card {
		background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
		border: 2px solid #60a5fa;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		gap: 1rem;
	}

	.info-icon {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a2e;
		margin-bottom: 0.75rem;
	}

	.info-list {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.info-list li {
		font-size: 1rem;
		color: #1a1a2e;
		line-height: 1.5;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
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

		.page-header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-content {
			width: 100%;
		}

		.btn-primary {
			width: 100%;
			justify-content: center;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.info-card {
			flex-direction: column;
		}
	}
</style>
