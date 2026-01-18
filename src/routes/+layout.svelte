<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import '../app.css';
	import Navigation from '$lib/components/common/Navigation.svelte';
	import AnxietyHelpButton from '$lib/components/crisis/AnxietyHelpButton.svelte';
	import MovementReminder from '$lib/components/movement/MovementReminder.svelte';
	import { initializeDatabase, getSettings, needsOnboarding } from '$lib/db';
	import { initMovementTracking } from '$lib/utils/movementTracking';
	import { scheduleDailyNotifications } from '$lib/utils/notificationHelpers';
	import type { Settings } from '$lib/db/types';

	let { children } = $props();

	// Handle GitHub Pages SPA redirect and initialize database
	onMount(async () => {
		if (browser) {
			// Initialize database (seeds activity library on first run)
			await initializeDatabase();

			// Initialize movement tracking
			initMovementTracking();

			// Load and apply settings
			const settings = await getSettings();
			if (settings) {
				applySettings(settings);

				// Schedule notifications if enabled
				if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
					scheduleDailyNotifications(settings);
				}
			}

			// Check if onboarding is needed
			const currentPath = window.location.pathname;
			if (!currentPath.includes('/onboarding')) {
				const needsOnboard = await needsOnboarding();
				if (needsOnboard) {
					goto(`${base}/onboarding`, { replaceState: true });
					return;
				}
			}

			// Handle SPA redirect from 404.html
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

	function applySettings(settings: Settings) {
		const html = document.documentElement;

		// Theme
		html.classList.remove('dark-mode');
		if (settings.theme === 'dark') {
			html.classList.add('dark-mode');
		} else if (settings.theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (prefersDark) html.classList.add('dark-mode');
		}

		// Font size
		html.classList.remove('font-large', 'font-extra-large');
		if (settings.fontSize === 'large') {
			html.classList.add('font-large');
		} else if (settings.fontSize === 'extra-large') {
			html.classList.add('font-extra-large');
		}

		// High contrast
		html.classList.toggle('high-contrast', settings.highContrast);

		// Reduced motion (also handled by CSS media query)
		if (settings.reducedMotion) {
			html.classList.add('reduce-motion');
		}
	}
</script>

<svelte:head>
	<title>Myndness - Mental Wellness Companion</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-20">
	<!-- Movement reminder banner (shows after 75 min) -->
	<MovementReminder />

	<!-- Main content area with bottom padding for nav -->
	<main class="max-w-lg mx-auto px-4 py-6">
		{@render children()}
	</main>

	<!-- Floating crisis/help button -->
	<AnxietyHelpButton />

	<!-- Bottom navigation -->
	<Navigation />
</div>
