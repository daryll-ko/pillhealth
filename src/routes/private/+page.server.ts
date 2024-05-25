import * as db from '$lib/database';

export async function load({ locals: { supabase } }) {
	return {
		medicines: await db.getMedicines(supabase),
		userData: await db.getUser(supabase)
	};
}