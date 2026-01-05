<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { format } from 'date-fns';
	import { db, getTodaysMoodLogs } from '$lib/db';
	import type { MoodLog, BPReading, PlannedActivity } from '$lib/db/types';

	// Get current date info
	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];
	const greeting = getGreeting();

	function getGreeting(): string {
		const hour = today.getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 17) return 'Good afternoon';
		return 'Good evening';
	}

	// Today's data
	let moodLogs = $state<MoodLog[]>([]);
	let bpReadings = $state<BPReading[]>([]);
	let plannedActivities = $state<PlannedActivity[]>([]);
	let isLoading = $state(true);

	// Computed summaries
	const latestMood = $derived(
		moodLogs.length > 0
			? moodLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
			: null
	);

	const latestBP = $derived(
		bpReadings.length > 0
			? bpReadings.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
			: null
	);

	const hasEntries = $derived(moodLogs.length > 0 || bpReadings.length > 0);

	// Activity stats
	const activityStats = $derived({
		total: plannedActivities.length,
		completed: plannedActivities.filter((a) => a.completed).length,
		rate: plannedActivities.length > 0
			? Math.round((plannedActivities.filter((a) => a.completed).length / plannedActivities.length) * 100)
			: 0
	});

	// Next uncompleted activity
	const nextActivity = $derived(() => {
		const hour = today.getHours();
		const currentBlock = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
		const order = ['morning', 'afternoon', 'evening'];
		const startIndex = order.indexOf(currentBlock);

		for (let i = 0; i < 3; i++) {
			const block = order[(startIndex + i) % 3];
			const uncompleted = plannedActivities.find((a) => a.timeBlock === block && !a.completed);
			if (uncompleted) return uncompleted;
		}
		return null;
	});

	// Load today's data
	onMount(async () => {
		if (!browser) return;

		try {
			// Load mood logs
			moodLogs = await db.moodLogs.where('date').equals(todayStr).toArray();

			// Load BP readings
			bpReadings = await db.bpReadings.where('date').equals(todayStr).toArray();

			// Load planned activities
			plannedActivities = await db.plannedActivities.where('date').equals(todayStr).toArray();
		} catch (error) {
			console.error('Failed to load today\'s data:', error);
		} finally {
			isLoading = false;
		}
	});

	// Quick complete an activity
	async function quickComplete(id: number) {
		try {
			await db.plannedActivities.update(id, {
				completed: true,
				completedAt: new Date().toISOString()
			});
			plannedActivities = plannedActivities.map((a) =>
				a.id === id ? { ...a, completed: true } : a
			);
		} catch (error) {
			console.error('Failed to complete activity:', error);
		}
	}

	// Helper to format time
	function formatTime(timestamp: string): string {
		return format(new Date(timestamp), 'h:mm a');
	}

	// Mood color helper
	function getMoodColor(mood: number): string {
		if (mood <= 3) return 'text-danger-600';
		if (mood <= 6) return 'text-warning-600';
		return 'text-success-600';
	}

	// Anxiety color helper
	function getAnxietyColor(anxiety: number): string {
		if (anxiety <= 3) return 'text-success-600';
		if (anxiety <= 6) return 'text-warning-600';
		return 'text-danger-600';
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold text-gray-900">{greeting}</h1>
		<p class="text-gray-600">{format(today, 'EEEE, MMMM d')}</p>
	</header>

	<!-- Quick Actions -->
	<section class="space-y-3">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Actions</h2>
		<div class="grid grid-cols-2 gap-3">
			<a
				href="{base}/tools/breathing"
				class="card card-hover p-4 flex flex-col items-center text-center"
			>
				<div
					class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2"
				>
					<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
						/>
					</svg>
				</div>
				<span class="font-medium text-gray-900">Breathing</span>
				<span class="text-xs text-gray-500">4-7-8 exercise</span>
			</a>

			<a
				href="{base}/track/mood"
				class="card card-hover p-4 flex flex-col items-center text-center"
			>
				<div
					class="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mb-2"
				>
					<svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<span class="font-medium text-gray-900">Log Mood</span>
				<span class="text-xs text-gray-500">Track how you feel</span>
			</a>
		</div>
	</section>

	<!-- Today's Activities -->
	{#if !isLoading}
		<section class="space-y-3">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Today's Activities</h2>
				<a href="{base}/plan/today" class="text-sm text-primary-600 hover:text-primary-700">
					{plannedActivities.length > 0 ? 'View all' : 'Plan'}
				</a>
			</div>

			{#if plannedActivities.length === 0}
				<a
					href="{base}/plan/today"
					class="block card p-4 text-center border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
				>
					<p class="text-gray-500">No activities planned</p>
					<p class="text-xs text-gray-400 mt-1">Tap to add some</p>
				</a>
			{:else}
				<!-- Progress summary -->
				<div class="card p-4">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 relative flex-shrink-0">
							<svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
								<circle
									cx="18"
									cy="18"
									r="15"
									fill="none"
									class="stroke-gray-200"
									stroke-width="3"
								/>
								<circle
									cx="18"
									cy="18"
									r="15"
									fill="none"
									class="stroke-success-500"
									stroke-width="3"
									stroke-linecap="round"
									stroke-dasharray="{activityStats.rate}, 100"
								/>
							</svg>
							<span class="absolute inset-0 flex items-center justify-center text-xs font-semibold">
								{activityStats.rate}%
							</span>
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900">
								{activityStats.completed} of {activityStats.total} completed
							</p>
							{#if activityStats.completed === activityStats.total && activityStats.total > 0}
								<p class="text-sm text-success-600">All done for today</p>
							{:else if nextActivity()}
								<p class="text-sm text-gray-500">Next: {nextActivity()?.activity}</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Next activity quick action -->
				{#if nextActivity()}
					{@const next = nextActivity()}
					<div class="card p-4 bg-primary-50 border-primary-100">
						<div class="flex items-center justify-between gap-3">
							<div class="min-w-0">
								<p class="text-xs text-primary-600 uppercase font-medium">{next?.timeBlock}</p>
								<p class="font-medium text-gray-900 truncate">{next?.activity}</p>
							</div>
							<button
								type="button"
								onclick={() => next?.id && quickComplete(next.id)}
								class="btn-success py-2 px-4 flex-shrink-0"
							>
								Done
							</button>
						</div>
					</div>
				{/if}
			{/if}
		</section>
	{/if}

	<!-- Today's Status -->
	<section class="space-y-3">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Tracking</h2>

		{#if isLoading}
			<div class="card p-4">
				<div class="animate-pulse flex items-center gap-4">
					<div class="w-10 h-10 bg-gray-200 rounded-full"></div>
					<div class="flex-1 space-y-2">
						<div class="h-4 bg-gray-200 rounded w-3/4"></div>
						<div class="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		{:else if hasEntries}
			<div class="space-y-3">
				<!-- Latest Mood -->
				{#if latestMood}
					<div class="card p-4">
						<div class="flex items-center gap-4">
							<div class="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
								<svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<div class="flex items-baseline gap-2">
									<span class="text-lg font-semibold {getMoodColor(latestMood.mood)}">
										Mood: {latestMood.mood}/10
									</span>
									<span class="text-sm {getAnxietyColor(latestMood.anxiety)}">
										Anxiety: {latestMood.anxiety}/10
									</span>
								</div>
								<p class="text-xs text-gray-500">{formatTime(latestMood.timestamp)}</p>
							</div>
							<a href="{base}/track/mood" class="text-sm text-primary-600 hover:text-primary-700">
								Update
							</a>
						</div>
						{#if latestMood.notes}
							<p class="mt-2 text-sm text-gray-600 pl-14">{latestMood.notes}</p>
						{/if}
						{#if moodLogs.length > 1}
							<p class="mt-2 text-xs text-gray-400 pl-14">
								+{moodLogs.length - 1} more {moodLogs.length - 1 === 1 ? 'entry' : 'entries'} today
							</p>
						{/if}
					</div>
				{/if}

				<!-- Latest BP -->
				{#if latestBP}
					<div class="card p-4">
						<div class="flex items-center gap-4">
							<div class="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center">
								<svg class="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</div>
							<div class="flex-1">
								<div class="flex items-baseline gap-2">
									<span class="text-lg font-semibold text-gray-900">
										{latestBP.systolic}/{latestBP.diastolic}
									</span>
									<span class="text-sm text-gray-500">mmHg</span>
									{#if latestBP.heartRate}
										<span class="text-sm text-gray-500">
											{latestBP.heartRate} BPM
										</span>
									{/if}
								</div>
								<p class="text-xs text-gray-500">
									{formatTime(latestBP.timestamp)}
									{#if latestBP.isAnxietyRelated}
										<span class="ml-1 text-amber-600">(during anxiety)</span>
									{/if}
								</p>
							</div>
							<a href="{base}/track/bp" class="text-sm text-primary-600 hover:text-primary-700">
								New
							</a>
						</div>
						{#if bpReadings.length > 1}
							<p class="mt-2 text-xs text-gray-400 pl-14">
								+{bpReadings.length - 1} more {bpReadings.length - 1 === 1 ? 'reading' : 'readings'} today
							</p>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<div class="card p-4">
				<p class="text-gray-600 text-center py-2">
					Start tracking to see your daily summary here.
				</p>
				<div class="flex justify-center gap-2 mt-3">
					<a href="{base}/track/mood" class="btn-secondary text-sm py-2 px-4">Log Mood</a>
					<a href="{base}/track/bp" class="btn-secondary text-sm py-2 px-4">Log BP</a>
				</div>
			</div>
		{/if}
	</section>

	<!-- Crisis Help Notice -->
	<section class="card p-4 bg-primary-50 border-primary-100">
		<div class="flex items-start gap-3">
			<div class="flex-shrink-0">
				<svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm text-primary-800">
					Feeling anxious? Tap the red button in the corner anytime to access breathing and grounding exercises.
				</p>
			</div>
		</div>
	</section>
</div>
