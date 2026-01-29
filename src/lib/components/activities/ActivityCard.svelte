<script lang="ts">
	import type { PlannedActivity, ActivityLibraryItem, ActivityCategory } from '$lib/db/types';

	// Props - either a library item or a planned activity
	interface Props {
		activity?: PlannedActivity;
		libraryItem?: ActivityLibraryItem;
		mode: 'library' | 'planner' | 'completed';
		onAdd?: (item: ActivityLibraryItem) => void;
		onComplete?: (id: number) => void;
		onRate?: (id: number) => void;
		onRemove?: (id: number) => void;
		exceedsCapacity?: boolean;
		remainingSpoons?: number;
	}

	let {
		activity,
		libraryItem,
		mode,
		onAdd,
		onComplete,
		onRate,
		onRemove,
		exceedsCapacity = false,
		remainingSpoons
	}: Props = $props();

	// Category colors and labels
	const categoryConfig: Record<ActivityCategory, { color: string; bg: string; label: string }> = {
		social: { color: 'text-primary-700', bg: 'bg-primary-100', label: 'Social' },
		creative: { color: 'text-mindful-700', bg: 'bg-mindful-100', label: 'Creative' },
		physical: { color: 'text-success-700', bg: 'bg-success-100', label: 'Physical' },
		learning: { color: 'text-warning-700', bg: 'bg-warning-100', label: 'Learning' },
		mastery: { color: 'text-gray-700', bg: 'bg-gray-200', label: 'Mastery' },
		pleasure: { color: 'text-danger-700', bg: 'bg-danger-100', label: 'Pleasure' }
	};

	// Derive display data from either source
	const name = $derived(activity?.activity || libraryItem?.name || '');
	const category = $derived(activity?.category || libraryItem?.category || 'pleasure');
	const duration = $derived(activity?.estimatedDuration || libraryItem?.estimatedDuration);
	const spoonCost = $derived(activity?.spoonCost || libraryItem?.spoonCost);
	const description = $derived(libraryItem?.description);
	const isCompleted = $derived(activity?.completed || false);
	const config = $derived(categoryConfig[category]);

	// Get spoon cost color
	function getSpoonCostColor(cost: number): string {
		if (cost <= 3) return 'bg-green-100 text-green-700';
		if (cost <= 6) return 'bg-amber-100 text-amber-700';
		return 'bg-red-100 text-red-700';
	}

	// Handle add to planner
	function handleAdd() {
		if (libraryItem && onAdd) {
			onAdd(libraryItem);
		}
	}

	// Handle complete toggle
	function handleComplete() {
		if (activity?.id && onComplete) {
			onComplete(activity.id);
		}
	}

	// Handle rate activity
	function handleRate() {
		if (activity?.id && onRate) {
			onRate(activity.id);
		}
	}

	// Handle remove from planner
	function handleRemove() {
		if (activity?.id && onRemove) {
			onRemove(activity.id);
		}
	}
</script>

<div
	class="card p-4 {isCompleted ? 'bg-success-50 border-success-200' : ''}"
	class:opacity-75={isCompleted}
>
	<div class="flex items-start gap-3">
		<!-- Completion checkbox for planner mode -->
		{#if mode === 'planner'}
			<button
				type="button"
				onclick={handleComplete}
				class="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center touch-target
					{isCompleted
						? 'bg-success-500 border-success-500'
						: 'border-gray-300 hover:border-primary-400'}"
				aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
			>
				{#if isCompleted}
					<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
					</svg>
				{/if}
			</button>
		{/if}

		<!-- Activity content -->
		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2 mb-1 flex-wrap">
				<span class="badge {config.bg} {config.color}">{config.label}</span>
				{#if duration}
					<span class="text-xs text-gray-500">{duration} min</span>
				{/if}
				{#if spoonCost}
					<span class="badge {getSpoonCostColor(spoonCost)} text-xs font-semibold">
						{spoonCost} {spoonCost === 1 ? 'spoon' : 'spoons'}
					</span>
				{/if}
			</div>

			<h3 class="font-medium text-gray-900 {isCompleted ? 'line-through' : ''}">
				{name}
			</h3>

			<!-- Capacity warning -->
			{#if mode === 'library' && exceedsCapacity && remainingSpoons !== undefined}
				<p class="text-xs text-amber-600 mt-1 font-medium">
					⚠️ This costs {spoonCost} spoons, you have {remainingSpoons} remaining
				</p>
			{/if}

			{#if description && mode === 'library'}
				<p class="text-sm text-gray-500 mt-1">{description}</p>
			{/if}

			<!-- Ratings display for completed activities -->
			{#if mode === 'completed' && activity?.enjoyment !== undefined}
				<div class="flex gap-4 mt-2 text-sm">
					<span class="text-gray-600">
						Enjoyment: <span class="font-medium">{activity.enjoyment}/10</span>
					</span>
					{#if activity.mastery !== undefined}
						<span class="text-gray-600">
							Mastery: <span class="font-medium">{activity.mastery}/10</span>
						</span>
					{/if}
				</div>
			{/if}

			<!-- Usage stats for library items -->
			{#if mode === 'library' && libraryItem && libraryItem.timesCompleted > 0}
				<p class="text-xs text-gray-400 mt-1">
					Completed {libraryItem.timesCompleted} time{libraryItem.timesCompleted !== 1 ? 's' : ''}
					{#if libraryItem.averageEnjoyment}
						&middot; Avg enjoyment: {libraryItem.averageEnjoyment.toFixed(1)}
					{/if}
				</p>
			{/if}
		</div>

		<!-- Actions -->
		<div class="flex-shrink-0 flex items-center gap-1">
			{#if mode === 'library'}
				<button
					type="button"
					onclick={handleAdd}
					class="btn-icon bg-primary-100 text-primary-600 hover:bg-primary-200 rounded-full"
					aria-label="Add to today's plan"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			{:else if mode === 'planner'}
				{#if isCompleted && !activity?.enjoyment}
					<button
						type="button"
						onclick={handleRate}
						class="btn-secondary text-sm py-2 px-3"
					>
						Rate
					</button>
				{/if}
				<button
					type="button"
					onclick={handleRemove}
					class="btn-icon text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-full"
					aria-label="Remove from plan"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
</div>
