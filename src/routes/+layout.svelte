<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/common/Navigation.svelte';
	import AnxietyHelpButton from '$lib/components/crisis/AnxietyHelpButton.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Myndness - Mental Wellness Companion</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-20">
	<!-- Main content area with bottom padding for nav -->
	<main class="max-w-lg mx-auto px-4 py-6">
		{@render children()}
	</main>

	<!-- Floating crisis/help button -->
	<AnxietyHelpButton />

	<!-- Bottom navigation -->
	<Navigation />
</div>
