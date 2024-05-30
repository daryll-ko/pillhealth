<script lang="ts">
	import { dialogOpen, selectedSector } from '$lib/stores';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import type { Medicine } from '$lib/types';
	import { randColor } from '$lib/utils';
	import { Textfield } from 'svelte-mui';
	import { enhance } from '$app/forms';

	let selectedSectorValue = -1;
	selectedSector.subscribe((val) => (selectedSectorValue = val));

	let name = '';
	let description = '';
	let color = randColor();

	$: result = { name, description, color };

	export let medicines: Medicine[];
	$: addable = medicines.filter((med) => !med.in_sectors.includes(selectedSectorValue));

	let toAdd: Medicine | null;
	$: (toAdd = null), medicines;

	let medId: number;
	$: medId = toAdd ? toAdd.id : 0;

	function handleSubmit(sector: number) {
		// if (sector !== -1 && toAdd) {
		// 	const logReq = {
		// 		medicine_name: toAdd.name,
		// 		medicine_description: toAdd.description,
		// 		sector
		// 	};
		// 	fetch('/private/api/logs', {
		// 		method: 'POST',
		// 		body: JSON.stringify(logReq)
		// 	});
		// }
		// dialogOpen.set(false);
	}

	let dropdownOpen = false;

	let proceed: boolean;
	$: proceed = selectedSectorValue === -1 || toAdd !== null;
</script>

<div
	class="absolute top-0 left-0 z-10 w-full h-full bg-black/30 flex flex-row justify-center items-center"
>
	<div class="bg-white rounded-lg p-6">
		<div class="flex flex-row items-center justify-center gap-6">
			<p class="font-bold">Add medication</p>
			<button
				type="button"
				class="ml-auto bg-red-500 rounded-full h-6 w-6 font-bold text-2xl flex justify-center items-center hover:scale-110 text-white transition-all"
				on:click={() => dialogOpen.set(false)}><span class="pb-1">x</span></button
			>
		</div>
		<br />
		<form
			method="POST"
			action="?/fromMedDialog"
			use:enhance={({ formData }) => {
				formData.append('name', name);
				formData.append('description', description);
			}}
		>
			<input name="sector" bind:value={selectedSectorValue} type="hidden" />
			<input name="proceed" bind:value={proceed} type="hidden" />
			<input name="med_id" bind:value={medId} type="hidden" />
			{#if selectedSectorValue === -1}
				<div class="relative w-full bg-white">
					<Textfield bind:value={name} autocomplete="off" label="Name" required outlined />
				</div>
				<div class="relative w-full bg-white">
					<Textfield
						bind:value={description}
						autocomplete="off"
						label="Description"
						required
						outlined
					/>
				</div>
				<div class="flex flex-row items-center gap-3">
					<p class="text-[#9f9f9f]">Color</p>
					<input name="color" type="color" bind:value={color} />
				</div>
				<br />
				<div class="flex flex-row justify-center">
					<button type="submit" class="btn"
						>Submit</button
					>
					<!-- on:click={() => handleSubmit(selectedSectorValue)} -->
				</div>
			{:else}
				<div class="flex flex-row items-center">
					<Button
						type="button"
						class="flex flex-row items-center text-black gap-3 w-full border border-solid border-black/20 rounded-md py-2"
					>
						<span
							class={`w-6 h-6 rounded-full ${toAdd ? '' : 'outline-dotted outline-1 outline-black'}`}
							style={`background-color: ${toAdd ? toAdd.color : 'none'}`}
						></span>
						<span>{toAdd ? toAdd.name : 'Choose!'}</span>
					</Button>
					<Dropdown bind:open={dropdownOpen} class="py-0">
						{#each addable as med}
							<DropdownItem
								on:click={() => {
									toAdd = med;
									dropdownOpen = false;
								}}
								class="flex flex-row items-center text-black gap-3 w-full rounded-md py-2"
							>
								<span class="w-6 h-6 rounded-full" style={`background-color: ${med.color}`}></span>
								<span>{med.name}</span>
							</DropdownItem>
						{/each}
					</Dropdown>
				</div>
				<br />
				<div class="flex flex-row justify-center">
					<button
						on:click={() => handleSubmit(selectedSectorValue)}
						type="submit"
						disabled={toAdd === null}
						class="btn">Add</button
					>
				</div>
			{/if}
		</form>
	</div>
</div>
