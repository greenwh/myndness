<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { db } from '$lib/db';
	import type { ActivityLibraryItem, ActivityCategory, TimeBlock } from '$lib/db/types';
	import ActivityCard from './ActivityCard.svelte';

	interface Props {
		onActivitySelected?: (item: ActivityLibraryItem, timeBlock: TimeBlock) => void;
		selectedTimeBlock?: TimeBlock;
	}

	let { onActivitySelected, selectedTimeBlock = 'morning' }: Props = $props();

	// State
	let activities = $state<ActivityLibraryItem[]>([]);
	let selectedCategory = $state<ActivityCategory | 'all'>('all');
	let searchQuery = $state('');
	let isLoading = $state(true);
	let showCustomForm = $state(false);
	let customName = $state('');
	let customCategory = $state<ActivityCategory>('pleasure');
	let customDuration = $state(30);

	// Categories for filter
	const categories: { value: ActivityCategory | 'all'; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'physical', label: 'Physical' },
		{ value: 'social', label: 'Social' },
		{ value: 'creative', label: 'Creative' },
		{ value: 'learning', label: 'Learning' },
		{ value: 'mastery', label: 'Mastery' },
		{ value: 'pleasure', label: 'Pleasure' }
	];

	// Filtered activities (use toSorted to avoid mutating $state)
	const filteredActivities = $derived(() => {
		let result = activities;

		// Filter by category
		if (selectedCategory !== 'all') {
			result = result.filter((a) => a.category === selectedCategory);
		}

		// Filter by search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(a) =>
					a.name.toLowerCase().includes(query) ||
					(a.description && a.description.toLowerCase().includes(query))
			);
		}

		// Sort: most used first, then alphabetically
		// Use toSorted() to avoid mutating when no filters applied
		return result.toSorted((a, b) => {
			if (b.timesCompleted !== a.timesCompleted) {
				return b.timesCompleted - a.timesCompleted;
			}
			return a.name.localeCompare(b.name);
		});
	});

	// Load activities on mount
	onMount(async () => {
		if (!browser) return;

		try {
			activities = await db.activityLibrary.toArray();
		} catch (error) {
			console.error('Failed to load activity library:', error);
		} finally {
			isLoading = false;
		}
	});

	// Handle adding activity to plan
	function handleAddActivity(item: ActivityLibraryItem) {
		if (onActivitySelected) {
			onActivitySelected(item, selectedTimeBlock);
		}
	}

	// Handle adding custom activity
	async function handleAddCustom() {
		if (!customName.trim()) return;

		try {
			const newActivity: Omit<ActivityLibraryItem, 'id'> = {
				name: customName.trim(),
				category: customCategory,
				estimatedDuration: customDuration,
				isDefault: false,
				timesCompleted: 0
			};

			const id = await db.activityLibrary.add(newActivity);
			const savedActivity = { ...newActivity, id } as ActivityLibraryItem;

			// Add to local state
			activities = [...activities, savedActivity];

			// Add to plan
			if (onActivitySelected) {
				onActivitySelected(savedActivity, selectedTimeBlock);
			}

			// Reset form
			customName = '';
			showCustomForm = false;
		} catch (error) {
			console.error('Failed to add custom activity:', error);
		}
	}
</script>

<div class="space-y-4">
	<!-- Search -->
	<div class="relative">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Search activities..."
			class="input pl-10"
		/>
		<svg
			class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>

	<!-- Category filters -->
	<div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
		{#each categories as cat}
			<button
				type="button"
				onclick={() => (selectedCategory = cat.value)}
				class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
					{selectedCategory === cat.value
					? 'bg-primary-600 text-white'
					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
			>
				{cat.label}
			</button>
		{/each}
	</div>

	<!-- Activity list -->
	{#if isLoading}
		<div class="space-y-3">
			{#each [1, 2, 3] as _}
				<div class="card p-4 animate-pulse">
					<div class="flex gap-3">
						<div class="flex-1 space-y-2">
							<div class="h-4 bg-gray-200 rounded w-20"></div>
							<div class="h-5 bg-gray-200 rounded w-3/4"></div>
						</div>
						<div class="w-11 h-11 bg-gray-200 rounded-full"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if filteredActivities().length === 0}
		<div class="text-center py-8">
			<p class="text-gray-500">No activities found.</p>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (showCustomForm = true)}
					class="btn-primary mt-4"
				>
					Add "{searchQuery}" as custom activity
				</button>
			{/if}
		</div>
	{:else}
		<div class="space-y-3">
			{#each filteredActivities() as item (item.id)}
				<ActivityCard
					libraryItem={item}
					mode="library"
					onAdd={handleAddActivity}
				/>
			{/each}
		</div>
	{/if}

	<!-- Add custom activity button -->
	{#if !showCustomForm}
		<button
			type="button"
			onclick={() => (showCustomForm = true)}
			class="w-full btn-secondary flex items-center justify-center gap-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Add custom activity
		</button>
	{/if}

	<!-- Custom activity form -->
	{#if showCustomForm}
		<div class="card p-4 border-2 border-primary-200 bg-primary-50">
			<h3 class="font-medium text-gray-900 mb-4">Add Custom Activity</h3>

			<div class="space-y-4">
				<div>
					<label for="custom-name" class="label">Activity name</label>
					<input
						id="custom-name"
						type="text"
						bind:value={customName}
						placeholder="e.g., Walk in the park"
						class="input"
					/>
				</div>

				<div>
					<label for="custom-category" class="label">Category</label>
					<select id="custom-category" bind:value={customCategory} class="input">
						<option value="physical">Physical</option>
						<option value="social">Social</option>
						<option value="creative">Creative</option>
						<option value="learning">Learning</option>
						<option value="mastery">Mastery</option>
						<option value="pleasure">Pleasure</option>
					</select>
				</div>

				<div>
					<label for="custom-duration" class="label">Duration (minutes)</label>
					<input
						id="custom-duration"
						type="number"
						bind:value={customDuration}
						min="5"
						max="180"
						step="5"
						class="input"
					/>
				</div>

				<div class="flex gap-3">
					<button
						type="button"
						onclick={handleAddCustom}
						disabled={!customName.trim()}
						class="btn-primary flex-1"
					>
						Add to plan
					</button>
					<button
						type="button"
						onclick={() => (showCustomForm = false)}
						class="btn-secondary"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
