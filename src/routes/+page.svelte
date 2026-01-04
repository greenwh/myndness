<script lang="ts">
	import { format } from 'date-fns';

	// Get current date info
	const today = new Date();
	const greeting = getGreeting();

	function getGreeting(): string {
		const hour = today.getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 17) return 'Good afternoon';
		return 'Good evening';
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold text-gray-900">{greeting}</h1>
		<p class="text-gray-600">{format(today, 'EEEE, MMMM d')}</p>
	</header>

	<!-- Quick Actions -->
	<section class="space-y-3">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Actions</h2>
		<div class="grid grid-cols-2 gap-3">
			<a
				href="/tools/breathing"
				class="card card-hover p-4 flex flex-col items-center text-center"
			>
				<div
					class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2"
				>
					<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
						/>
					</svg>
				</div>
				<span class="font-medium text-gray-900">Breathing</span>
				<span class="text-xs text-gray-500">4-7-8 exercise</span>
			</a>

			<a
				href="/track/mood"
				class="card card-hover p-4 flex flex-col items-center text-center"
			>
				<div
					class="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center mb-2"
				>
					<svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<span class="font-medium text-gray-900">Log Mood</span>
				<span class="text-xs text-gray-500">Track how you feel</span>
			</a>
		</div>
	</section>

	<!-- Today's Status (placeholder) -->
	<section class="space-y-3">
		<h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Today</h2>
		<div class="card p-4">
			<p class="text-gray-600 text-center py-4">
				Start tracking to see your daily summary here.
			</p>
		</div>
	</section>

	<!-- Crisis Help Notice -->
	<section class="card p-4 bg-primary-50 border-primary-100">
		<div class="flex items-start gap-3">
			<div class="flex-shrink-0">
				<svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm text-primary-800">
					Feeling anxious? Tap the red button in the corner anytime to start a breathing exercise.
				</p>
			</div>
		</div>
	</section>
</div>
