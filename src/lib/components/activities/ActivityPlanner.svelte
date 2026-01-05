<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { format } from 'date-fns';
	import { db } from '$lib/db';
	import type { PlannedActivity, ActivityLibraryItem, TimeBlock, ActivityCategory } from '$lib/db/types';
	import ActivityCard from './ActivityCard.svelte';

	interface Props {
		date?: string;
		onOpenLibrary?: (timeBlock: TimeBlock) => void;
	}

	let { date = new Date().toISOString().split('T')[0], onOpenLibrary }: Props = $props();

	// State
	let activities = $state<PlannedActivity[]>([]);
	let isLoading = $state(true);
	let ratingActivityId = $state<number | null>(null);
	let ratingEnjoyment = $state(5);
	let ratingMastery = $state(5);

	// Time blocks configuration
	const timeBlocks: { value: TimeBlock; label: string; icon: string }[] = [
		{
			value: 'morning',
			label: 'Morning',
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />'
		},
		{
			value: 'afternoon',
			label: 'Afternoon',
			icon: '<circle cx="12" cy="12" r="5" stroke-width="2" fill="none"/><path stroke-linecap="round" stroke-width="2" d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M5.64 18.36l1.42-1.42M16.94 7.06l1.42-1.42"/>'
		},
		{
			value: 'evening',
			label: 'Evening',
			icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />'
		}
	];

	// Get activities for each time block
	const morningActivities = $derived(
		activities.filter((a) => a.timeBlock === 'morning')
	);
	const afternoonActivities = $derived(
		activities.filter((a) => a.timeBlock === 'afternoon')
	);
	const eveningActivities = $derived(
		activities.filter((a) => a.timeBlock === 'evening')
	);

	// Completion stats
	const totalPlanned = $derived(activities.length);
	const totalCompleted = $derived(activities.filter((a) => a.completed).length);
	const completionRate = $derived(
		totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0
	);

	// Load activities on mount and when date changes
	$effect(() => {
		if (browser && date) {
			loadActivities();
		}
	});

	async function loadActivities() {
		isLoading = true;
		try {
			activities = await db.plannedActivities.where('date').equals(date).toArray();
		} catch (error) {
			console.error('Failed to load activities:', error);
		} finally {
			isLoading = false;
		}
	}

	// Add activity from library
	export async function addActivityFromLibrary(item: ActivityLibraryItem, timeBlock: TimeBlock) {
		const newActivity: Omit<PlannedActivity, 'id'> = {
			date,
			createdAt: new Date().toISOString(),
			activity: item.name,
			category: item.category,
			timeBlock,
			estimatedDuration: item.estimatedDuration,
			completed: false
		};

		try {
			const id = await db.plannedActivities.add(newActivity);
			activities = [...activities, { ...newActivity, id } as PlannedActivity];
		} catch (error) {
			console.error('Failed to add activity:', error);
		}
	}

	// Toggle completion
	async function handleComplete(id: number) {
		const activity = activities.find((a) => a.id === id);
		if (!activity) return;

		const wasCompleted = activity.completed;
		const updates: Partial<PlannedActivity> = {
			completed: !wasCompleted,
			completedAt: !wasCompleted ? new Date().toISOString() : undefined
		};

		try {
			await db.plannedActivities.update(id, updates);
			activities = activities.map((a) =>
				a.id === id ? { ...a, ...updates } : a
			);

			// If just completed, prompt for rating
			if (!wasCompleted) {
				ratingActivityId = id;
				ratingEnjoyment = 5;
				ratingMastery = 5;
			}
		} catch (error) {
			console.error('Failed to update activity:', error);
		}
	}

	// Open rating modal
	function handleRate(id: number) {
		const activity = activities.find((a) => a.id === id);
		if (activity) {
			ratingActivityId = id;
			ratingEnjoyment = activity.enjoyment ?? 5;
			ratingMastery = activity.mastery ?? 5;
		}
	}

	// Save rating
	async function saveRating() {
		if (!ratingActivityId) return;

		const updates = {
			enjoyment: ratingEnjoyment,
			mastery: ratingMastery
		};

		try {
			await db.plannedActivities.update(ratingActivityId, updates);

			// Update library item stats
			const activity = activities.find((a) => a.id === ratingActivityId);
			if (activity) {
				const libraryItems = await db.activityLibrary
					.where('name')
					.equals(activity.activity)
					.toArray();

				if (libraryItems.length > 0) {
					const item = libraryItems[0];
					const newCount = item.timesCompleted + 1;
					const newAvgEnjoyment = item.averageEnjoyment
						? (item.averageEnjoyment * item.timesCompleted + ratingEnjoyment) / newCount
						: ratingEnjoyment;
					const newAvgMastery = item.averageMastery
						? (item.averageMastery * item.timesCompleted + ratingMastery) / newCount
						: ratingMastery;

					await db.activityLibrary.update(item.id!, {
						timesCompleted: newCount,
						averageEnjoyment: Math.round(newAvgEnjoyment * 10) / 10,
						averageMastery: Math.round(newAvgMastery * 10) / 10,
						lastUsed: date
					});
				}
			}

			activities = activities.map((a) =>
				a.id === ratingActivityId ? { ...a, ...updates } : a
			);
			ratingActivityId = null;
		} catch (error) {
			console.error('Failed to save rating:', error);
		}
	}

	// Remove activity
	async function handleRemove(id: number) {
		try {
			await db.plannedActivities.delete(id);
			activities = activities.filter((a) => a.id !== id);
		} catch (error) {
			console.error('Failed to remove activity:', error);
		}
	}

	// Open library for a time block
	function openLibrary(timeBlock: TimeBlock) {
		if (onOpenLibrary) {
			onOpenLibrary(timeBlock);
		}
	}
