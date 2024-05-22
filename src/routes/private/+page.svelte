<script lang="ts">
	import MedicineBox from '$lib/components/MedicineBox.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	export let data;
</script>

<div class="flex flex-row h-screen">
	<div class="flex flex-col w-[80%] gap-8">
		<Navbar {data} />
		<div class="text-[#333333] text-center flex flex-col gap-3">
			<h1 class="text-4xl font-bold">It's time to take your pills!</h1>
			<p class="text-2xl">Consistency is key to better health.</p>
		</div>
		<MedicineBox medicines={data.medicines} user={data.users[0]} />
	</div>
	<Sidebar medicines={data.medicines} />
</div>
