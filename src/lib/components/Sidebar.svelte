<script lang="ts">
	import { selectedSector, dialogOpen } from '$lib/stores';
	import type { Medicine, User } from '$lib/types';

	import {
		BarsOutline,
		CheckOutline,
		CloseOutline,
		EditSolid,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import Accordion from './Accordion.svelte';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';

	export let medicines: Medicine[];
	let selectedSectorValue = -1;

	let medicinesToShow;
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

	let editing: boolean;
	$: editing = toEdit !== -1;

	let deleting: boolean;
	$: deleting = toDelete !== -1;

	let selectedMedicine: Medicine | null;
	$: selectedMedicine =
		toEdit === -1 && toDelete === -1 ? null : medicinesToShow[toEdit !== -1 ? toEdit : toDelete];

	let selectedMedicineId: number;
	$: selectedMedicineId = selectedMedicine ? selectedMedicine.id : 0;

	let name = selectedMedicine?.name;
	let description = selectedMedicine?.description;

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

	let date = '';

	function formatDateTime(datetime: Date) {
		return `${datetime.getFullYear()}-${String(datetime.getMonth() + 1).padStart(2, '0')}-${String(datetime.getDate()).padStart(2, '0')}T${String(datetime.getHours()).padStart(2, '0')}:${String(datetime.getMinutes()).padStart(2, '0')}`;
	}

	function updateDate(sector: number, time: string) {
		if (time === '') {
			window.alert('Please select a date and time');
			return;
		}
	}

	let formElement;
	async function handleUpdate() {
		await formElement.requestSubmit();
		name = '';
		description = '';
		toEdit = -1;
		toDelete = -1;
	}

	let open = false;
</script>

<p class="absolute h-12 w-12 top-0 right-0 z-40 mt-5 mr-5 xl:hidden">
	{#if open}
		<button
			class="h-12 w-12 flex justify-center items-center bg-white rounded-full p-1"
			on:click={() => (open = false)}
		>
			<CloseOutline />
		</button>
	{:else}
		<button
			class="h-12 w-12 flex justify-center items-center bg-white rounded-full p-1"
			on:click={() => (open = true)}
		>
			<BarsOutline />
		</button>
	{/if}
</p>
<form class="h-full" bind:this={formElement} method="POST" action="?/fromSidebar" use:enhance>
	<div
		class={`z-30 absolute right-0 top-0 h-full flex flex-col items-center gap-6 bg-theme p-8 w-full sm:w-64 ${open ? 'block' : 'hidden'} xl:m-0 xl:flex`}
	>
		<div class="bg-[#333333] rounded-lg px-1 py-2 flex justify-center w-full">
			<span class="text-3xl font-bold text-white">{curTime}</span>
		</div>
		<div>
			<h1 class="text-white">
				<p class="text-3xl font-bold">
					{selectedSectorValue === -1
						? 'All Stored Medications'
						: `Medications in Sector ${selectedSectorValue + 1}`}
				</p>
			</h1>
		</div>
		{#if selectedSectorValue !== -1}
			<div class="w-full gap-0 text-white mb-4">
				<p>
					Due Date: <br />
					{timestamps[selectedSectorValue] !== null
						? timestamps[selectedSectorValue]?.toLocaleDateString()
						: 'Not yet set'}
					{timestamps[selectedSectorValue] !== null
						? timestamps[selectedSectorValue]?.toLocaleTimeString(undefined, {
								hour: '2-digit',
								minute: '2-digit'
							})
						: ''}
				</p>
				<div class="flex flex-col items-center gap-2">
					<input
						name="date"
						class="text-black rounded-md px-1 w-[100%] text-sm"
						type="datetime-local"
						bind:value={date}
					/>
					<button
						formaction="?/setTime"
						on:click={() => updateDate(selectedSectorValue, date)}
						class="rounded-full h-6 font-bold flex justify-center items-center hover:scale-110 text-white transition-all"
						><span class="bg-yellow-500 pr-2 pl-2 rounded-full mt-2">Save time</span></button
					>
				</div>
			</div>
		{/if}

		<div class="flex flex-row items-center text-white gap-2">
			<button
				on:click={() => dialogOpen.set(true)}
				class="bg-yellow-500 rounded-full h-6 w-6 font-bold text-2xl flex justify-center items-center hover:scale-110 text-white transition-all"
				><span class="pb-1">+</span></button
			>
			<p>Add Medication</p>
		</div>
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
										name="name"
										value={medicine.name}
										placeholder={medicine.name}
									/>
								{:else}
									<span in:slide class="max-w-24">{medicine.name}</span>
								{/if}
							</p>
							<div class="ml-auto flex flex-col items-center divide-y-4 divide-solid divide-theme">
								{#if i === toEdit || i === toDelete}
									<button
										on:click={() => handleUpdate()}
										type="submit"
										disabled={toEdit !== -1 && i !== toEdit}
										class="icon-btn bg-theme/60 hover:bg-theme/80 disabled:hover:bg-theme/60"
									>
										<p class="h-6 w-6 flex justify-center items-center">
											<CheckOutline />
										</p>
									</button>
									<button
										on:click={() => (i === toEdit ? (toEdit = -1) : (toDelete = -1))}
										type="button"
										disabled={toDelete !== -1 && i !== toDelete}
										class="icon-btn bg-red-500/60 hover:bg-red-500/80 disabled:hover:bg-red-500/60"
									>
										<p class="h-6 w-6 flex justify-center items-center">
											<CloseOutline />
										</p>
									</button>
								{:else}
									<button
										on:click={() => (toEdit = i)}
										type="button"
										disabled={toDelete !== -1 || (toEdit !== -1 && i !== toEdit)}
										class="icon-btn bg-theme/60 hover:bg-theme/80 disabled:hover:bg-theme/60"
									>
										<p class="h-6 w-6 flex justify-center items-center">
											<EditSolid />
										</p>
									</button>
									<button
										on:click={() => (toDelete = i)}
										type="button"
										disabled={toEdit !== -1 || (toDelete !== -1 && i !== toDelete)}
										class="icon-btn bg-red-500/60 hover:bg-red-500/80 disabled:hover:bg-red-500/60"
									>
										<p class="h-6 w-6 flex justify-center items-center">
											<TrashBinSolid />
										</p>
									</button>
								{/if}
							</div>
						</div>
						<div slot="details" class="p-3 pt-1 flex flex-row justify-center">
							{#if i === toEdit}
								<textarea
									class="p-3 rounded-md border border-solid border-black/20 max-w-44"
									value={medicine.description}
									name="description"
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
	<input name="med_id" bind:value={selectedMedicineId} type="hidden" />
	<input name="editing" bind:value={editing} type="hidden" />
	<input name="deleting" bind:value={deleting} type="hidden" />
	<input name="sector" bind:value={selectedSectorValue} type="hidden" />
</form>
