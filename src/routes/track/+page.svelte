<script lang="ts">
	import { base } from '$app/paths';
	// Track hub page - links to all tracking features
</script>

<svelte:head>
	<title>Track - Myndness</title>
</svelte:head>

<div class="space-y-6">
	<header>
		<h1 class="text-2xl font-semibold text-gray-900">Track</h1>
		<p class="text-gray-600">Log your mood, activities, and health data.</p>
	</header>

	<div class="grid gap-4">
		<!-- Mood Logging -->
		<a href="{base}/track/mood" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Mood & Anxiety</h2>
					<p class="text-sm text-gray-600">Track how you're feeling right now</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- BP Logging -->
		<a href="{base}/track/bp" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Blood Pressure</h2>
					<p class="text-sm text-gray-600">Record systolic/diastolic readings</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- Activities -->
		<a href="{base}/track/activities" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Activities</h2>
					<p class="text-sm text-gray-600">Log completed exercises and activities</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>
	</div>
</div>
