<!-- src/lib/components/time/TimeRemaining.svelte -->
<!-- Human-readable time remaining display - Phase 9 Time Perception Aids -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PlannedActivity } from '$lib/db/types';

	interface Props {
		activities?: PlannedActivity[];
		compact?: boolean;
	}

	let { activities = [], compact = false }: Props = $props();

	let currentTime = $state(new Date());
	let intervalId: ReturnType<typeof setInterval> | null = null;

	// Time blocks configuration
	const timeBlocks = [
		{ id: 'morning', label: 'Morning', start: 6, end: 12 },
		{ id: 'afternoon', label: 'Afternoon', start: 12, end: 17 },
		{ id: 'evening', label: 'Evening', start: 17, end: 22 }
	];

	onMount(() => {
		intervalId = setInterval(() => {
			currentTime = new Date();
		}, 60000); // Update every minute
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	// Get current time block
	const currentBlock = $derived(() => {
		const hour = currentTime.getHours();
		if (hour < 6) return null; // Before day starts
		if (hour >= 22) return null; // After day ends
		return timeBlocks.find(b => hour >= b.start && hour < b.end) || null;
	});

	// Minutes remaining in current block
	const blockMinutesRemaining = $derived(() => {
		const block = currentBlock();
		if (!block) return 0;

		const hour = currentTime.getHours();
		const minute = currentTime.getMinutes();
		const minutesSinceBlockStart = (hour - block.start) * 60 + minute;
		const blockDuration = (block.end - block.start) * 60;
		return blockDuration - minutesSinceBlockStart;
	});

	// Day progress (6am to 10pm = 16 hours)
	const dayProgress = $derived(() => {
		const hour = currentTime.getHours();
		const minute = currentTime.getMinutes();

		if (hour < 6) return 0;
		if (hour >= 22) return 100;

		const minutesSince6am = (hour - 6) * 60 + minute;
		const totalDayMinutes = 16 * 60; // 6am to 10pm
		return Math.round((minutesSince6am / totalDayMinutes) * 100);
	});

	// Next uncompleted activity
	const nextActivity = $derived(() => {
		if (!activities.length) return null;

		const hour = currentTime.getHours();
		let currentBlockId: string;

		if (hour < 12) currentBlockId = 'morning';
		else if (hour < 17) currentBlockId = 'afternoon';
		else currentBlockId = 'evening';

		const blockOrder = ['morning', 'afternoon', 'evening'];
		const currentBlockIndex = blockOrder.indexOf(currentBlockId);

		// Find next uncompleted activity in current or future blocks
		for (let i = currentBlockIndex; i < blockOrder.length; i++) {
			const blockActivities = activities.filter(
				a => a.timeBlock === blockOrder[i] && !a.completed
			);
			if (blockActivities.length > 0) {
				return {
					activity: blockActivities[0],
					isCurrent: i === currentBlockIndex
				};
			}
		}

		return null;
	});

	// Format time remaining as human-readable
	function formatTimeRemaining(minutes: number): string {
		if (minutes < 60) {
			return `${minutes}m`;
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (mins === 0) {
			return `${hours}h`;
		}
		return `${hours}h ${mins}m`;
	}
</script>

<div class="time-remaining" class:compact>
	{#if currentBlock()}
		<div class="block-info">
			<span class="block-label">{currentBlock()!.label}</span>
			<span class="block-time">{formatTimeRemaining(blockMinutesRemaining())} remaining</span>
		</div>
	{:else}
		<div class="block-info">
			<span class="block-label">Day Complete</span>
			<span class="block-time">Rest well</span>
		</div>
	{/if}

	<!-- Day progress bar -->
	<div class="progress-container">
		<div class="progress-labels">
			<span>6AM</span>
			<span>10PM</span>
		</div>
		<div class="progress-bar">
			<div
				class="progress-fill"
				style="width: {dayProgress()}%"
				role="progressbar"
				aria-valuenow={dayProgress()}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label="Day progress"
			></div>
			<div class="progress-marker" style="left: {dayProgress()}%"></div>
		</div>
		<div class="progress-percent">{dayProgress()}% of day</div>
	</div>

	<!-- Next activity -->
	{#if nextActivity()}
		<div class="next-activity">
			<span class="next-label">
				{nextActivity()!.isCurrent ? 'Next up:' : 'Coming up:'}
			</span>
			<span class="next-name">{nextActivity()!.activity.activity}</span>
			{#if nextActivity()!.activity.spoonCost}
				<span class="next-spoons">{nextActivity()!.activity.spoonCost}🥄</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.time-remaining {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 1rem;
	}

	.time-remaining.compact {
		padding: 0.75rem;
	}

	.block-info {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.75rem;
	}

	.block-label {
		font-size: 1.125rem;
		font-weight: 700;
		color: #1f2937;
	}

	.compact .block-label {
		font-size: 1rem;
	}

	.block-time {
		font-size: 1rem;
		font-weight: 600;
		color: #14b8a6;
	}

	.compact .block-time {
		font-size: 0.875rem;
	}

	.progress-container {
		margin-bottom: 0.75rem;
	}

	.progress-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #9ca3af;
		margin-bottom: 0.25rem;
	}

	.progress-bar {
		position: relative;
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: visible;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #14b8a6 0%, #0d9488 100%);
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.progress-marker {
		position: absolute;
		top: -4px;
		width: 4px;
		height: 16px;
		background: #0d9488;
		border-radius: 2px;
		transform: translateX(-50%);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.progress-percent {
		text-align: center;
		font-size: 0.75rem;
		color: #6b7280;
		margin-top: 0.5rem;
	}

	.next-activity {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid #e5e7eb;
		flex-wrap: wrap;
	}

	.next-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.next-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1f2937;
	}

	.next-spoons {
		font-size: 0.75rem;
		color: #14b8a6;
		font-weight: 600;
	}
</style>
