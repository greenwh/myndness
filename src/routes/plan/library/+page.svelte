<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { ActivityLibraryItem, TimeBlock } from '$lib/db/types';
	import ActivityLibrary from '$lib/components/activities/ActivityLibrary.svelte';

	// State for time block selection
	let showTimeBlockPicker = $state(false);
	let pendingActivity = $state<ActivityLibraryItem | null>(null);

	// Handle activity selection - show time block picker
	function handleActivitySelected(item: ActivityLibraryItem) {
		pendingActivity = item;
		showTimeBlockPicker = true;
	}

	// Add to today's plan with selected time block
	async function addToToday(timeBlock: TimeBlock) {
		if (!pendingActivity) return;

		const today = new Date().toISOString().split('T')[0];

		try {
			await db.plannedActivities.add({
				date: today,
				createdAt: new Date().toISOString(),
				activity: pendingActivity.name,
				category: pendingActivity.category,
				timeBlock,
				estimatedDuration: pendingActivity.estimatedDuration,
				completed: false
			});

			// Navigate to today's plan
			goto(`${base}/plan/today`);
		} catch (error) {
			console.error('Failed to add activity:', error);
		}
	}

	// Time block options
	const timeBlocks: { value: TimeBlock; label: string; description: string }[] = [
		{ value: 'morning', label: 'Morning', description: 'Before noon' },
		{ value: 'afternoon', label: 'Afternoon', description: '12pm - 5pm' },
		{ value: 'evening', label: 'Evening', description: 'After 5pm' }
	];
</script>

<svelte:head>
	<title>Activity Library - Myndness</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header with back button -->
	<header class="flex items-center gap-3">
		<a
			href="{base}/plan"
			class="btn-icon bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0"
			aria-label="Back to plan overview"
		>
			<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<div>
			<h1 class="text-2xl font-semibold text-gray-900">Activity Library</h1>
			<p class="text-gray-500">Browse ideas and add to your plan</p>
		</div>
	</header>

	<!-- Category descriptions -->
	<div class="card p-4 bg-gray-50">
		<h2 class="font-medium text-gray-900 mb-2">Activity Categories</h2>
		<div class="grid grid-cols-2 gap-2 text-sm">
			<div class="flex items-center gap-2">
				<span class="badge bg-success-100 text-success-700">Physical</span>
				<span class="text-gray-500">Movement</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="badge bg-primary-100 text-primary-700">Social</span>
				<span class="text-gray-500">Connection</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="badge bg-mindful-100 text-mindful-700">Creative</span>
				<span class="text-gray-500">Expression</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="badge bg-warning-100 text-warning-700">Learning</span>
				<span class="text-gray-500">Growth</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="badge bg-gray-200 text-gray-700">Mastery</span>
				<span class="text-gray-500">Achievement</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="badge bg-danger-100 text-danger-700">Pleasure</span>
				<span class="text-gray-500">Enjoyment</span>
			</div>
		</div>
	</div>

	<!-- Library component -->
	<ActivityLibrary onActivitySelected={handleActivitySelected} />
</div>

<!-- Time block picker modal -->
{#if showTimeBlockPicker && pendingActivity}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-modal"
		onclick={() => (showTimeBlockPicker = false)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="timeblock-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 safe-bottom animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<h2 id="timeblock-title" class="text-xl font-semibold text-gray-900 mb-2">
				When would you like to do this?
			</h2>
			<p class="text-gray-600 mb-6">{pendingActivity.name}</p>

			<div class="space-y-2">
				{#each timeBlocks as block}
					<button
						type="button"
						onclick={() => addToToday(block.value)}
						class="w-full card card-hover p-4 flex items-center justify-between text-left"
					>
						<div>
							<p class="font-medium text-gray-900">{block.label}</p>
							<p class="text-sm text-gray-500">{block.description}</p>
						</div>
						<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{/each}
			</div>

			<button
				type="button"
				onclick={() => (showTimeBlockPicker = false)}
				class="w-full btn-secondary mt-4"
			>
				Cancel
			</button>
		</div>
	</div>
{/if}
