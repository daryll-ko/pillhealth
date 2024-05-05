import { PILL_TYPES } from '$lib/constants.js';
import * as db from '$lib/database';

export async function PUT({ params }) {
	await db.addToCompartment(parseInt(params.index), PILL_TYPES[parseInt(params.pillNum)]);

	return new Response(null, { status: 201 });
}
