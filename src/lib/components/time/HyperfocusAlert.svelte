<!-- src/lib/components/time/HyperfocusAlert.svelte -->
<!-- Gentle hyperfocus check-in - Phase 9 Time Perception Aids -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		activityName?: string;
		triggerMinutes?: number;      // Minutes before first alert (default 60)
		extendMinutes?: number;       // Minutes added when extending (default 30)
		onTransition?: () => void;    // Callback when user chooses to transition
		onExtend?: (minutes: number) => void; // Callback when user extends
	}

	let {
		activityName = 'this activity',
		triggerMinutes = 60,
		extendMinutes = 30,
		onTransition,
		onExtend
	}: Props = $props();

	let startTime = $state<Date | null>(null);
	let elapsedMinutes = $state(0);
	let showAlert = $state(false);
	let dismissed = $state(false);
	let nextTrigger = $state(triggerMinutes);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		start();
	});

	onDestroy(() => {
		stop();
	});

	export function start() {
		startTime = new Date();
		elapsedMinutes = 0;
		dismissed = false;
		showAlert = false;
		nextTrigger = triggerMinutes;

		intervalId = setInterval(() => {
			if (!startTime) return;

			const now = new Date();
			elapsedMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);

			// Check if we've hit the trigger threshold
			if (!dismissed && elapsedMinutes >= nextTrigger) {
				showAlert = true;
			}
		}, 60000); // Check every minute
	}

	export function stop() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		startTime = null;
	}

	export function reset() {
		stop();
		start();
	}

	function handleExtend() {
		showAlert = false;
		dismissed = false;
		nextTrigger = elapsedMinutes + extendMinutes;
		onExtend?.(extendMinutes);
	}

	function handleTransition() {
		showAlert = false;
		stop();
		onTransition?.();
	}

	function handleDismiss() {
		showAlert = false;
		dismissed = true;
	}

	// Format elapsed time
	function formatElapsed(minutes: number): string {
		if (minutes < 60) {
			return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (mins === 0) {
			return `${hours} hour${hours !== 1 ? 's' : ''}`;
		}
		return `${hours}h ${mins}m`;
	}
</script>

{#if showAlert}
	<div class="hyperfocus-alert" role="alertdialog" aria-labelledby="alert-title">
		<div class="alert-content">
			<div class="alert-icon">⏰</div>
			<div class="alert-text">
				<h3 id="alert-title" class="alert-title">Time check</h3>
				<p class="alert-message">
					You've been on <strong>{activityName}</strong> for {formatElapsed(elapsedMinutes)}
				</p>
				<p class="alert-subtitle">How are you feeling?</p>
			</div>
		</div>

		<div class="alert-actions">
			<button
				onclick={handleExtend}
				class="btn-extend"
				aria-label="Keep going for {extendMinutes} more minutes"
			>
				<span class="btn-icon">▶</span>
				Keep going (+{extendMinutes}m)
			</button>
			<button
				onclick={handleTransition}
				class="btn-transition"
				aria-label="Transition to something else"
			>
				<span class="btn-icon">↻</span>
				Transition
			</button>
		</div>

		<button
			onclick={handleDismiss}
			class="btn-dismiss"
			aria-label="Dismiss alert"
		>
			Dismiss
		</button>
	</div>
{/if}

<!-- Elapsed time indicator (always visible when active) -->
{#if startTime && elapsedMinutes > 0}
	<div class="elapsed-indicator" class:warning={elapsedMinutes >= triggerMinutes - 10}>
		<span class="elapsed-icon">⏱</span>
		<span class="elapsed-text">{formatElapsed(elapsedMinutes)}</span>
	</div>
{/if}

<style>
	.hyperfocus-alert {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		max-width: 400px;
		margin: 0 auto;
		background: white;
		border: 2px solid #14b8a6;
		border-radius: 16px;
		padding: 1.25rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		animation: slide-up 0.3s ease-out;
	}

	@keyframes slide-up {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.alert-content {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.alert-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.alert-text {
		flex: 1;
	}

	.alert-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.alert-message {
		font-size: 0.9375rem;
		color: #374151;
		margin-bottom: 0.25rem;
	}

	.alert-message strong {
		color: #14b8a6;
	}

	.alert-subtitle {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.alert-actions {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.btn-extend,
	.btn-transition {
		flex: 1;
		min-height: 48px;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.btn-extend {
		background: #14b8a6;
		color: white;
	}

	.btn-extend:hover {
		background: #0d9488;
	}

	.btn-transition {
		background: #f3f4f6;
		color: #374151;
	}

	.btn-transition:hover {
		background: #e5e7eb;
	}

	.btn-icon {
		font-size: 1rem;
	}

	.btn-dismiss {
		width: 100%;
		padding: 0.5rem;
		background: none;
		border: none;
		color: #9ca3af;
		font-size: 0.875rem;
		cursor: pointer;
		transition: color 0.2s;
	}

	.btn-dismiss:hover {
		color: #6b7280;
	}

	/* Elapsed time indicator */
	.elapsed-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: #f3f4f6;
		border-radius: 20px;
		font-size: 0.875rem;
		color: #6b7280;
		transition: all 0.3s;
	}

	.elapsed-indicator.warning {
		background: #fef3c7;
		color: #92400e;
	}

	.elapsed-icon {
		font-size: 0.875rem;
	}

	.elapsed-text {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.hyperfocus-alert {
			animation: none;
		}
	}
</style>
