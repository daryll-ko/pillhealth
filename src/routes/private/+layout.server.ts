/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/

import * as db from '$lib/database';

export async function load({ locals: { supabase } }) {
	return {
		medicines: await db.getMedicines(supabase),
		userData: await db.getUser(supabase)
	};
}