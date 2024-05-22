<script lang="ts">
	import { selectedSector } from '$lib/stores';
	import type { Medicine, User } from '$lib/types';

	export let medicines: Medicine[];
	export let user: User;

	$: timestamps = [
		user.sector_1,
		user.sector_2,
		user.sector_3,
		user.sector_4,
		user.sector_5,
		user.sector_6,
		user.sector_7,
		user.sector_8
	];

	$: medicinesPerSector = medicines
		.flatMap((medicine) =>
			Array.from(medicine.in_sectors).map((sector) => ({
				sector,
				medicine
			}))
		)
		.reduce(
			(sectors, { sector, medicine }) =>
				sectors.map((s, i) => (sector === i ? [...s, medicine] : s)),
			[...Array(8)].map(() => [] as Medicine[])
		);

	$: sectors = timestamps.map((timestamp, i) => ({
		timestamp: i === 2 ? new Date() : timestamp,
		medicines: timestamp > new Date() ? medicinesPerSector[i] : []
	}));

	let selectedSectorValue = -1;
	selectedSector.subscribe((val) => (selectedSectorValue = val));

	function setSelectedSector(sector: number) {
		selectedSector.update(() => sector);
	}

	let current = 2;
	// setInterval(() => (current = (current + 1) % NUM_SECTORS), 1000);
</script>

<div class="grid grid-cols-4 grid-rows-2 mx-auto gap-8">
	{#each sectors as { timestamp, medicines }, i}
		<button
			on:click={() => setSelectedSector(i)}
			class={`transition-all max-w-40 border-2 border-solid border-gray-300 overflow-hidden rounded-md hover:scale-105 ${i === current ? 'border-theme scale-105' : ''}`}
		>
			<div
				class={`flex flex-row border-b-2 border-gray-300 border-solid text-sm ${i === current ? 'border-theme' : ''}`}
			>
				<div
					class={`border-solid border-r-2 border-gray-300 ${i === current ? 'border-theme' : ''}`}
				>
					<div
						class={`text-xl font-bold px-3 border-solid border border-gray-300 ${i === current ? 'bg-theme text-white border-theme' : 'bg-gray-300 text-[#6b6b6b]'}`}
					>
						#{i + 1}
					</div>
					<div
						class={`flex flex-col items-center justify-center pb-1 ${i === current ? 'bg-[#f0fff8]' : ''}`}
					>
						<p class="text-lg -mb-1">{timestamp.toLocaleString('default', { day: 'numeric' })}</p>
						<p>{timestamp.toLocaleString('default', { month: 'long' })}</p>
					</div>
				</div>
				<div
					class={`flex flex-col justify-center items-center text-lg w-full text-md ${i === current ? 'bg-[#f0fff8]' : ''}`}
				>
					<p>{timestamp.toLocaleString('default', { weekday: 'long' })}</p>
					<p>{timestamp.toLocaleString('default', { timeStyle: 'short' })}</p>
				</div>
			</div>
			<div
				class={`h-20 flex flex-wrap gap-1 rounded-md p-1 ${i === current ? 'bg-[#f0fff8]' : 'bg-[#f8f8f8'}`}
			>
				{#each medicines as medicine}
					<div class="rounded-full h-6 w-6" style={`background-color: ${medicine.color}`}></div>
				{/each}
			</div>
		</button>
	{/each}
</div>
<div class="flex flex-row gap-6 justify-center">
	<button
		class="bg-theme/80 text-white rounded-xl text-xl font-bold py-2 px-6 hover:bg-theme transition-all disabled:bg-gray-300"
	>
		Take medications</button
	>
	<button
		disabled={selectedSectorValue === -1}
		class="bg-theme/80 text-white rounded-xl text-xl font-bold py-2 px-6 hover:bg-theme transition-all disabled:bg-gray-300"
		on:click={() => setSelectedSector(-1)}>See all medications</button
	>
</div>
