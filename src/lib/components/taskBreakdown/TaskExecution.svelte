<!-- src/lib/components/taskBreakdown/TaskExecution.svelte -->
<!-- Step-by-step task execution view - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { TaskBreakdown } from '$lib/db/types';
	import VisualTimer from '$lib/components/time/VisualTimer.svelte';

	interface Props {
		breakdownId: number;
	}

	let { breakdownId }: Props = $props();

	let breakdown = $state<TaskBreakdown | undefined>(undefined);
	let loading = $state(true);
	let showTimer = $state(false);
	let visualTimerRef = $state<VisualTimer | null>(null);
	let timerComplete = $state(false);

	// Load breakdown
	onMount(async () => {
		breakdown = await db.taskBreakdowns.get(breakdownId);
		if (breakdown && breakdown.status === 'ready') {
			// Start execution
			await db.taskBreakdowns.update(breakdownId, {
				status: 'in-progress',
				startedAt: new Date().toISOString()
			});
			breakdown = { ...breakdown, status: 'in-progress' };
		}
		loading = false;
	});

	// Current step info
	const currentStepData = $derived(
		breakdown ? breakdown.steps[breakdown.currentStepIndex] : undefined
	);
	const progressPercent = $derived(
		breakdown ? Math.round((breakdown.currentStepIndex / breakdown.steps.length) * 100) : 0
	);
	const completedCount = $derived(breakdown?.currentStepIndex || 0);
	const totalCount = $derived(breakdown?.steps.length || 0);
	const isLastStep = $derived(breakdown && breakdown.currentStepIndex === breakdown.steps.length - 1);
	const allComplete = $derived(breakdown && breakdown.currentStepIndex >= breakdown.steps.length);

	// Handle step completion
	async function completeCurrentStep() {
		if (!breakdown || !currentStepData) return;

		// Mark step as completed
		const updatedSteps = [...breakdown.steps];
		updatedSteps[breakdown.currentStepIndex] = {
			...currentStepData,
			completed: true,
			completedAt: new Date().toISOString()
		};

		const newIndex = breakdown.currentStepIndex + 1;
		const isFinished = newIndex >= breakdown.steps.length;

		await db.taskBreakdowns.update(breakdownId, {
			steps: updatedSteps,
			currentStepIndex: newIndex,
			status: isFinished ? 'completed' : 'in-progress',
			completedAt: isFinished ? new Date().toISOString() : undefined
		});

		// Reload
		breakdown = await db.taskBreakdowns.get(breakdownId);

		// Reset timer for next step
		showTimer = false;
		timerComplete = false;
	}

	// Timer functions
	function handleTimerComplete() {
		timerComplete = true;
	}

	function resetTimer() {
		timerComplete = false;
		if (visualTimerRef) {
			visualTimerRef.reset();
		}
	}

	// Navigate away
	function handleExit() {
		goto(`${base}/tools/breakdown`);
	}

	function handleViewAll() {
		goto(`${base}/tools/breakdown`);
	}
</script>

