<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { PILL_TYPES, COMPARTMENTS, COMPARTMENT_CAPACITY } from '$lib/constants';
	// ../$types.js
	export let data;

	async function addToCompartment(index: number, pillNum: number) {
		await fetch(`/add/${index}/${pillNum}`, { method: 'PUT' });

		const pillToAdd = PILL_TYPES[pillNum];

		if (data.contents[index].length < COMPARTMENT_CAPACITY) {
			data.contents[index] = [...data.contents[index], pillToAdd];
			data.logs = [
				{ date: new Date(), action: 'refill', sector: index, pill: pillToAdd },
				...data.logs
			];
		}
	}

	let current = 0;
	setInterval(() => (current = (current + 1) % COMPARTMENTS), 1000);

	async function clearCompartment(index: number) {
		await fetch(`/clear/${index}`, { method: 'DELETE' });

		data.contents[index] = [];
		data.logs = [{ date: new Date(), action: 'dispense', sector: index }, ...data.logs];
	}
</script>

<div class="flex flex-row h-screen">
	<div class="flex flex-col w-[80%] gap-8">
		<div class="flex flex-row gap-10 items-center text-2xl text-[#727272]">
			<a href="/">
				<img width={300} src={logo} alt="logo" />
			</a>
			<a href="/history" class="hover:bg-gray-100 px-3 py-1 rounded-lg">Intake History</a>
			<a href="/faq" class="hover:bg-gray-100 px-3 py-1 rounded-lg">FAQ</a>
			<a href="/about" class="hover:bg-gray-100 px-3 py-1 rounded-lg">About Us</a>
		</div>
		<div class="text-[#333333] text-center flex flex-col gap-3">
			<h1 class="text-4xl font-bold">It's time to take your pills!</h1>
			<p class="text-2xl">Consistency is key to better health.</p>
		</div>
		<div class="grid grid-cols-4 grid-rows-2 mx-auto gap-8">
			{#each data.contents as compartment, i}
				<div
					class={`border-2 border-solid border-gray-300 overflow-hidden rounded-md ${i === current ? 'border-theme' : ''}`}
				>
					<div
						class={`flex flex-row border-b-2 border-gray-300 border-solid text-sm ${i === current ? 'border-theme' : ''}`}
					>
						<div
							class={`border-solid border-r-2 border-gray-300 ${i === current ? 'border-theme' : ''}`}
						>
							<div
								class={`text-xl font-bold px-3 ${i === current ? 'bg-theme text-white' : 'bg-gray-300 text-[#6b6b6b]'}`}
							>
								#{i + 1}
							</div>
							<div
								class={`flex flex-col items-center justify-center pb-1 ${i === current ? 'bg-[#f0fff8]' : ''}`}
							>
								<p class="text-xl -mb-1">19</p>
								<p>May</p>
							</div>
						</div>
						<div
							class={`flex flex-col justify-center items-center w-full text-md ${i === current ? 'bg-[#f0fff8]' : ''}`}
						>
							<p>Monday,</p>
							<p>12:00 AM</p>
						</div>
					</div>
					<div
						class={`h-20 flex flex-wrap bg-[#f8f8f8] rounded-md p-1 ${i === current ? 'bg-[#f0fff8]' : ''}`}
					>
						{#each compartment as pill}
							<div class={`${pill.color} rounded-full h-4 w-4`}></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-row justify-center">
			<button
				class="bg-theme/80 text-white rounded-xl text-xl font-bold py-2 px-6 hover:bg-theme transition-all"
				>Refill</button
			>
		</div>
	</div>
	<div class="flex flex-col items-center gap-8 bg-theme p-8 w-[20%]">
		<div class="bg-[#333333] rounded-lg px-1 py-2 flex justify-center w-full">
			<span class="text-4xl font-bold text-white">1:08 PM</span>
		</div>
		<div class="flex flex-row items-center gap-3">
			<h1 class="text-4xl text-white font-bold">Medication</h1>
			<a
				href="/add"
				class="bg-yellow-500 rounded-full h-8 w-8 font-bold text-2xl flex justify-center items-center hover:scale-110 text-white transition-all"
				><span class="pb-1">+</span></a
			>
		</div>
		<div class="flex flex-col gap-5 w-full">
			{#each data.medicine as pill, j}
				<div class="rounded-lg bg-white flex flex-col justify-center gap-2 px-3 pb-2 pt-3">
					<div class="flex flex-row justify-between items-center">
						<span class={`${pill.color} rounded-full px-3 py-1`}>{pill.name}</span>
						<a
							href="/edit"
							class="bg-theme/80 text-white px-3 py-1 rounded-md transition-all hover:bg-theme"
							>Edit</a
						>
					</div>
					<div class="flex flex-row justify-between items-center">
						<span>Take every</span>
						<select
							class="bg-[#f8f8f8] border-2 border-solid border-[#dddddd] rounded-md text-[#9a9a9a] px-3 text-center transition-all hover:border-theme hover:text-theme hover:cursor-pointer hover:bg-theme/10"
							><option value="8">8 hours</option><option value="night">night</option></select
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- <div class="h-screen flex justify-center items-center">
	<div class="text-center flex flex-col gap-5">
		<div class="flex flex-row gap-10">
			<div class="flex flex-col gap-5">
				<div class="grid grid-cols-4 grid-rows-2 mx-auto gap-3">
					{#each data.contents as compartment, i}
						<div
							class={`w-20 border-2 border-solid border-gray-300 rounded-md ${i === current ? 'border-theme' : ''}`}
						>
							<div
								class={`border-b-2 border-gray-300 border-solid text-sm ${i === current ? 'font-bold text-white bg-theme border-theme' : 'text-black/80'}`}
							>
								Sector {i + 1}
							</div>
							<div class="h-20 flex flex-wrap bg-gray-100 rounded-md p-1">
								{#each compartment as pill}
									<div class={`${pill.color} rounded-full h-4 w-4`}></div>
								{/each}
							</div>
							<div class="flex flex-col gap-2 border border-black p-1">
								{#each PILL_TYPES as pill, j}
									<button
										disabled={compartment.length === COMPARTMENT_CAPACITY}
										class={`${pill.color} text-xs rounded-md px-2 py-1 transition-all enabled:hover:scale-105 disabled:text-black/30`}
										on:click={() => addToCompartment(i, j)}>+ {pill.name}</button
									>
								{/each}
							</div>
						</div>
					{/each}
				</div>
				<div class="flex flex-col gap-2 items-center">
					<p>
						It's time for you to take{' '}<span class="font-bold">Sector {current + 1}</span>&apos;s
						pills!
					</p>
					<button
						class="transition-all enabled:hover:scale-105 bg-blue-200 rounded-lg px-3 py-1 disabled:text-black/30"
						disabled={data.contents[current].length === 0}
						on:click={() => clearCompartment(current)}>Open hatch</button
					>
				</div>
			</div>
			<div class="flex flex-col items-start gap-2">
				<p class="text-xl font-bold">Logs</p>
				<div class="flex flex-col items-start">
					{#if data.logs.length > 0}
						{#each data.logs.slice(0, 14) as log}
							{#if log.action === 'dispense'}
								<p>
									<code>[{log.date.toLocaleTimeString()}]</code>
									<span class="text-blue-500 font-bold">Dispensed</span> from
									<span class="text-blue-500 font-bold">Sector {log.sector + 1}</span>
								</p>
							{:else}
								<p>
									<code>[{log.date.toLocaleTimeString()}]</code>
									<span class="text-red-500 font-bold">Added</span>
									<span class="text-green-600 font-bold">{log.pill?.name}</span>
									to <span class="text-red-500 font-bold">Sector {log.sector + 1}</span>
								</p>
							{/if}
						{/each}
					{:else}
						<p>
							<code>[no logs to display]</code>
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div> -->
