<script>
	import logo from '$lib/assets/logo.png';

	export let data;

	$: ({ supabase, user } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<div class="flex flex-row gap-10 items-center text-2xl text-[#727272]">
	<a href="/">
		<img width={300} src={logo} alt="logo" />
	</a>
	<a href="/private/history" class="hover:bg-gray-100 px-3 py-1 rounded-lg">Intake History</a>
	<a href="/private/faq" class="hover:bg-gray-100 px-3 py-1 rounded-lg">FAQ</a>
	<a href="/private/about" class="hover:bg-gray-100 px-3 py-1 rounded-lg">About Us</a>
	<p class="text-sm">{user?.email}</p>
	<button
		on:click={logout}
		class="bg-theme/80 text-white rounded-xl text-xl font-bold py-2 px-6 hover:bg-theme transition-all"
		>Logout</button
	>
</div>
