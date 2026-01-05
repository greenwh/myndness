<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { format, startOfWeek, addDays } from 'date-fns';
	import { db } from '$lib/db';
	import type { PlannedActivity, TimeBlock } from '$lib/db/types';

	// Today's date
	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	// State
	let todayActivities = $state<PlannedActivity[]>([]);
	let weekStats = $state<{ planned: number; completed: number; rate: number }>({
		planned: 0,
		completed: 0,
		rate: 0
	});
	let isLoading = $state(true);

	// Computed stats for today
	const todayStats = $derived({
		total: todayActivities.length,
		completed: todayActivities.filter((a) => a.completed).length,
		rate: todayActivities.length > 0
			? Math.round((todayActivities.filter((a) => a.completed).length / todayActivities.length) * 100)
			: 0
	});

	// Group today's activities by time block
	const groupedActivities = $derived({
		morning: todayActivities.filter((a) => a.timeBlock === 'morning'),
		afternoon: todayActivities.filter((a) => a.timeBlock === 'afternoon'),
		evening: todayActivities.filter((a) => a.timeBlock === 'evening')
	});

	// Current time block
	const currentTimeBlock = $derived<TimeBlock>(() => {
		const hour = today.getHours();
		if (hour < 12) return 'morning';
		if (hour < 17) return 'afternoon';
		return 'evening';
	});

	// Next uncompleted activity
	const nextActivity = $derived(() => {
		const current = currentTimeBlock();
		const order: TimeBlock[] = ['morning', 'afternoon', 'evening'];
		const startIndex = order.indexOf(current);

		for (let i = 0; i < 3; i++) {
			const block = order[(startIndex + i) % 3];
			const uncompleted = groupedActivities[block].find((a) => !a.completed);
			if (uncompleted) return uncompleted;
		}
		return null;
	});

	// Load data on mount
	onMount(async () => {
		if (!browser) return;

		try {
			// Load today's activities
			todayActivities = await db.plannedActivities.where('date').equals(todayStr).toArray();

			// Calculate week stats
			const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
			const weekEnd = format(addDays(startOfWeek(today, { weekStartsOn: 1 }), 6), 'yyyy-MM-dd');

			const weekActivities = await db.plannedActivities
				.where('date')
				.between(weekStart, weekEnd, true, true)
				.toArray();

			weekStats = {
				planned: weekActivities.length,
				completed: weekActivities.filter((a) => a.completed).length,
				rate: weekActivities.length > 0
					? Math.round((weekActivities.filter((a) => a.completed).length / weekActivities.length) * 100)
					: 0
			};
		} catch (error) {
			console.error('Failed to load plan data:', error);
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
			todayActivities = todayActivities.map((a) =>
				a.id === id ? { ...a, completed: true } : a
			);
		} catch (error) {
			console.error('Failed to complete activity:', error);
		}
	}
</script>

<svelte:head>
	<title>Plan - Myndness</title>
</svelte:head>

<div class="space-y-6">
	<header>
		<h1 class="text-2xl font-semibold text-gray-900">Plan</h1>
		<p class="text-gray-600">Schedule activities that bring you joy and accomplishment.</p>
	</header>

	{#if isLoading}
		<div class="space-y-4">
			{#each [1, 2, 3] as _}
				<div class="card p-4 animate-pulse">
					<div class="h-16 bg-gray-200 rounded"></div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Today's Quick View -->
		<section class="space-y-3">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Today</h2>
				<a href="{base}/plan/today" class="text-sm text-primary-600 hover:text-primary-700">
					View full plan
				</a>
			</div>

			{#if todayActivities.length === 0}
				<a
					href="{base}/plan/today"
					class="block card p-6 text-center border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
				>
					<svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<p class="text-gray-600 font-medium">Plan your day</p>
					<p class="text-sm text-gray-400 mt-1">Tap to add activities</p>
				</a>
			{:else}
				<!-- Progress card -->
				<div class="card p-4">
					<div class="flex items-center gap-4">
						<div class="w-14 h-14 relative flex-shrink-0">
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
									stroke-dasharray="{todayStats.rate}, 100"
								/>
							</svg>
							<span class="absolute inset-0 flex items-center justify-center text-sm font-semibold">
								{todayStats.rate}%
							</span>
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900">
								{todayStats.completed} of {todayStats.total} completed
							</p>
							<p class="text-sm text-gray-500">
								{#if todayStats.completed === todayStats.total && todayStats.total > 0}
									All done for today
								{:else if nextActivity()}
									Next: {nextActivity()?.activity}
								{:else}
									Keep going!
								{/if}
							</p>
						</div>
					</div>
				</div>

				<!-- Next activity quick action -->
				{#if nextActivity()}
					{@const next = nextActivity()}
					<div class="card p-4 bg-primary-50 border-primary-100">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs text-primary-600 uppercase font-medium">{next?.timeBlock}</p>
								<p class="font-medium text-gray-900">{next?.activity}</p>
								{#if next?.estimatedDuration}
									<p class="text-sm text-gray-500">{next.estimatedDuration} min</p>
								{/if}
							</div>
							<button
								type="button"
								onclick={() => next?.id && quickComplete(next.id)}
								class="btn-success py-2 px-4"
							>
								Done
							</button>
						</div>
					</div>
				{/if}
			{/if}
		</section>

		<!-- Quick Actions -->
		<section class="space-y-3">
			<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-3">
				<a
					href="{base}/plan/today"
					class="card card-hover p-4 flex flex-col items-center text-center"
				>
					<div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
						<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
					</div>
					<span class="font-medium text-gray-900">Plan Today</span>
					<span class="text-xs text-gray-500">Add activities</span>
				</a>

				<a
					href="{base}/plan/library"
					class="card card-hover p-4 flex flex-col items-center text-center"
				>
					<div class="w-12 h-12 rounded-full bg-mindful-100 flex items-center justify-center mb-2">
						<svg class="w-6 h-6 text-mindful-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
					</div>
					<span class="font-medium text-gray-900">Activity Library</span>
					<span class="text-xs text-gray-500">Browse ideas</span>
				</a>
			</div>
		</section>

		<!-- Week Overview -->
		{#if weekStats.planned > 0}
			<section class="space-y-3">
				<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">This Week</h2>
				<div class="card p-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-2xl font-semibold text-gray-900">{weekStats.completed}</p>
							<p class="text-sm text-gray-500">activities completed</p>
						</div>
						<div class="text-right">
							<p class="text-2xl font-semibold text-gray-900">{weekStats.rate}%</p>
							<p class="text-sm text-gray-500">completion rate</p>
						</div>
					</div>
					{#if weekStats.rate >= 70}
						<p class="mt-3 text-sm text-success-600">
							You're doing well this week.
						</p>
					{:else if weekStats.planned > 0}
						<p class="mt-3 text-sm text-gray-500">
							Each activity counts. Keep going.
						</p>
					{/if}
				</div>
			</section>
		{/if}

		<!-- BA Education Note -->
		<section class="card p-4 bg-gray-50">
			<div class="flex items-start gap-3">
				<svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<div>
					<p class="text-sm text-gray-600">
						<strong>Behavioral Activation</strong> is an evidence-based approach that helps improve mood by gradually increasing engagement in meaningful activities.
					</p>
				</div>
			</div>
		</section>
	{/if}
</div>
