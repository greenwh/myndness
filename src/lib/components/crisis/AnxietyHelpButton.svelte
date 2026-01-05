<script lang="ts">
	// Floating crisis button - always accessible
	// Positioned above the navigation bar
</script>

<a
	href="/crisis"
	class="fixed right-4 bottom-24 z-crisis flex items-center justify-center
		   w-16 h-16 rounded-full bg-danger-500 text-white shadow-lg
		   hover:bg-danger-600 active:bg-danger-700
		   focus:outline-none focus-visible:ring-4 focus-visible:ring-danger-300
		   transition-all duration-200 hover:scale-105"
	aria-label="Need help with anxiety? Access crisis tools"
>
	<!-- Calm breath icon -->
	<svg
		class="w-8 h-8"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		aria-hidden="true"
	>
		<!-- Wind/breath icon -->
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
		/>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
		/>
	</svg>
</a>

<style>
	/* Ensure button stays above everything */
	a {
		/* Subtle pulse animation to draw attention when needed */
		animation: subtle-pulse 3s ease-in-out infinite;
	}

	@keyframes subtle-pulse {
		0%,
		100% {
			box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -4px rgba(239, 68, 68, 0.3);
		}
		50% {
			box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.5), 0 4px 6px -4px rgba(239, 68, 68, 0.5);
		}
	}

	/* Respect reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		a {
			animation: none;
		}
	}
</style>
