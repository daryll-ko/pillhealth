<script>
	import logo from '$lib/assets/logo.png';
	import plant from '$lib/assets/plant.jpeg';
	import { Textfield } from 'svelte-mui';
</script>

<div class="flex flex-row h-screen">
	<div class="w-full md:w-[70%] flex flex-col gap-10 justify-center items-center">
		<img src={logo} width="500" alt="PillHealth logo" />
		<form class="w-[60%] md:w-[50%] flex flex-col gap-8" method="POST" action="?/login">
			<h1 class="font-bold text-4xl">Login</h1>
			<div class="flex flex-col gap-1">
				<div class="relative w-full bg-white">
					<Textfield autocomplete="off" type="email" label="Email" name="email" required outlined />
				</div>
				<div class="relative w-full bg-white">
					<Textfield
						autocomplete="off"
						type="password"
						label="Password"
						name="password"
						required
						outlined
					/>
				</div>
			</div>
			<button class="btn px-3 py-2 font-semibold text-lg text-white">Login</button>
		</form>
		<div class="w-[60%] md:w-[50%] flex flex-row justify-center items-center">
			<!-- <p class="w-[20%] md:w-[10%] h-[2px] bg-[#c0c0c0]"></p> -->
			<p class="bg-white px-2 text-center">
				Don't have an account? <a
					class="text-theme transition-all hover:underline"
					href="/auth/register">Register</a
				>
			</p>
			<!-- <p class="w-[20%] md:w-[10%] h-[2px] bg-[#c0c0c0]"></p> -->
		</div>
	</div>
	<img src={plant} class="md:block md:w-[30%] md:object-cover md:object-left hidden" alt="Plant" />
</div>
