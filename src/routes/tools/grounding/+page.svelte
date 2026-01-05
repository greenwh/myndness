<script lang="ts">
	import { goto } from '$app/navigation';
	import Grounding54321 from '$lib/components/grounding/Grounding54321.svelte';

	function handleComplete() {
		goto('/');
	}

	function handleExit() {
		goto('/');
	}
</script>

<svelte:head>
	<title>5-4-3-2-1 Grounding - Myndness</title>
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-10rem)]">
	<!-- Header -->
	<header class="text-center mb-6">
		<h1 class="text-2xl font-semibold text-gray-900 mb-2">Grounding Exercise</h1>
		<p class="text-gray-600 max-w-xs mx-auto">
			Use your senses to reconnect with the present moment.
		</p>
	</header>

	<!-- Grounding Exercise -->
	<div class="flex-1">
		<Grounding54321 onComplete={handleComplete} onExit={handleExit} />
	</div>

	<!-- Back link -->
	<div class="text-center mt-6">
		<a href="/" class="text-sm text-gray-500 hover:text-gray-700">
			← Back to home
		</a>
	</div>
</div>
