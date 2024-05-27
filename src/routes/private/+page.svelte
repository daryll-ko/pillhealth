<script lang="ts">
	import { dialogOpen } from '$lib/stores';
	import MedicineDialog from '$lib/components/MedicineDialog.svelte';
	import MedicineBox from '$lib/components/MedicineBox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	export let data;
	export let form;

	let medicines;
	$: medicines = form?.medicines || data.medicines;

	let userData;
	$: userData = form?.userData || data.userData;
</script>

{#if $dialogOpen}
	<MedicineDialog medicines={medicines} />
{/if}

<div class="flex flex-col w-[80%] gap-12">
	<div class="text-[#333333] text-center flex flex-col gap-3">
		<h1 class="text-4xl font-bold">It's time to take your pills!</h1>
		<p class="text-2xl">Consistency is key to better health.</p>
	</div>
	{#if data.user !== null}
		<MedicineBox medicines={medicines} user={userData} />
	{/if}
</div>
<Sidebar medicines={medicines} user={userData} />
