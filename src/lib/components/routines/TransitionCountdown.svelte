<!-- src/lib/components/routines/TransitionCountdown.svelte -->
<!-- Gentle transition warnings for time blocks - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PlannedActivity } from '$lib/db/types';

	interface Props {
		activities: PlannedActivity[];
		warningMinutes?: number;
	}

	let { activities, warningMinutes = 15 }: Props = $props();

	let currentTime = $state(new Date());
	let dismissed = $state(false);
	let timeInterval: ReturnType<typeof setInterval> | null = null;

	// Update time every minute
	onMount(() => {
		timeInterval = setInterval(() => {
			currentTime = new Date();
		}, 60000);
	});

	onDestroy(() => {
		if (timeInterval) clearInterval(timeInterval);
	});

	// Time blocks
	const timeBlocks = [
		{ id: 'morning', label: 'Morning', endHour: 12 },
		{ id: 'afternoon', label: 'Afternoon', endHour: 17 },
		{ id: 'evening', label: 'Evening', endHour: 22 }
	];

	// Get current time block
	const currentBlock = $derived(() => {
		const hour = currentTime.getHours();
		if (hour < 12) return timeBlocks[0];
		if (hour < 17) return timeBlocks[1];
		return timeBlocks[2];
	});

	// Get next block
	const nextBlock = $derived(() => {
		const current = currentBlock();
		const index = timeBlocks.findIndex(b => b.id === current.id);
		return timeBlocks[index + 1] || null;
	});

	// Minutes until current block ends
	const minutesUntilTransition = $derived(() => {
		const current = currentBlock();
		const hour = currentTime.getHours();
		const minute = currentTime.getMinutes();

		const minutesIntoHour = minute;
		const hoursUntilEnd = current.endHour - hour - 1;
		const minutesUntilEnd = (hoursUntilEnd * 60) + (60 - minutesIntoHour);

		return minutesUntilEnd;
	});

	// Should show warning
	const showWarning = $derived(() => {
		if (dismissed) return false;
		const minutes = minutesUntilTransition();
		return minutes > 0 && minutes <= warningMinutes && nextBlock();
	});

	// Next uncompleted activity in next block
	const nextActivity = $derived(() => {
		if (!nextBlock()) return null;
		const nextBlockActivities = activities.filter(
			a => a.timeBlock === nextBlock()!.id && !a.completed
		);
		return nextBlockActivities.length > 0 ? nextBlockActivities[0] : null;
	});

	// Format time remaining
	function formatTimeRemaining(minutes: number): string {
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

	function handleDismiss() {
		dismissed = true;
	}
</script>

{#if showWarning()}
	<div class="transition-warning">
		<div class="warning-content">
			<div class="warning-icon">⏰</div>
			<div class="warning-text">
				<p class="warning-title">
					{currentBlock().label} ends in {formatTimeRemaining(minutesUntilTransition())}
				</p>
				{#if nextActivity()}
					<p class="warning-subtitle">
						Next: {nextActivity()!.activity}
					</p>
				{:else if nextBlock()}
					<p class="warning-subtitle">
						{nextBlock()!.label} block starts soon
					</p>
				{/if}
			</div>
		</div>
		<button
			onclick={handleDismiss}
			class="dismiss-btn"
			aria-label="Dismiss"
		>
			×
		</button>
	</div>
{/if}

<style>
	.transition-warning {
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border: 2px solid #fbbf24;
		border-radius: 12px;
		padding: 1rem;
		margin: 1rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
		animation: gentle-pulse 3s ease-in-out infinite;
	}

	@keyframes gentle-pulse {
		0%, 100% {
			box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
		}
		50% {
			box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
		}
	}

	.warning-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
	}

	.warning-icon {
		font-size: 2rem;
		flex-shrink: 0;
		animation: gentle-sway 2s ease-in-out infinite;
	}

	@keyframes gentle-sway {
		0%, 100% {
			transform: rotate(-5deg);
		}
		50% {
			transform: rotate(5deg);
		}
	}

	.warning-text {
		flex: 1;
	}

	.warning-title {
		font-size: 1rem;
		font-weight: 700;
		color: #92400e;
		margin-bottom: 0.25rem;
	}

	.warning-subtitle {
		font-size: 0.875rem;
		color: #b45309;
	}

	.dismiss-btn {
		width: 32px;
		height: 32px;
		border: none;
		background: rgba(146, 64, 14, 0.1);
		color: #92400e;
		border-radius: 50%;
		font-size: 1.5rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s;
	}

	.dismiss-btn:hover {
		background: rgba(146, 64, 14, 0.2);
		transform: scale(1.1);
	}

	.dismiss-btn:active {
		transform: scale(0.95);
	}
</style>
