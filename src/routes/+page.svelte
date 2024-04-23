<script lang="ts">
	interface Med {
		name: string;
		color: string;
		stock: number;
		tray: number;
	}
	let meds: Med[] = [
		{
			name: 'med 1',
			color: 'bg-red-300',
			stock: 20,
			tray: 0
		},
		{
			name: 'med 2',
			color: 'bg-blue-400',
			stock: 50,
			tray: 0
		},
		{
			name: 'med 3',
			color: 'bg-green-400',
			stock: 60,
			tray: 0
		},
		{
			name: 'med 4',
			color: 'bg-orange-400',
			stock: 5,
			tray: 0
		}
	];
	function increment(name: string) {
		meds = meds.map((med) =>
			med.name === name ? { ...med, stock: Math.min(med.stock + 1, 100) } : med
		);
	}
	function decrement(name: string) {
		meds = meds.map((med) =>
			med.name === name ? { ...med, stock: Math.max(med.stock - 1, 0), tray: med.tray + 1 } : med
		);
	}
</script>

<div class="h-screen flex justify-center items-center">
	<div class="text-center flex flex-col gap-5">
		<div class="font-bold">
			<h1 class="text-3xl text-green-400">PillHealth</h1>
			<h2 class="text-xl text-yellow-500">Your smart medicine box.</h2>
		</div>

		<div class="grid grid-rows-4 justify-center">
			<div class="row-span-3 flex justify-center items-center mx-auto">
				{#each meds as med}
					<div class="w-20">
						<div class="border border-solid border-black p-2">
							{med.name}
							<p class="text-xs">{med.stock} of 100</p>
						</div>
						<div class="border border-solid border-black h-48 flex flex-wrap">
							{#each { length: med.stock } as _, i}
								<div class={`${med.color} rounded-md h-2 w-2`}></div>
							{/each}
						</div>
						<div class="border border-solid border-black flex flex-col">
							<button
								class="m-1 text-sm bg-green-300 rounded-lg px-1"
								on:click={() => increment(med.name)}>refill</button
							>
							<button
								disabled={med.stock === 0}
								class="m-1 text-sm bg-yellow-400 rounded-lg px-1 disabled:text-black/20"
								on:click={() => decrement(med.name)}>dispense</button
							>
						</div>
					</div>
				{/each}
			</div>

			<div
				class="row-span-1 border border-solid border-black flex flex-col justify-center items-center"
			>
				{#each meds as med}
					<p class="text-sm">{med.name}: {med.tray}</p>
				{/each}
			</div>
		</div>
	</div>
</div>
