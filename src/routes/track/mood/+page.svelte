<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import MoodLogger from '$lib/components/mood/MoodLogger.svelte';
	import type { MoodLog } from '$lib/db/types';

	let saved = $state(false);

	function handleSaved(entry: MoodLog) {
		saved = true;
	}

	function handleDone() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Log Mood - Myndness</title>
</svelte:head>

<div class="space-y-6">
	<header>
		<h1 class="text-2xl font-semibold text-gray-900">Log Mood</h1>
		<p class="text-gray-600">How are you feeling right now?</p>
	</header>

	<MoodLogger onSaved={handleSaved} />

	<!-- Done button -->
	{#if saved}
		<div class="pt-4">
			<button onclick={handleDone} class="btn-primary w-full">
				Done
			</button>
		</div>
	{/if}

	<a href="{base}/" class="inline-block text-sm text-gray-500 hover:text-gray-700">
		← Back to home
	</a>
</div>
