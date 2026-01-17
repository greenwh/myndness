<script lang="ts">
	/**
	 * Thinking Traps Guide - Reference for cognitive distortions
	 */

	import { base } from '$app/paths';
	import DistortionReference from '$lib/components/cbt/DistortionReference.svelte';
</script>

<svelte:head>
	<title>Thinking Traps Guide - Myndness</title>
</svelte:head>

<div class="distortions-page">
	<div class="page-header">
		<a href="{base}/tools/cbt" class="back-link">
			← Back to CBT Tools
		</a>
	</div>

	<DistortionReference />
</div>

<style>
	.distortions-page {
		min-height: 100vh;
		background: #fafafa;
		padding: 1.5rem 1rem;
	}

	.page-header {
		max-width: 48rem;
		margin: 0 auto 1.5rem;
	}

	.back-link {
		display: inline-block;
		font-size: 1rem;
		color: var(--text-secondary, #52525b);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
		min-height: 44px;
		padding: 0.5rem 0;
	}

	.back-link:hover {
		color: var(--primary-600, #7c3aed);
	}
</style>
