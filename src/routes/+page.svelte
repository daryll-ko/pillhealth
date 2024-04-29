<script lang="ts">
	interface Compartment {
		contents: Med[];
		capacity: number;
	}
	interface Med {
		name: string;
		color: string;
	}
	let meds: Med[] = [
		{
			name: 'med 1',
			color: 'bg-red-300'
		},
		{
			name: 'med 2',
			color: 'bg-blue-400'
		},
		{
			name: 'med 3',
			color: 'bg-green-400'
		},
		{
			name: 'med 4',
			color: 'bg-orange-400'
		}
	];
	let box: Compartment[] = [
		{
			contents: Array(1).fill(meds[0]),
			capacity: 10
		},
		{
			contents: Array(4).fill(meds[1]),
			capacity: 10
		},
		{
			contents: Array(5).fill(meds[2]),
			capacity: 10
		},
		{
			contents: Array(1).fill(meds[3]),
			capacity: 10
		},
		{
			contents: Array(4).fill(meds[0]),
			capacity: 10
		},
		{
			contents: Array(5).fill(meds[1]),
			capacity: 10
		},
		{
			contents: Array(1).fill(meds[2]),
			capacity: 10
		},
		{
			contents: Array(4).fill(meds[3]),
			capacity: 10
		}
	];
	// (i, j) = (compartment number, med number)
	function increment(i: number, j: number) {
		box = box.map((compartment, ii) =>
			i === ii && compartment.contents.length + 1 <= compartment.capacity
				? { ...compartment, contents: [...compartment.contents, meds[j]] }
				: compartment
		);
	}
	let current = 0;
	setInterval(() => (current = (current + 1) % box.length), 1000);

	function clear(i: number) {
		box = box.map((compartment, ii) => (i === ii ? { ...compartment, contents: [] } : compartment));
	}
</script>

<div class="h-screen flex justify-center items-center">
	<div class="text-center flex flex-col gap-5">
		<div class="font-bold">
			<h1 class="text-3xl text-green-400">PillHealth</h1>
			<h2 class="text-xl text-yellow-500">Your smart medicine box.</h2>
		</div>

		<div class="flex justify-center items-center mx-auto">
			{#each box as compartment, i}
				<div class={`w-20 ${i === current ? 'bg-yellow-400/25' : ''}`}>
					<div class="border border-solid border-black p-2 text-sm">
						Sector {i + 1}
						<p class="text-xs">{compartment.contents.length} of {compartment.capacity}</p>
					</div>
					<div class="border border-solid border-black h-48 flex flex-wrap">
						{#each compartment.contents as med}
							<div class={`${med.color} rounded-md h-2 w-2`}></div>
						{/each}
					</div>
					<div class="flex flex-col gap-2 border border-black p-1">
						{#each meds as med, j}
							<button
								class={`${med.color} text-xs rounded-md px-2 py-1 transition-all hover:scale-105`}
								on:click={() => increment(i, j)}>+ {med.name}</button
							>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col gap-2 items-center">
			<p>
				It's time for you to take{' '}<span class="font-bold">Sector {current + 1}</span>&apos;s
				meds!
			</p>
			<button
				class="transition-all hover:scale-105 bg-blue-200 rounded-lg px-3 py-1"
				on:click={() => clear(current)}>Open hatch</button
			>
		</div>
	</div>
</div>
