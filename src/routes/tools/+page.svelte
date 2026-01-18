<script lang="ts">
	import { base } from '$app/paths';
	// Tools hub page - quick access to all intervention tools
</script>

<svelte:head>
	<title>Tools - Myndness</title>
</svelte:head>

<div class="space-y-6">
	<header>
		<h1 class="text-2xl font-semibold text-gray-900">Tools</h1>
		<p class="text-gray-600">Exercises and techniques for managing anxiety and stress.</p>
	</header>

	<div class="grid gap-4">
		<!-- Breathing Exercises -->
		<a href="{base}/tools/breathing" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">4-7-8 Breathing</h2>
					<p class="text-sm text-gray-600">Calm your nervous system with paced breathing</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- Grounding Exercise -->
		<a href="{base}/tools/grounding" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
					<span class="text-2xl" aria-hidden="true">🌿</span>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">5-4-3-2-1 Grounding</h2>
					<p class="text-sm text-gray-600">Use your senses to reconnect with the present</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- CBT Tools -->
		<a href="{base}/tools/cbt" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
					<span class="text-2xl" aria-hidden="true">🧠</span>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">CBT Tools</h2>
					<p class="text-sm text-gray-600">Challenge unhelpful thinking patterns</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- Mindfulness -->
		<a href="{base}/tools/mindfulness" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Mindfulness</h2>
					<p class="text-sm text-gray-600">Meditation, breath awareness, body scans</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>

		<!-- Movement -->
		<a href="{base}/tools/movement" class="card card-hover p-4">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
					<span class="text-2xl" aria-hidden="true">🥋</span>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">Movement</h2>
					<p class="text-sm text-gray-600">Tai chi, stretching, gentle exercises</p>
				</div>
				<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</a>
	</div>
</div>
