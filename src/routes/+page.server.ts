import * as db from '$lib/database';
import { supabase } from '$lib/supabaseClient';
// import { Medicine, Sector } from '$lib/types';

export async function load() {
	const { data: MedicineData } = await supabase.from('medicine').select();
	const { data: SectorData } = await supabase.from('sector').select();
	console.log(SectorData);
	return {
		contents: db.getContents(),
		logs: db.getLogs(),
		medicine: MedicineData ?? [],
		sector: SectorData ?? []
	};
}
