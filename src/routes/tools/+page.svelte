<script lang="ts">
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
		<a href="/tools/breathing" class="card card-hover p-4">
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

		<!-- Grounding (coming soon) -->
		<div class="card p-4 opacity-60">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-mindful-100 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-mindful-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-semibold text-gray-900">5-4-3-2-1 Grounding</h2>
					<p class="text-sm text-gray-600">Coming soon</p>
				</div>
			</div>
		</div>

		<!-- Mindfulness (coming soon) -->
		<div class="card p-4 opacity-60">
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
					<h2 class="font-semibold text-gray-900">Mindfulness Timer</h2>
					<p class="text-sm text-gray-600">Coming soon</p>
				</div>
			</div>
		</div>
	</div>
</div>
