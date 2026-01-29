<!-- src/routes/tools/breakdown/[id]/+page.svelte -->
<!-- Task Execution Page -->

<script lang="ts">
	import { page } from '$app/stores';
	import TaskExecution from '$lib/components/taskBreakdown/TaskExecution.svelte';

	const breakdownId = $derived(parseInt($page.params.id));
</script>

<svelte:head>
	<title>Task Execution - Myndness</title>
</svelte:head>

<main>
	<TaskExecution {breakdownId} />
</main>
