<script>
	function randomNotification() {
		const sector = Math.floor(Math.random() * 8) + 1;
		const notifTitle = "It's time to take your pills!";
		const notifBody = `Look at Sector ${sector}`;
		const options = {
			body: notifBody
		};
		new Notification(notifTitle, options);
		setTimeout(randomNotification, 10000);
		console.log('hi');
	}
	async function handleClick() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker/index.ts');
			const reg = await navigator.serviceWorker.ready;
			reg.pushManager.subscribe({ userVisibleOnly: true });
		}
		Notification.requestPermission().then((result) => {
			if (result === 'granted') {
				randomNotification();
			}
		});
	}
</script>

<button on:click={handleClick}>Click me!</button>
