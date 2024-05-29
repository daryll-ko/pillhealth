<script>
	import Navbar from '$lib/components/Navbar.svelte';

	export let data;
	export let form;

	$: userData = form?.userData || data.userData;
</script>

<header>
	<title>PillHealth</title>
</header>
<main>
	<div class="h-screen">
		<Navbar {data} userData={userData} />
		<slot />
	</div>
</main>
