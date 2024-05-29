<script lang="ts">
	import { enhance } from '$app/forms';
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
	].map((timestamp) => (timestamp ? new Date(timestamp) : null));

	let medicinesPerSector: Medicine[][];
	$: medicinesPerSector = medicines
		.flatMap((medicine) =>
			Array.from(medicine.in_sectors).map((sector) => ({
				sector,
				medicine
			}))
		)
		.reduce(
			(sectors, { sector, medicine }) =>
				sectors.map((s, i) => (sector === i ? [...s, medicine].sort((a, b) => a.id - b.id) : s)),
			[...Array(8)].map(() => [] as Medicine[])
		);

	$: sectors = timestamps.map((timestamp, i) => ({
		timestamp: timestamp,
		medicines: medicinesPerSector[i]
	}));

	let selectedSectorValue = -1;
	selectedSector.subscribe((val) => (selectedSectorValue = val));

	function dispense(sector: number) {
		medicinesPerSector[sector].forEach((med) => {
			const logReq = {
				type: 'take',
				medicine_name: med.name,
				medicine_description: med.description,
				sector
			};
			fetch('/private/api/logs', {
				method: 'POST',
				body: JSON.stringify(logReq)
			});
		});
	}
</script>

<div class="grid grid-cols-4 grid-rows-2 mx-auto gap-8">
	{#each sectors as { timestamp, medicines }, i}
		<button
			on:click={() => selectedSector.set(i)}
			class={`transition-all min-w-40 border-2 border-solid border-gray-300 overflow-hidden rounded-md hover:scale-105 ${i === selectedSectorValue ? 'border-theme bg-theme scale-105' : 'bg-gray-300'}`}
		>
			<div
				class={`flex flex-row border-b-2 border-gray-300 border-solid text-sm ${i === selectedSectorValue ? 'border-theme' : ''}`}
			>
				<div
					class={`border-solid border-r-2 border-gray-300 ${i === selectedSectorValue ? 'border-theme' : ''}`}
				>
					<div
						class={`text-xl font-bold px-3 border-solid border border-gray-300 ${i === selectedSectorValue ? 'bg-theme text-white border-theme' : 'bg-gray-300 text-[#6b6b6b]'}`}
					>
						#{i + 1}
					</div>
					<div
						class={`flex flex-col items-center justify-center pb-1 ${i === selectedSectorValue ? 'bg-[#f0fff8]' : 'bg-white'}`}
					>
						<p class="text-lg -mb-1">
							{timestamp ? timestamp.toLocaleString('default', { day: 'numeric' }) : 'Day'}
						</p>
						<p>{timestamp ? timestamp.toLocaleString('default', { month: 'long' }) : 'Month'}</p>
					</div>
				</div>
				<div
					class={`flex flex-col justify-center items-center text-lg w-full text-md ${i === selectedSectorValue ? 'bg-[#f0fff8]' : 'bg-white'}`}
				>
					<p>{timestamp ? timestamp.toLocaleString('default', { weekday: 'long' }) : ''}</p>
					<p>
						{@html timestamp
							? timestamp.toLocaleString('default', { timeStyle: 'short' })
							: 'Click to<br>set time'}
					</p>
				</div>
			</div>
			<div
				class={`h-20 flex flex-wrap gap-1 p-1 ${i === selectedSectorValue ? 'bg-[#f0fff8]' : 'bg-white'}`}
			>
				{#each medicines as medicine}
					<div class="rounded-full h-6 w-6" style={`background-color: ${medicine.color}`}></div>
				{/each}
			</div>
		</button>
	{/each}
</div>
<div class="flex flex-row gap-6 justify-center">
	<form method="POST" action="?/fromMedBox" use:enhance>
		<input name="selectedSectorValue" bind:value={selectedSectorValue} type="hidden" />
		<button on:click={() => dispense(selectedSectorValue)} type="submit" class="btn"
			>Take medications</button
		>
	</form>
	<button disabled={selectedSectorValue === -1} class="btn" on:click={() => selectedSector.set(-1)}
		>See all medications</button
	>
</div>