{#if loading}
	<div class="container">
		<div class="loading">Loading...</div>
	</div>
{:else if !breakdown}
	<div class="container">
		<div class="error">Task breakdown not found</div>
		<button onclick={handleExit} class="btn-secondary mt-4">
			Back to Hub
		</button>
	</div>
{:else if allComplete}
	<!-- Completion celebration -->
	<div class="container">
		<div class="completion-view">
			<div class="success-icon">✓</div>
			<h1 class="text-3xl font-bold mb-2">Task Complete!</h1>
			<p class="text-xl text-gray-600 mb-6">
				You finished "{breakdown.taskName}"
			</p>
			<p class="text-gray-500 mb-8">
				{breakdown.steps.length} step{breakdown.steps.length !== 1 ? 's' : ''} completed
			</p>

			<div class="button-group">
				<button onclick={handleViewAll} class="btn-secondary">
					View All Tasks
				</button>
				<a href="{base}/tools/breakdown/new" class="btn-primary">
					Start Another
				</a>
			</div>
		</div>
	</div>
{:else}
	<!-- Execution view -->
	<div class="container">
		<!-- Progress bar -->
		<div class="progress-section">
			<div class="progress-bar-container">
				<div class="progress-bar" style="width: {progressPercent}%"></div>
			</div>
			<p class="progress-text">
				Step {completedCount + 1} of {totalCount}
			</p>
		</div>

		<!-- Task name -->
		<h2 class="task-name">{breakdown.taskName}</h2>

		<!-- Current step -->
		<div class="step-card">
			<div class="step-number">Step {completedCount + 1}</div>
			<h3 class="step-description">{currentStepData?.description}</h3>

			{#if currentStepData?.estimatedDuration}
				<p class="step-duration">
					Estimated time: {currentStepData.estimatedDuration} minutes
				</p>
			{/if}
		</div>

		<!-- Timer section -->
		{#if currentStepData?.estimatedDuration}
			<div class="timer-section">
				{#if !showTimer}
					<button onclick={() => { showTimer = true; timerComplete = false; }} class="btn-link">
						+ Use timer ({currentStepData.estimatedDuration}m)
					</button>
				{:else}
					<div class="timer-display">
						<div class="timer-visual">
							<VisualTimer
								bind:this={visualTimerRef}
								duration={currentStepData.estimatedDuration * 60}
								size="lg"
								autoStart={true}
								onComplete={handleTimerComplete}
							/>
						</div>

						{#if timerComplete}
							<div class="timer-complete-message">
								Time's up! Ready to move on?
							</div>
						{/if}

						<div class="timer-controls">
							<button onclick={() => visualTimerRef?.isActive() ? visualTimerRef?.pause() : visualTimerRef?.start()} class="btn-secondary btn-sm">
								{#if visualTimerRef?.isActive()}Pause{:else}Resume{/if}
							</button>
							<button onclick={resetTimer} class="btn-secondary btn-sm">
								Reset
							</button>
							<button onclick={() => { showTimer = false; }} class="btn-link text-sm">
								Hide
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Actions -->
		<div class="action-section">
			<button
				onclick={completeCurrentStep}
				class="btn-done"
			>
				{isLastStep ? 'Complete Task' : 'Done with this step'}
			</button>

			<button onclick={handleExit} class="btn-link mt-4">
				Exit (save progress)
			</button>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.loading,
	.error {
		text-align: center;
		padding: 3rem;
		font-size: 1.25rem;
		color: #6b7280;
	}

	.progress-section {
		margin-bottom: 2rem;
	}

	.progress-bar-container {
		width: 100%;
		height: 12px;
		background: #e5e7eb;
		border-radius: 999px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-bar {
		height: 100%;
		background: #14b8a6;
		transition: width 0.3s ease;
	}

	.progress-text {
		text-align: center;
		font-size: 0.875rem;
		color: #6b7280;
		font-weight: 600;
	}

	.task-name {
		text-align: center;
		font-size: 1.25rem;
		font-weight: 600;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.step-card {
		background: white;
		border: 3px solid #14b8a6;
		border-radius: 16px;
		padding: 2rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	.step-number {
		font-size: 0.875rem;
		font-weight: 600;
		color: #14b8a6;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 1rem;
	}

	.step-description {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1f2937;
		line-height: 1.3;
		margin-bottom: 0.5rem;
	}

	.step-duration {
		font-size: 1rem;
		color: #6b7280;
		margin-top: 1rem;
	}

	.timer-section {
		text-align: center;
		margin-bottom: 2rem;
	}

	.timer-display {
		background: #f3f4f6;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.timer-visual {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.timer-complete-message {
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
		color: #14b8a6;
		margin-bottom: 1rem;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.6; }
	}

	.timer-controls {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	.action-section {
		text-align: center;
		margin-top: auto;
	}

	.btn-done {
		width: 100%;
		min-height: 60px;
		padding: 1rem 2rem;
		font-size: 1.5rem;
		font-weight: 700;
		background: #14b8a6;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 6px rgba(20, 184, 166, 0.3);
	}

	.btn-done:hover {
		background: #0d9488;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(20, 184, 166, 0.4);
	}

	.btn-done:active {
		transform: translateY(0);
	}

	.completion-view {
		text-align: center;
		padding: 2rem 1rem;
	}

	.success-icon {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #14b8a6;
		color: white;
		font-size: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 2rem;
		box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
	}

	.button-group {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		min-height: 44px;
		padding: 0.75rem 1.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.btn-primary {
		background-color: #14b8a6;
		color: white;
		border: none;
	}

	.btn-primary:hover {
		background-color: #0d9488;
	}

	.btn-secondary {
		background-color: white;
		color: #374151;
		border: 2px solid #d1d5db;
	}

	.btn-secondary:hover {
		background-color: #f3f4f6;
	}

	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		min-height: 36px;
	}

	.btn-link {
		background: none;
		border: none;
		color: #14b8a6;
		text-decoration: underline;
		padding: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		min-height: 44px;
	}

	.btn-link:hover {
		color: #0d9488;
	}

	.mt-4 {
		margin-top: 1rem;
	}
</style>
