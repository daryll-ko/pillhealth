<script>
	import Navbar from '$lib/components/Navbar.svelte';

	export let data;
</script>

<header>
	<title>PillHealth</title>
</header>
<main>
	<div class="h-screen">
		<Navbar {data} />
		<slot />
	</div>
</main>
