<script lang="ts">
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
	import { type Log } from '$lib/types';
	import { getLogger } from 'nodemailer/lib/shared/index.js';

	export let data;

	$: ({ logs } = data);

	// a is from software, b is from hardware
	function closeEnough(a: Log, b: Log) {
		return (
			(b.medicine_name == null || b.medicine_name === '') &&
			a.sector === b.sector &&
			Math.abs(a.timestamp.getTime() - b.timestamp.getTime()) <= 90 * 1000
		);
	}

	$: logsToShow = logs
		.filter((log) => log.medicine_name)
		.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
		.map((log) => {
			if (logs.some((other) => closeEnough(log, other))) {
				const other = logs.filter((l) => closeEnough(log, l))[0];
				if (other) {
					console.log(log.timestamp, other.timestamp);
					return {
						...log,
						time_taken: other.timestamp
					};
				}
			} else {
				return { ...log, time_taken: new Date(0) };
			}
		});
</script>

<div class="flex flex-col gap-12 p-12">
	<h1 class="text-4xl font-bold">History</h1>
	<Table hoverable={true} divClass="bg-black/10 rounded-md">
		<TableHead theadClass="">
			<TableHeadCell class="text-center">Time Dispensed</TableHeadCell>
			<TableHeadCell class="text-center">Time Taken</TableHeadCell>
			<TableHeadCell class="text-center">Medicine Name</TableHeadCell>
			<TableHeadCell class="text-center">Sector</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y text-center">
			{#each logsToShow as log}
				{#if log}
					<TableBodyRow>
						<TableBodyCell tdClass="py-4"
							><span class="text-black">{new Date(log.timestamp).toLocaleString()}</span
							></TableBodyCell
						>
						<TableBodyCell tdClass="py-4">
							{#if log.time_taken}
								<span class="text-black">
									{log.time_taken.getTime() > 0
										? new Date(log.time_taken).toLocaleString()
										: 'NOT TAKEN'}
								</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell><span class="text-black">{log.medicine_name}</span></TableBodyCell>
						<TableBodyCell><span class="text-black">{log.sector + 1}</span></TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>
