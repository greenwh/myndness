<script lang="ts">
	/**
	 * Mindfulness Hub - Card navigation to all mindfulness tools
	 */

	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Mindfulness - Myndness</title>
</svelte:head>

<div class="mindfulness-hub">
	<header class="hub-header">
		<h1 class="hub-title">Mindfulness</h1>
		<p class="hub-description">
			Guided practices to build present-moment awareness, reduce stress, and cultivate calm.
		</p>
	</header>

	<div class="tools-grid">
		<!-- Meditation Timer -->
		<a href="{base}/tools/mindfulness/timer" class="tool-card">
			<div class="tool-icon" style="background-color: #dbeafe">
				<span class="tool-emoji">⏱️</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Meditation Timer</h2>
				<p class="tool-description">
					Silent timer for unguided meditation practice (3-20 minutes)
				</p>
			</div>
			<svg
				class="tool-chevron"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>

		<!-- Breath Awareness -->
		<a href="{base}/tools/mindfulness/breath" class="tool-card">
			<div class="tool-icon" style="background-color: #dcfce7">
				<span class="tool-emoji">🌬️</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Breath Awareness</h2>
				<p class="tool-description">
					Guided practice focusing attention on the natural breath (5 minutes)
				</p>
			</div>
			<svg
				class="tool-chevron"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>

		<!-- Body Scan -->
		<a href="{base}/tools/mindfulness/body-scan" class="tool-card">
			<div class="tool-icon" style="background-color: #fae8ff">
				<span class="tool-emoji">🧘</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Body Scan</h2>
				<p class="tool-description">
					Progressive relaxation through body awareness (5 or 15 minutes)
				</p>
			</div>
			<svg
				class="tool-chevron"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>

		<!-- History -->
		<a href="{base}/tools/mindfulness/history" class="tool-card">
			<div class="tool-icon" style="background-color: #dbeafe">
				<span class="tool-emoji">📋</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">View History</h2>
				<p class="tool-description">
					Review past meditation sessions and track your practice
				</p>
			</div>
			<svg
				class="tool-chevron"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>
	</div>

	<!-- Back to tools -->
	<div class="hub-footer">
		<a href="{base}/tools" class="back-link">
			← Back to all tools
		</a>
	</div>
</div>

<style>
	.mindfulness-hub {
		max-width: 56rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		min-height: 100vh;
	}

	.hub-header {
		margin-bottom: 2rem;
	}

	.hub-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.5rem;
	}

	.hub-description {
		font-size: 1.125rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.6;
		max-width: 42rem;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.tool-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.2s ease;
		min-height: 88px;
	}

	.tool-card:not(.tool-card-disabled):hover {
		border-color: var(--primary-400, #a78bfa);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transform: translateY(-2px);
	}

	.tool-card-disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.tool-icon {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.tool-emoji {
		font-size: 2rem;
	}

	.tool-content {
		flex: 1;
		min-width: 0;
		position: relative;
	}

	.tool-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1a1a2e);
		margin-bottom: 0.25rem;
	}

	.tool-description {
		font-size: 0.875rem;
		color: var(--text-secondary, #52525b);
		line-height: 1.4;
	}

	.coming-soon-badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--warning-700, #a16207);
		background: var(--warning-100, #fef3c7);
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		margin-top: 0.5rem;
	}

	.tool-chevron {
		width: 1.5rem;
		height: 1.5rem;
		color: var(--text-muted, #a1a1aa);
		flex-shrink: 0;
	}

	.hub-footer {
		padding-top: 2rem;
		border-top: 1px solid #e4e4e7;
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

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.tool-card {
			transition: none;
		}
	}
</style>
