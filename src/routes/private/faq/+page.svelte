<script lang="ts">
  import { ExpansionPanel } from 'svelte-mui';
	let group = '';

	const onchage = ({ detail }) => {
	// console.log(detail.expanded ? 'open' : 'close', detail.name);
  };
</script>

<div class="flex flex-row h-screen bg-[url('/src/lib/assets/FAQ.png')] bg-right bg-no-repeat bg scaled-bg mb-10"> 
	<div class="flex flex-col w-[80%] gap-8">
		<div class="text-[#333333] text-left flex flex-col gap-3 ml-20 w-[70%]">
			<h1 class="text-4xl font-bold">Frequently Asked Questions</h1>
			<p class="text-2xl mb-10">Learn how PillHealth can treat you better.</p>
      	<div>
			<ExpansionPanel 
			name="**How do I schedule a medicine intake?" bind:group on:change={onchage} --focus-color="#000000">
				<div>
					On the dashboard, click the “+” icon on the right side of the medication bar to add a medicine. 
					A pop up will show where you add its details such as the name, description, and frequency.
					Thereafter selecting a compartment will allow After clicking “Add,” it should show up on the medication bar
				</div>
			</ExpansionPanel>
			<ExpansionPanel name="How do I refill the compartments?" bind:group on:change={onchage}>
					<div>
						To refill the compartments, open the device and load the pills into the designated compartments you have indicated on the app according to your medication schedule.
					</div>
				</ExpansionPanel>
			<!-- <ExpansionPanel name="What happens if I miss a dose?" bind:group on:change={onchage}>
					<div>
						If you miss a dose, PillHealth will send repeated reminders until you take your medication. The device also logs missed doses, which you can review through the app. This information can be shared with your healthcare provider if needed.
					</div>
				</ExpansionPanel> -->
			<ExpansionPanel name="What do I place in the description?" bind:group on:change={onchage}>
					<div>
						You may customize the description according to your liking to serve as a reminder.
						It can be the purpose of the medication, the dosage, or any other information you want to include.
					</div>
				</ExpansionPanel>
			<ExpansionPanel name="Can PillHealth dispense multiple medications?" bind:group on:change={onchage}>
					<div>
						Yes, PillHealth is equipped with multiple compartments that can hold different types of medications. You can program each compartment to dispense at specific times according to your prescribed schedule.
					</div>
				</ExpansionPanel>
			<ExpansionPanel name="What types of reminders does PillHealth provide?" bind:group on:change={onchage}>
					<div>
						PillHealth provides audible and visual alarms from the device along with email reminders.
					</div>
				</ExpansionPanel>
			<ExpansionPanel name="What if there is a power outage?" bind:group on:change={onchage}>
					<div>
						PillHealth has a built-in battery backup that ensures it continues to operate during a power outage. Once power is restored, the device will recharge automatically.
					</div>
				</ExpansionPanel>
			<ExpansionPanel name="How do I clean and maintain PillHealth?" bind:group on:change={onchage}>
					<div>
						To clean PillHealth, use a soft, damp cloth to wipe the exterior. Do not use harsh chemicals or submerge the device in water. Regularly check the compartments for any pill residue and clean them as needed..
					</div>
				</ExpansionPanel>
			<ExpansionPanel name="What if I need technical support?" bind:group on:change={onchage}>
					<div>
						Feel free to email us at pillhealth145@gmail.com and we will get back to you as soon as possible to provide assistance.
					</div>
			</ExpansionPanel>
		</div>
		</div>
	</div>
</div>

<style>
    .scaled-bg {
      background-size: 90%; /* Adjust the percentage to scale the background image */
	  background-position-y: 10%;
    }
  </style>