import * as db from '$lib/database';

export async function DELETE({ params }) {
	await db.clearCompartment(parseInt(params.index));

	return new Response(null, { status: 204 });
}
