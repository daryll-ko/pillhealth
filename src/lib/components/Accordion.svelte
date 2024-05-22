<script>
	export let open = false;
	import { AngleDownOutline, AngleUpOutline, CirclePlusSolid } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';
	const handleClick = () => (open = !open);
</script>

<div>
	<div>
		<div>
			<slot name="head"></slot>
		</div>

		<button
			on:click={handleClick}
			class="py-1 group transition-all hover:scale-105 flex flex-row justify-center items-center gap-1 w-full"
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
	</div>

	{#if open}
		<div transition:slide>
			<slot name="details"></slot>
		</div>
	{/if}
</div>
