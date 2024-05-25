import { json } from '@sveltejs/kit';
import * as db from '$lib/database';

export async function PUT({ request, locals: { supabase } }) {
	const { sector, time } = await request.json();

	await db.setDispenseTime(sector, new Date(time), supabase);

	return json({}, { status: 201 });
}
