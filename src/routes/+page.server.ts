import * as db from '$lib/database';

export async function load() {
	return {
		contents: db.getContents(),
		logs: db.getLogs()
	};
}
