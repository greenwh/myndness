<!-- src/lib/components/routines/RoutineTimeline.svelte -->
<!-- Horizontal visual timeline for daily routine - Phase 8 Autism Productivity -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PlannedActivity, TimeBlock } from '$lib/db/types';

	interface Props {
		activities: PlannedActivity[];
	}

	let { activities }: Props = $props();

	let currentTime = $state(new Date());
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

	// Time blocks configuration
	const timeBlocks = [
		{ id: 'morning' as TimeBlock, label: 'Morning', start: 6, end: 12, color: '#fef3c7' },
		{ id: 'afternoon' as TimeBlock, label: 'Afternoon', start: 12, end: 17, color: '#fed7aa' },
		{ id: 'evening' as TimeBlock, label: 'Evening', start: 17, end: 22, color: '#ddd6fe' }
	];

	// Group activities by time block
	const groupedActivities = $derived(() => {
		const groups: Record<TimeBlock, PlannedActivity[]> = {
			morning: [],
			afternoon: [],
			evening: []
		};

		activities.forEach(activity => {
			groups[activity.timeBlock].push(activity);
		});

		return groups;
	});

	// Calculate current time position (0-100%)
	const currentTimePercent = $derived(() => {
		const hour = currentTime.getHours();
		const minute = currentTime.getMinutes();

		// Map 6am-10pm (16 hours) to 0-100%
		if (hour < 6) return 0;
		if (hour >= 22) return 100;

		const totalMinutes = (hour - 6) * 60 + minute;
		const maxMinutes = 16 * 60; // 6am to 10pm
		return (totalMinutes / maxMinutes) * 100;
	});

	// Get category color
	function getCategoryColor(category: string): string {
		const colors: Record<string, string> = {
			social: '#3b82f6',
			creative: '#8b5cf6',
			physical: '#10b981',
			learning: '#f59e0b',
			mastery: '#6b7280',
			pleasure: '#ef4444'
		};
		return colors[category] || '#6b7280';
	}

	// Format time
	function formatTime(hour: number): string {
		const period = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}${period}`;
	}
</script>

<div class="timeline-container">
	<h3 class="timeline-title">Daily Timeline</h3>

	<!-- Timeline -->
	<div class="timeline">
		{#each timeBlocks as block}
			{@const blockActivities = groupedActivities()[block.id]}
			<div class="time-block" style="background-color: {block.color}">
				<!-- Block header -->
				<div class="block-header">
					<span class="block-label">{block.label}</span>
					<span class="block-time">{formatTime(block.start)} - {formatTime(block.end)}</span>
				</div>

				<!-- Activities in this block -->
				{#if blockActivities.length > 0}
					<div class="activities-list">
						{#each blockActivities as activity}
							<div
								class="activity-item"
								class:completed={activity.completed}
								style="border-left: 4px solid {getCategoryColor(activity.category)}"
							>
								<div class="activity-content">
									<span class="activity-name">{activity.activity}</span>
									{#if activity.estimatedDuration}
										<span class="activity-duration">{activity.estimatedDuration}m</span>
									{/if}
									{#if activity.spoonCost}
										<span class="spoon-badge">{activity.spoonCost}🥄</span>
									{/if}
								</div>
								{#if activity.completed}
									<span class="check-mark">✓</span>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-block">No activities planned</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Current time indicator -->
	<div
		class="time-indicator"
		style="left: {currentTimePercent()}%"
		aria-label="Current time"
	>
		<div class="time-indicator-line"></div>
		<div class="time-indicator-dot"></div>
		<div class="time-indicator-label">
			{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
		</div>
	</div>
</div>

<style>
	.timeline-container {
		position: relative;
		margin: 1rem 0;
		padding: 1rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
	}

	.timeline-title {
		font-size: 1.125rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.timeline {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		position: relative;
		min-height: 200px;
	}

	.time-block {
		border-radius: 8px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.block-header {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		margin-bottom: 0.5rem;
	}

	.block-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: #374151;
	}

	.block-time {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.activities-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.activity-item {
		background: white;
		border-radius: 6px;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.activity-item:hover {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.activity-item.completed {
		opacity: 0.6;
		background: #f0fdf4;
	}

	.activity-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
		min-width: 0;
	}

	.activity-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1f2937;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.activity-duration {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.spoon-badge {
		font-size: 0.75rem;
		color: #14b8a6;
		font-weight: 600;
	}

	.check-mark {
		font-size: 1.25rem;
		color: #10b981;
		flex-shrink: 0;
	}

	.empty-block {
		text-align: center;
		color: #9ca3af;
		font-size: 0.875rem;
		padding: 1rem 0;
	}

	.time-indicator {
		position: absolute;
		top: 4rem;
		bottom: 1rem;
		pointer-events: none;
		z-index: 10;
	}

	.time-indicator-line {
		width: 2px;
		height: 100%;
		background: #ef4444;
		box-shadow: 0 0 4px rgba(239, 68, 68, 0.5);
	}

	.time-indicator-dot {
		position: absolute;
		top: -6px;
		left: -4px;
		width: 10px;
		height: 10px;
		background: #ef4444;
		border-radius: 50%;
		box-shadow: 0 0 6px rgba(239, 68, 68, 0.7);
	}

	.time-indicator-label {
		position: absolute;
		top: -2rem;
		left: 50%;
		transform: translateX(-50%);
		background: #ef4444;
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.timeline {
			grid-template-columns: 1fr;
		}

		.time-indicator {
			display: none;
		}
	}
</style>