</script>

<div class="space-y-6">
	<!-- Summary header -->
	{#if totalPlanned > 0}
		<div class="card p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-500">Today's progress</p>
					<p class="text-lg font-semibold text-gray-900">
						{totalCompleted} of {totalPlanned} completed
					</p>
				</div>
				<div class="w-16 h-16 relative">
					<svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
						<circle
							cx="18"
							cy="18"
							r="16"
							fill="none"
							class="stroke-gray-200"
							stroke-width="3"
						/>
						<circle
							cx="18"
							cy="18"
							r="16"
							fill="none"
							class="stroke-success-500"
							stroke-width="3"
							stroke-linecap="round"
							stroke-dasharray={`${completionRate}, 100`}
						/>
					</svg>
					<span class="absolute inset-0 flex items-center justify-center text-sm font-medium">
						{completionRate}%
					</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Time blocks -->
	{#each timeBlocks as block}
		{@const blockActivities =
			block.value === 'morning'
				? morningActivities
				: block.value === 'afternoon'
					? afternoonActivities
					: eveningActivities}

		<section class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
						<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{@html block.icon}
						</svg>
					</div>
					<h2 class="font-medium text-gray-900">{block.label}</h2>
					{#if blockActivities.length > 0}
						<span class="text-sm text-gray-500">
							({blockActivities.filter((a) => a.completed).length}/{blockActivities.length})
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={() => openLibrary(block.value)}
					class="btn-icon text-primary-600 hover:bg-primary-50 rounded-full"
					aria-label="Add activity to {block.label}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>

			{#if isLoading}
				<div class="card p-4 animate-pulse">
					<div class="h-12 bg-gray-200 rounded"></div>
				</div>
			{:else if blockActivities.length === 0}
				<button
					type="button"
					onclick={() => openLibrary(block.value)}
					class="w-full card p-6 border-2 border-dashed border-gray-200 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors"
				>
					<p class="text-gray-500">Tap to add an activity</p>
				</button>
			{:else}
				<div class="space-y-2">
					{#each blockActivities as activity (activity.id)}
						<ActivityCard
							{activity}
							mode="planner"
							onComplete={handleComplete}
							onRate={handleRate}
							onRemove={handleRemove}
						/>
					{/each}
				</div>
			{/if}
		</section>
	{/each}
</div>

<!-- Rating modal -->
{#if ratingActivityId !== null}
	{@const activity = activities.find((a) => a.id === ratingActivityId)}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-modal"
		onclick={(e) => e.target === e.currentTarget && (ratingActivityId = null)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="rating-title"
		tabindex="-1"
	>
		<div class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 safe-bottom animate-slide-up">
			<h2 id="rating-title" class="text-xl font-semibold text-gray-900 mb-2">
				How did it go?
			</h2>
			<p class="text-gray-600 mb-6">{activity?.activity}</p>

			<div class="space-y-6">
				<!-- Enjoyment rating -->
				<div>
					<div class="flex justify-between mb-2">
						<label for="enjoyment" class="label">Enjoyment</label>
						<span class="text-lg font-medium text-primary-600">{ratingEnjoyment}/10</span>
					</div>
					<input
						id="enjoyment"
						type="range"
						min="0"
						max="10"
						step="1"
						bind:value={ratingEnjoyment}
						class="slider w-full"
					/>
					<div class="flex justify-between text-xs text-gray-400 mt-1">
						<span>Not at all</span>
						<span>Very much</span>
					</div>
				</div>

				<!-- Mastery rating -->
				<div>
					<div class="flex justify-between mb-2">
						<label for="mastery" class="label">Sense of accomplishment</label>
						<span class="text-lg font-medium text-primary-600">{ratingMastery}/10</span>
					</div>
					<input
						id="mastery"
						type="range"
						min="0"
						max="10"
						step="1"
						bind:value={ratingMastery}
						class="slider w-full"
					/>
					<div class="flex justify-between text-xs text-gray-400 mt-1">
						<span>None</span>
						<span>Very high</span>
					</div>
				</div>
			</div>

			<div class="flex gap-3 mt-8">
				<button type="button" onclick={saveRating} class="btn-primary flex-1">
					Save
				</button>
				<button
					type="button"
					onclick={() => (ratingActivityId = null)}
					class="btn-secondary"
				>
					Skip
				</button>
			</div>
		</div>
	</div>
{/if}
