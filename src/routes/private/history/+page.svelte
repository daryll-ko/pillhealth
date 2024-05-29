<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox,
		TableSearch
	} from 'flowbite-svelte';

	export let data;

	$: ({ logs } = data);

	$: logsToShow = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
</script>

<div class="flex flex-col w-[80%] gap-12 p-12">
	<h1 class="text-4xl font-bold">History</h1>
	<Table hoverable={true} divClass="bg-black/10 rounded-md">
		<TableHead>
			<TableHeadCell class="text-center">Date</TableHeadCell>
			<TableHeadCell class="text-center">Type</TableHeadCell>
			<TableHeadCell class="text-center">Medicine Name</TableHeadCell>
			<TableHeadCell class="text-center">Sector</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y text-center">
			{#each logsToShow as log}
				<TableBodyRow>
					<TableBodyCell tdClass="py-4"
						><span class="text-black">{new Date(log.timestamp).toLocaleString()}</span
						></TableBodyCell
					>
					<TableBodyCell><span class="text-black">{log.type}</span></TableBodyCell>
					<TableBodyCell><span class="text-black">{log.medicine_name}</span></TableBodyCell>
					<TableBodyCell><span class="text-black">{log.sector + 1}</span></TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
