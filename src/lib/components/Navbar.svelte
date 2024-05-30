<script lang="ts">
	import { VolumeUpSolid } from 'flowbite-svelte-icons';
	import logo from '$lib/assets/logo.png';
	import { enhance } from '$app/forms';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	export let data;

	$: ({ supabase, user } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};

	export let userData;

	let alarm: number = userData.alarm;
	let dropdownOpen = false;
	let activeClass = 'text-green-200';
</script>

<div
	class="flex items-center pb-3 md:pr-4 md:py-2 text-[#727272] flex-col md:text-md md:flex-row md:gap-6 lg:gap-10 lg:text-xl xl:text-2xl"
>
	<a href="/private" class="min-w-32">
		<img width={300} src={logo} alt="logo" />
	</a>
	<div class="flex flex-row items-center gap-3">
		<a href="/private/history" class="hover:bg-gray-100 px-3 py-1 rounded-lg">History</a>
		<a href="/private/faq" class="hover:bg-gray-100 px-3 py-1 rounded-lg">FAQ</a>
		<a href="/private/about" class="hover:bg-gray-100 px-3 py-1 rounded-lg md:min-w-24">About Us</a>
	</div>
	<div class="flex flex-row items-center gap-3">
		<p class="text-sm">{user?.email}</p>
		<button on:click={logout} class="btn">Logout</button>
		<form class="flex flex-col items-center gap-1" method="POST" action="?/alarm" use:enhance>
			<Button type="button" class="flex flex-row items-center">
				<p class="w-6 h-6 text-[#727272]">
					<VolumeUpSolid />
				</p>
			</Button>
			<Dropdown
				{activeClass}
				bind:open={dropdownOpen}
				class="text-sm border border-solid border-gray rounded-md z-40"
			>
				<DropdownItem
					on:click={() => {
						alarm = 1;
						dropdownOpen = false;
					}}><p class={`${alarm === 1 ? 'text-theme' : ''}`}>Green Flash</p></DropdownItem
				>
				<DropdownItem
					on:click={() => {
						alarm = 2;
						dropdownOpen = false;
					}}
				>
					<p class={`${alarm === 2 ? 'text-theme' : ''}`}>Koisuru Fortune Cookie</p>
				</DropdownItem>
			</Dropdown>
			<input type="hidden" name="alarm" bind:value={alarm} />
			<button
				disabled={dropdownOpen || alarm === userData.alarm}
				type="submit"
				class="-z-10 transition-all hover:scale-105 disabled:hover:scale-100 px-2 py-1 rounded-md text-sm bg-gray-200 disabled:text-black/20 disabled:bg-gray-200/20"
				>Update</button
			>
		</form>
	</div>
</div>
