import { json } from '@sveltejs/kit';
import * as db from '$lib/database';
import { randInt } from '$lib/utils.js';

export async function POST({ request, locals: { supabase } }) {
	const { name, color, description } = await request.json();
	const { data } = await supabase.auth.getUser();

	const id = randInt(0, 65536);

	if (data.user) {
		await db.addMedicine(
			{
				id,
				name,
				color,
				description,
				user_id: data.user.id,
				in_sectors: []
			},
			supabase
		);
		return json({ id }, { status: 201 });
	}

	return json({}, { status: 400 });
}

export async function PUT({ request, locals: { supabase } }) {
	const { id, name, color, description, user_id, in_sectors } = await request.json();

	await db.editMedicine(
		{
			id,
			name,
			color,
			description,
			user_id,
			in_sectors
		},
		supabase
	);

	return json({ id }, { status: 201 });
}

export async function DELETE({ request, locals: { supabase } }) {
	const { id } = await request.json();

	await db.removeMedicine(Number(id), supabase);

	return json({ id }, { status: 201 });
}
