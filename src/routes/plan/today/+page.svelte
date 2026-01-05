<script lang="ts">
	import { base } from '$app/paths';
	import { format } from 'date-fns';
	import type { ActivityLibraryItem, TimeBlock } from '$lib/db/types';
	import ActivityPlanner from '$lib/components/activities/ActivityPlanner.svelte';
	import ActivityLibrary from '$lib/components/activities/ActivityLibrary.svelte';

	// Today's date
	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	// State
	let showLibrary = $state(false);
	let selectedTimeBlock = $state<TimeBlock>('morning');
	let plannerRef = $state<ActivityPlanner | null>(null);

	// Open library for a specific time block
	function handleOpenLibrary(timeBlock: TimeBlock) {
		selectedTimeBlock = timeBlock;
		showLibrary = true;
	}

	// Add activity from library to planner
	function handleActivitySelected(item: ActivityLibraryItem, timeBlock: TimeBlock) {
		if (plannerRef) {
			plannerRef.addActivityFromLibrary(item, timeBlock);
		}
		showLibrary = false;
	}
</script>

<svelte:head>
	<title>Today's Plan - Myndness</title>
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
			<h1 class="text-2xl font-semibold text-gray-900">Today's Plan</h1>
			<p class="text-gray-500">{format(today, 'EEEE, MMMM d')}</p>
		</div>
	</header>

	<!-- Activity Planner -->
	<ActivityPlanner
		bind:this={plannerRef}
		date={todayStr}
		onOpenLibrary={handleOpenLibrary}
	/>
</div>

<!-- Library slide-up panel -->
{#if showLibrary}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 z-modal"
		onclick={() => (showLibrary = false)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="library-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col safe-bottom animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
				<div>
					<h2 id="library-title" class="text-lg font-semibold text-gray-900">
						Add Activity
					</h2>
					<p class="text-sm text-gray-500">
						Adding to: <span class="font-medium capitalize">{selectedTimeBlock}</span>
					</p>
				</div>
				<button
					type="button"
					onclick={() => (showLibrary = false)}
					class="btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
					aria-label="Close library"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Library content (scrollable) -->
			<div class="flex-1 overflow-y-auto p-4">
				<ActivityLibrary
					selectedTimeBlock={selectedTimeBlock}
					onActivitySelected={handleActivitySelected}
				/>
			</div>
		</div>
	</div>
{/if}
