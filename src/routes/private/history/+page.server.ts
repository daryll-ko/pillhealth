import * as db from '$lib/database';

export async function load({ locals: { supabase } }) {
	return {
		logs: await db.getLogs(supabase)
	};
}
