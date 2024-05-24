import * as db from '$lib/database';
import { getMedicines, getUser } from '$lib/database';
// import { supabase } from '$lib/supabaseClient';

export async function load({locals:{supabase}}) {
	// const { data: MedicineData } = await supabase.from('medicine').select();
	// const { data: SectorData } = await supabase.from('sector').select();
	return {
		logs: db.getLogs(),
		medicines: await getMedicines(supabase),
		users: await getUser(supabase)
	};
}

// cron node
import { supabase } from '$lib/supabaseClient';
import cron from 'node-cron';

cron.schedule('*/15 * * * *', async () => {  // every 15 minutes
	// insert medicine
	console.log('Inserting medicine');
	const medicine = {
		name: 'New Medicine',
		color: '#ffffff',
		description: 'This is a new medicine',
		in_sectors: [1, 2, 3, 4, 5, 6, 7, 8],
	};
	await supabase.from('medicine').insert(medicine);
});

console.log('Cron job started');