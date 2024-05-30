import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	console.log('--- esp esp esp ---');
	console.log();
	const body = await request.json();
	console.log(body);
	console.log();
	console.log('--- esp esp esp ---');
	console.log();
	return json({ ok: true, message: 'hello', date: new Date() });
}
