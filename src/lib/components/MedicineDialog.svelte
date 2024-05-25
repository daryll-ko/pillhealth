<script lang="ts">
	import { dialogOpen, selectedSector } from '$lib/stores';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import type { Medicine } from '$lib/types';
	import { randColor } from '$lib/utils';
	import { Textfield } from 'svelte-mui';

	let selectedSectorValue = -1;
	selectedSector.subscribe((val) => (selectedSectorValue = val));

	let name = '';
	let description = '';
	let color = randColor();

	$: result = { name, description, color };

	export let medicines: Medicine[];
	$: addable = medicines.filter((med) => !med.in_sectors.includes(selectedSectorValue));

	let toAdd: Medicine | null;

	function handleSubmit(sector: number) {
		if (sector === -1) {
			fetch('/private/api/medicines', { method: 'POST', body: JSON.stringify(result) });
		} else if (toAdd) {
			const medReq = {
				...toAdd,
				in_sectors: [...toAdd.in_sectors, sector]
			};
			fetch('/private/api/medicines', {
				method: 'PUT',
				body: JSON.stringify(medReq)
			});
			const logReq = {
				type: 'refill',
				medicine_name: toAdd.name,
				medicine_description: toAdd.description,
				sector
			};
			fetch('/private/api/logs', {
				method: 'POST',
				body: JSON.stringify(logReq)
			});
		}
		dialogOpen.set(false);
	}

	let dropdownOpen = false;
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
		<form on:submit|preventDefault={() => handleSubmit(selectedSectorValue)}>
			{#if selectedSectorValue === -1}
				<div class="relative w-full bg-white">
					<Textfield bind:value={name} autocomplete="off" type="" label="Name" required outlined />
				</div>
				<div class="relative w-full bg-white">
					<Textfield
						bind:value={description}
						autocomplete="off"
						type=""
						label="Description"
						required
						outlined
					/>
				</div>
				<div class="flex flex-row items-center gap-3">
					<p class="text-[#9f9f9f]">Color</p>
					<input type="color" bind:value={color} />
				</div>
				<br />
				<div class="flex flex-row justify-center">
					<button type="submit" class="btn">Submit</button>
				</div>
			{:else}
				<div class="flex flex-row items-center">
					<Button
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
					<button type="submit" disabled={toAdd === null} class="btn">Add</button>
				</div>
			{/if}
		</form>
	</div>
</div>
