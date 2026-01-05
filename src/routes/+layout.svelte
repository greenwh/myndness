<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import '../app.css';
	import Navigation from '$lib/components/common/Navigation.svelte';
	import AnxietyHelpButton from '$lib/components/crisis/AnxietyHelpButton.svelte';

	let { children } = $props();

	// Handle GitHub Pages SPA redirect
	onMount(() => {
		if (browser) {
			const redirect = sessionStorage.getItem('redirect');
			if (redirect) {
				sessionStorage.removeItem('redirect');
				// Remove base path prefix if present to get the route
				const route = redirect.startsWith(base) ? redirect.slice(base.length) : redirect;
				if (route && route !== '/' && route !== window.location.pathname) {
					goto(route, { replaceState: true });
				}
			}
		}
	});
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
