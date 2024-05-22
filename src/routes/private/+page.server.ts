import * as db from '$lib/database';
// import { supabase } from '$lib/supabaseClient';

export async function load() {
	// const { data: MedicineData } = await supabase.from('medicine').select();
	// const { data: SectorData } = await supabase.from('sector').select();
	return {
		logs: db.getLogs(),
		medicines: db.getMedicines(),
		users: db.getUsers()
	};
}
