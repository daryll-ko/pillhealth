<script lang="ts">
	import { PILL_TYPES, COMPARTMENTS, COMPARTMENT_CAPACITY } from '$lib/constants';

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

<div class="h-screen flex justify-center items-center">
	<div class="text-center flex flex-col gap-5">
		<div class="font-bold">
			<h1 class="text-3xl text-green-400">PillHealth</h1>
			<h2 class="text-xl text-yellow-500">Your smart medicine box.</h2>
		</div>

		<div class="flex flex-row gap-10">
			<div class="flex flex-col gap-5">
				<div class="flex justify-center items-center mx-auto">
					{#each data.contents as compartment, i}
						<div class={`w-20 ${i === current ? 'bg-yellow-400/25' : ''}`}>
							<div class="border border-solid border-black p-2 text-sm">
								Sector {i + 1}
								<p
									class={`text-xs ${compartment.length === 0 ? 'text-red-500' : compartment.length === COMPARTMENT_CAPACITY ? 'text-blue-600' : ''}`}
								>
									{compartment.length} of {COMPARTMENT_CAPACITY}
								</p>
							</div>
							<div class="border border-solid border-black h-48 flex flex-wrap">
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
					{#each data.logs.slice(0, 14) as log}
						{#if log.action === 'dispense'}
							<p>
								<code>[{log.date.toLocaleTimeString()}]</code>
								<span class="text-blue-500 font-bold">Dispensed</span> pills from
								<span class="text-blue-500 font-bold">Sector {log.sector + 1}</span>
							</p>
						{:else}
							<p>
								<code>[{log.date.toLocaleTimeString()}]</code>
								<span class="text-red-500 font-bold">Refilled</span>
								<span class="text-green-600 font-bold">Sector {log.sector + 1}</span>
								with <span class="text-red-500 font-bold">{log.pill?.name}</span>
							</p>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
