<script>
	import logo from '$lib/assets/logo.png';
	import plant from '$lib/assets/plant.jpeg';
</script>

<div class="flex flex-row h-screen">
	<div class="w-[70%] flex flex-col gap-10 justify-center items-center gap-10">
		<img src={logo} width="500" alt="PillHealth logo" />
		<form class="w-[50%] flex flex-col gap-8" method="POST" action="?/signup">
			<h1 class="font-bold text-4xl">Register</h1>
			<div class="flex flex-col gap-5">
				<div class="relative w-full">
					<input
						class="peer bg-white w-full h-full py-3 px-4 border-2 border-solid border-[#c0c0c0] rounded-md focus:outline-none focus:border-theme"
						name="email"
						type="email"
					/>
					<span
						class="absolute bg-white px-1 -top-2 left-4 text-xs rounded-md text-[#c0c0c0] font-bold peer-focus:text-theme"
						>Email</span
					>
				</div>
				<div class="relative w-full">
					<span
						class="absolute bg-white px-1 -top-2 left-4 text-xs rounded-md text-[#c0c0c0] font-bold peer-focus:text-theme"
						>Password</span
					>
					<input
						class="w-full h-full bg-white py-3 px-4 border-2 border-solid border-[#c0c0c0] rounded-md focus:outline-none focus:border-theme focus:text-theme"
						name="password"
						type="password"
						placeholder="Password"
					/>
				</div>
			</div>
			<button class="bg-theme rounded-lg w-[20%] py-3 font-semibold text-lg text-white"
				>Register</button
			>
		</form>
		<!-- <form method="POST" action="?/signup">
			<div class="relative bg-[#c0c0c0]/60 w-[50%] h-[2px] rounded-md">
				<p class="absolute bg-white w-[60%] -top-3 left-28 text-center">
					Don't have an account? <button formaction="?/signup">Register</button>
				</p>
			</div>
		</form> -->
	</div>
	<img src={plant} class="w-[30%] object-cover object-left" alt="Plant" />
</div>
