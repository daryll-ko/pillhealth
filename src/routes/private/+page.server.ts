import * as db from '$lib/database';

export async function load({ locals: { supabase } }) {
	return {
		medicines: await db.getMedicines(supabase),
		userData: await db.getUser(supabase)
	};
}

// cron node
import cron from 'node-cron';
import { supabase } from '$lib/supabaseClient';

cron.schedule('*/15 * * * *', async () => {
	// every 15 minutes
	// insert medicine
	console.log('Inserting medicine');
	const medicine = {
		name: 'New Medicine',
		quantity: 30
	};
	await supabase.from('medicine').insert(medicine);
});

console.log('Cron job started');
