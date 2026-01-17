<script lang="ts">
	/**
	 * Thought Record - Edit/view existing entry
	 */

	import { page } from '$app/stores';
	import ThoughtRecordForm from '$lib/components/cbt/ThoughtRecordForm.svelte';

	const id = $derived(parseInt($page.params.id));
</script>

<svelte:head>
	<title>Edit Thought Record - Myndness</title>
</svelte:head>

<ThoughtRecordForm editId={id} />
