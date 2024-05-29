import { json } from '@sveltejs/kit';
import * as db from '$lib/database';

export async function GET({ locals: { supabase } }) {
	const user = await db.getUser(supabase);

	const timestamps = [
		user.sector_1,
		user.sector_2,
		user.sector_3,
		user.sector_4,
		user.sector_5,
		user.sector_6,
		user.sector_7,
		user.sector_8
	]
		.map((timestamp, index) => ({
			date: timestamp ? new Date(timestamp).valueOf() : 0,
			index
		}))
		.sort((a, b) => a.date - b.date);

	return json(timestamps);
}
