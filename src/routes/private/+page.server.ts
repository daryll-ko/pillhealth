import * as db from '$lib/database';
import type { Actions } from '@sveltejs/kit';

export async function load({ locals: { supabase } }) {
	return {
		medicines: await db.getMedicines(supabase),
		userData: await db.getUser(supabase)
	};
}

export const actions: Actions = {
	fromMedBox: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const selectedSectorValue = Number(formData.get('selectedSectorValue'));

		await db.clearCompartment(selectedSectorValue, supabase);

		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase)
		};
	},
	fromSidebar: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const medId = Number(formData.get('med_id'));
		const editing = String(formData.get('editing')) === 'true';
		const deleting = String(formData.get('deleting')) === 'true';
		const name = String(formData.get('name'));
		const description = String(formData.get('description'));
		const sector = Number(formData.get('sector'));

		if (editing) {
			await db.editMedicine(medId, name, description, supabase);
		}
		if (deleting) {
			if (sector === -1) {
				// delete from medbox
				await db.removeMedicine(medId, supabase);
			} else {
				await db.removePillFromSector(medId, sector, supabase);
			}
		}

		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase)
		};
	},
	fromMedDialog: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const proceed = formData.get('proceed') === 'true';
		const medId = Number(formData.get('med_id'));
		const name = String(formData.get('name'));
		const description = String(formData.get('description'));
		const color = String(formData.get('color'));
		const sector = Number(formData.get('sector'));

		if (proceed) {
			if (sector === -1) {
				// add to medbox
				await db.addMedicine(name, color, description, supabase);
			} else {
				await db.addPillToSector(medId, sector, supabase);
			}
		}

		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase),
			fired: true
		};
	},
	setTime: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const sector = Number(formData.get('sector'));
		const date = new Date(String(formData.get('date')));

		await db.setDispenseTime(sector, date, supabase);

		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase)
		};
	},
	alarm: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const alarm = Number(formData.get('alarm'));

		await db.editAlarm(alarm, supabase);

		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase)
		};
	},
	demo: async ({ locals: { supabase } }) => {
		const meds = (await db.getMedicines(supabase)).sort((a, b) => a.id - b.id);
		if (meds) {
			for (let j = 0; j < 4; ++j) {
				if (meds[j]) {
					for (let i = 0; i < 8; ++i) {
						if (!meds[j].in_sectors.includes(i) && Math.random() < 1 / (1 << (j + 1))) {
							await db.addPillToSector(meds[j].id, i, supabase);
						}
					}
				}
			}
		}
		// await db.setDispenseTime(0, new Date(new Date().getTime() + 60 * 1000), supabase);
		// await db.setDispenseTime(3, new Date(new Date().getTime() + 120 * 1000), supabase);
		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase)
		};
	}
};
