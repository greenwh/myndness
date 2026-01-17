<script lang="ts">
	/**
	 * CBT Tools Hub - Card navigation to all CBT tools
	 */

	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>CBT Tools - Myndness</title>
</svelte:head>

<div class="cbt-hub">
	<header class="hub-header">
		<h1 class="hub-title">CBT Tools</h1>
		<p class="hub-description">
			Cognitive Behavioral Therapy tools to help challenge unhelpful thinking patterns and test beliefs.
		</p>
	</header>

	<div class="tools-grid">
		<!-- Thought Record -->
		<a href="{base}/tools/cbt/thought-record" class="tool-card">
			<div class="tool-icon" style="background-color: #ede9fe">
				<span class="tool-emoji">💭</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Thought Record</h2>
				<p class="tool-description">
					Challenge unhelpful thoughts using a structured 7-step process
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
		<a href="{base}/tools/cbt/history" class="tool-card">
			<div class="tool-icon" style="background-color: #dbeafe">
				<span class="tool-emoji">📋</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">View History</h2>
				<p class="tool-description">
					Review past thought records and track your progress
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

		<!-- Distortions Guide -->
		<a href="{base}/tools/cbt/distortions" class="tool-card">
			<div class="tool-icon" style="background-color: #fef3c7">
				<span class="tool-emoji">🔍</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Thinking Traps Guide</h2>
				<p class="tool-description">
					Learn about common cognitive distortions and how to spot them
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

		<!-- Behavioral Experiments (coming soon) -->
		<div class="tool-card tool-card-disabled">
			<div class="tool-icon" style="background-color: #e4e4e7">
				<span class="tool-emoji">🔬</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Behavioral Experiments</h2>
				<p class="tool-description">
					Test your beliefs with real-world experiments
				</p>
				<span class="coming-soon-badge">Coming Soon</span>
			</div>
		</div>

		<!-- Anxiety Hierarchy (coming soon) -->
		<div class="tool-card tool-card-disabled">
			<div class="tool-icon" style="background-color: #e4e4e7">
				<span class="tool-emoji">📊</span>
			</div>
			<div class="tool-content">
				<h2 class="tool-title">Anxiety Hierarchy</h2>
				<p class="tool-description">
					Build an exposure ladder to gradually face your fears
				</p>
				<span class="coming-soon-badge">Coming Soon</span>
			</div>
		</div>
	</div>

	<!-- Back to tools -->
	<div class="hub-footer">
		<a href="{base}/tools" class="back-link">
			← Back to all tools
		</a>
	</div>
</div>

<style>
	.cbt-hub {
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
