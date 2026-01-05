<script lang="ts">
	import { goto } from '$app/navigation';
	import BPLogger from '$lib/components/bp/BPLogger.svelte';
	import type { BPReading } from '$lib/db/types';

	function handleSaved(entry: BPReading) {
		// Entry saved - could trigger analytics or notifications
	}
</script>

<svelte:head>
	<title>Log Blood Pressure - Myndness</title>
</svelte:head>

<div class="space-y-6">
	<header>
		<h1 class="text-2xl font-semibold text-gray-900">Blood Pressure</h1>
		<p class="text-gray-600">Record your BP reading</p>
	</header>

	<BPLogger onSaved={handleSaved} />

	<a href="/" class="inline-block text-sm text-gray-500 hover:text-gray-700">
		← Back to home
	</a>
</div>
