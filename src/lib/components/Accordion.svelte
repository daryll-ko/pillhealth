<script>
	export let toggled = false;
	export let editing = false;
	export let deleting = false;

	$: open = toggled || editing;

	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';
	const handleClick = () => (toggled = !toggled);
</script>

<div>
	<div>
		<div>
			<slot name="head"></slot>
		</div>

		{#if deleting}
			<p class="py-1 flex flex-row justify-center items-center gap-1 w-full">
				Remove this medicine?
			</p>
		{:else}
			<button
				disabled={editing}
				on:click={handleClick}
				class="py-1 group transition-all hover:scale-105 flex flex-row justify-center items-center gap-1 w-full disabled:hover:scale-100"
			>
				<span class="text-theme/70 group-hover:text-theme/90">
					{#if open}
						<AngleUpOutline />
					{:else}
						<AngleDownOutline />
					{/if}
				</span>
				<span>Description</span>
				<span class="text-theme/70 group-hover:text-theme/90">
					{#if open}
						<AngleUpOutline />
					{:else}
						<AngleDownOutline />
					{/if}
				</span>
			</button>
		{/if}
	</div>

	{#if open}
		<div transition:slide>
			<slot name="details"></slot>
		</div>
	{/if}
</div>
