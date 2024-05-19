import { json } from '@sveltejs/kit';
import * as db from '$lib/database';

export function GET() {
	return json(db.getContents());
}
