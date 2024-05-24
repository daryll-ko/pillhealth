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
