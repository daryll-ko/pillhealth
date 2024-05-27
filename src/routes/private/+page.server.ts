import * as db from '$lib/database';
import type { Actions } from '@sveltejs/kit';

export async function load({ locals: { supabase } }) {
	return {
		medicines: await db.getMedicines(supabase),
		userData: await db.getUser(supabase)
	};
}

export const actions: Actions = {
	fromMedBox: async ({ request, locals: { supabase }}) => {
		const formData = await request.formData();
		const selectedSectorValue = Number(formData.get("selectedSectorValue"));

		await db.clearCompartment(selectedSectorValue, supabase);

		return {
			medicines: await db.getMedicines(supabase),
			userData: await db.getUser(supabase)
		};
	},
	fromSidebar: async ({ request, locals: { supabase }}) => { 
		const formData = await request.formData();
		const medId = Number(formData.get("med_id"));
		const editing = String(formData.get("editing")) === "true";
		const deleting = String(formData.get("deleting")) === "true";
		const name = String(formData.get("name"));
		const description = String(formData.get("description"));
		const sector = Number(formData.get("sector"));

		if (editing) {
			await db.editMedicine(medId, name, description, supabase);
		}
		if (deleting) {
			if (sector === -1) { // delete from medbox
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
		console.log(formData);

		const proceed = formData.get("proceed") === "true";
		const medId = Number(formData.get('med_id'));
		const name = String(formData.get('name'));
		const description = String(formData.get('description'));
		const color = String(formData.get('color'));
		const sector = Number(formData.get('sector'));	

		if (proceed) {
			if (sector === -1) { // add to medbox
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
	}
};
