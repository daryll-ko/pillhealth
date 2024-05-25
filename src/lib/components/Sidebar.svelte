<script lang="ts">
	import { selectedSector, dialogOpen } from '$lib/stores';
	import type { Medicine, User } from '$lib/types';

	import { CheckOutline, CloseOutline, EditSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import Accordion from './Accordion.svelte';
	import { slide } from 'svelte/transition';

	export let medicines: Medicine[];
	let selectedSectorValue = -1;

	$: medicinesToShow = (
		selectedSectorValue === -1
			? medicines
			: medicines.filter((medicine) => medicine.in_sectors.includes(selectedSectorValue))
	).sort((a, b) => a.id - b.id);

	selectedSector.subscribe((val) => (selectedSectorValue = val));

	let curTime = new Date().toLocaleTimeString();
	setInterval(() => (curTime = new Date().toLocaleTimeString()), 1000);

	let toEdit = -1;
	let toDelete = -1;

	let name = '';
	let description = '';

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
	].map((timestamp) =>
		timestamp ? new Date(timestamp) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
	);

	let date = '';

	function updateDate(sector: number, time: string) {
		const req = {
			sector,
			time
		};
		fetch('/private/api/user', {
			method: 'PUT',
			body: JSON.stringify(req)
		});
	}

	function handleUpdate(id: number, editing: boolean, deleting: boolean) {
		const med = medicinesToShow.find((medicine) => medicine.id === id);
		if (med) {
			if (editing) {
				const req = {
					...med,
					name: name === '' ? med.name : name,
					description: description === '' ? med.description : description
				};
				fetch('/private/api/medicines', {
					method: 'PUT',
					body: JSON.stringify(req)
				});
				name = '';
				description = '';
				toEdit = -1;
			}
			if (deleting) {
				if (selectedSectorValue === -1) {
					fetch('/private/api/medicines', {
						method: 'DELETE',
						body: JSON.stringify({ id })
					});
				} else {
					const req = {
						...med,
						in_sectors: med.in_sectors.filter((sector) => sector !== selectedSectorValue)
					};
					fetch('/private/api/medicines', {
						method: 'PUT',
						body: JSON.stringify(req)
					});
				}
				toDelete = -1;
			}
		}
	}
</script>

<div class="absolute right-0 top-0 h-screen flex flex-col items-center gap-8 bg-theme p-8 w-64">
	<div class="bg-[#333333] rounded-lg px-1 py-2 flex justify-center w-full">
		<span class="text-4xl font-bold text-white">{curTime}</span>
	</div>
	<div>
		<h1 class="text-white">
			<p class="text-3xl font-bold">Medications</p>
			<p>
				{selectedSectorValue === -1 ? 'All medications' : `Sector ${selectedSectorValue + 1}`}
			</p>
			{#if selectedSectorValue !== -1}
				<p>Due {timestamps[selectedSectorValue].toLocaleString()}</p>
			{/if}
		</h1>
	</div>
	<div class="flex flex-row items-center text-white gap-2">
		<button
			on:click={() => dialogOpen.set(true)}
			class="bg-yellow-500 rounded-full h-6 w-6 font-bold text-2xl flex justify-center items-center hover:scale-110 text-white transition-all"
			><span class="pb-1">+</span></button
		>
		<p>Add Medication</p>
	</div>
	{#if selectedSectorValue !== -1}
		<div class="flex flex-row items-center gap-2">
			<button
				on:click={() => updateDate(selectedSectorValue, date)}
				class="bg-blue-400 rounded-full h-6 w-6 font-bold text-xl flex justify-center items-center hover:scale-110 text-white transition-all"
				><span class="pb-1">~</span></button
			>
			<input class="text-black rounded-md px-1" type="datetime-local" bind:value={date} />
		</div>
	{/if}
	<div class="flex flex-col gap-5 w-full overflow-y-scroll">
		{#each medicinesToShow as medicine, i}
			<div class="rounded-lg bg-white flex flex-col justify-center gap-2">
				<Accordion toggled={false} editing={i === toEdit} deleting={i === toDelete}>
					<div
						slot="head"
						class="flex flex-row items-center border-b-4 border-solid border-theme divide-x-4 divide-solid divide-theme"
					>
						<p class="flex flex-row items-center gap-3 pl-3">
							<span class="rounded-full h-6 w-6" style={`background-color: ${medicine.color}`}
							></span>
							{#if i === toEdit}
								<input
									in:slide
									class="max-w-24 border border-solid border-black/20 rounded-md px-2 py-1"
									bind:value={name}
									placeholder={medicine.name}
								/>
							{:else}
								<span in:slide class="max-w-24">{medicine.name}</span>
							{/if}
						</p>
						<div class="ml-auto flex flex-col items-center divide-y-4 divide-solid divide-theme">
							{#if i === toEdit || i === toDelete}
								<button
									on:click={() => handleUpdate(medicine.id, i === toEdit, i === toDelete)}
									disabled={toEdit !== -1 && i !== toEdit}
									class="icon-btn bg-theme/60 hover:bg-theme/80 disabled:hover:bg-theme/60"
									><CheckOutline /></button
								>
								<button
									on:click={() => (i === toEdit ? (toEdit = -1) : (toDelete = -1))}
									disabled={toDelete !== -1 && i !== toDelete}
									class="icon-btn bg-red-500/60 hover:bg-red-500/80 disabled:hover:bg-red-500/60"
									><CloseOutline /></button
								>
							{:else}
								<button
									on:click={() => (toEdit = i)}
									disabled={toDelete !== -1 || (toEdit !== -1 && i !== toEdit)}
									class="icon-btn bg-theme/60 hover:bg-theme/80 disabled:hover:bg-theme/60"
									><EditSolid /></button
								>
								<button
									on:click={() => (toDelete = i)}
									disabled={toEdit !== -1 || (toDelete !== -1 && i !== toDelete)}
									class="icon-btn bg-red-500/60 hover:bg-red-500/80 disabled:hover:bg-red-500/60"
									><TrashBinSolid /></button
								>
							{/if}
						</div>
					</div>
					<div slot="details" class="p-3 pt-1 flex flex-row justify-center">
						{#if i === toEdit}
							<textarea
								class="p-3 rounded-md border border-solid border-black/20 max-w-44"
								bind:value={description}
								placeholder={medicine.description}
							/>
						{:else}
							<p class="p-3 rounded-md bg-gray-200/90 w-full">{medicine.description}</p>
						{/if}
					</div>
				</Accordion>
			</div>
		{/each}
	</div>
</div>
