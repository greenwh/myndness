<script lang="ts">
	/**
	 * Behavioral Experiments Hub
	 *
	 * Shows experiment history with filter tabs and "Create New" button
	 */

	import { base } from '$app/paths';
	import BehavioralExperimentHistory from '$lib/components/cbt/BehavioralExperimentHistory.svelte';
</script>

<svelte:head>
	<title>Behavioral Experiments - Myndness</title>
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
				<h1 class="page-title">Behavioral Experiments</h1>
				<p class="page-description">Test your beliefs with real-world evidence</p>
			</div>
		</div>

		<a href="{base}/tools/cbt/experiment/new" class="btn-primary">
			<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/>
			</svg>
			New Experiment
		</a>
	</div>

	<!-- Info card -->
	<div class="info-card">
		<div class="info-icon">💡</div>
		<div class="info-content">
			<h3 class="info-title">How Behavioral Experiments Work</h3>
			<ol class="info-list">
				<li>Identify a specific belief that causes you anxiety or distress</li>
				<li>Design a safe experiment to test whether the belief is accurate</li>
				<li>Make a prediction about what will happen</li>
				<li>Do the experiment and record what actually happens</li>
				<li>Compare your prediction with reality and update your belief</li>
			</ol>
		</div>
	</div>

	<!-- Experiment history -->
	<BehavioralExperimentHistory />
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
		background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%);
		border: 2px solid #fbbf24;
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
