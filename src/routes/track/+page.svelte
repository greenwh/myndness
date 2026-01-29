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

		<!-- Energy/Spoons Assessment -->
		<a href="{base}/track/energy" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Energy Level</h2>
					<p class="text-sm text-gray-600">Assess morning spoons & capacity</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- Special Interests -->
		<a href="{base}/track/interests" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Special Interests</h2>
					<p class="text-sm text-gray-600">Track time with things you love</p>
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
