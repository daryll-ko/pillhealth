import { json } from '@sveltejs/kit';
import * as db from '$lib/database';

export function GET({ locals: { supabase } }) {
	return json(db.getLogs(supabase));
}

export async function POST({ request, locals: { supabase } }) {
	const { medicine_name, medicine_description, sector } = await request.json();
	const { data } = await supabase.auth.getUser();

	const timestamp = new Date();

	if (data.user) {
		await db.addLog(
			{
				timestamp,
				time_taken: null,
				medicine_name,
				medicine_description,
				sector,
				user_id: data.user.id
			},
			supabase
		);
		return json({ timestamp }, { status: 201 });
	}

	return json({}, { status: 400 });
}
