import * as db from '$lib/database';
import { getContents, getMedicines } from '$lib/database';

// import { Medicine, Sector } from '$lib/types';

export async function load({locals: {supabase}}) {
	const { data: SectorData } = await supabase.from('sector').select();
	console.log(SectorData);
	return {
		contents: await getContents(supabase),
		logs: db.getLogs(),
		medicine: await getMedicines(supabase) ?? [],
		sector: SectorData ?? []
	};
}
