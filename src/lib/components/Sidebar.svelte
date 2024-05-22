<script lang="ts">
	import { selectedSector } from '$lib/stores';
	import type { Medicine } from '$lib/types';

	import { EditSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import Accordion from './Accordion.svelte';

	export let medicines: Medicine[];
	let selectedSectorValue = -1;

	$: medicinesToShow =
		selectedSectorValue === -1
			? medicines
			: medicines.filter((medicine) => medicine.in_sectors.has(selectedSectorValue));

	selectedSector.subscribe((val) => (selectedSectorValue = val));

	let time = new Date().toLocaleTimeString();
	setInterval(() => (time = new Date().toLocaleTimeString()), 1000);
</script>

<div class="flex flex-col items-center gap-8 bg-theme p-8 w-[20%]">
	<div class="bg-[#333333] rounded-lg px-1 py-2 flex justify-center w-full">
		<span class="text-4xl font-bold text-white">{time}</span>
	</div>
	<div class="flex flex-row justify-between w-full items-center gap-3">
		<h1 class="text-white">
			<p class="text-3xl font-bold">Medications</p>
			<p>
				{selectedSectorValue === -1 ? 'All medications' : `Sector ${selectedSectorValue + 1}`}
			</p>
		</h1>
		<a
			href="/add"
			class="bg-yellow-500 rounded-full h-6 w-6 font-bold text-2xl flex justify-center items-center hover:scale-110 text-white transition-all"
			><span class="pb-1">+</span></a
		>
	</div>
	<div class="flex flex-col gap-5 w-full overflow-y-scroll">
		{#each medicinesToShow as medicine}
			<div class="rounded-lg bg-white flex flex-col justify-center gap-2">
				<Accordion open={false}>
					<div slot="head" class="flex flex-row items-center border-b-4 border-solid border-theme divide-x-4 divide-solid divide-theme">
						<p class="flex flex-row items-center gap-3 pl-3">
							<span class="rounded-full h-6 w-6" style={`background-color: ${medicine.color}`}
							></span>
							<span class="max-w-10">{medicine.name}</span>
						</p>
						<div
							class="ml-auto flex flex-col items-center divide-y-4 divide-solid divide-theme"
						>
							<a
								href="/edit"
								class="bg-theme/60 w-8 h-8 flex justify-center items-center text-white transition-all hover:bg-theme/80"
								><EditSolid /></a
							>
							<button
								class="bg-red-500/60 text-white w-8 h-8 flex justify-center items-center transition-all hover:bg-red-500/80"
								><TrashBinSolid /></button
							>
						</div>
					</div>
					<div slot="details" class="p-3 pt-1">
						<p class="p-3 rounded-md bg-gray-200">{medicine.description}</p>
					</div>
				</Accordion>
			</div>
		{/each}
	</div>
</div>
