import { COMPARTMENT_CAPACITY } from './constants';
import type { Database, Log, Pill } from './types';
import { generateContents } from './utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getContents(supabase: SupabaseClient): Promise<Pill[][]> {
	const { data, error } = await supabase
		.from('medicine')
		.select();

	if (error) {
        console.error('Error getting contents:', error);
        throw error;
    }

	const res: Pill[][] = [[], [], [], [], [], [], [], []];
	data.forEach((pills: Pill) => {
        pills.sectors.forEach((sector) => {
            res[sector - 1].push(pills);
        });
    });
	console.log("res", res);
	return res;
}

export async function setDispenseTime(sector: number, time: Date, supabase: SupabaseClient) {
	const columnName = `sector_${sector}`;

	let loggedInUID: null | string = null;
	const { data: authData } = await supabase.auth.getUser();
	loggedInUID = authData.user?.id ?? null;

	if (loggedInUID) {
		const updateData: { [key: string]: any } = {};
		updateData[columnName] = time;

		const { error } = await supabase
			.from('sector')
			.update(updateData)
			.eq('user_id', loggedInUID);

		if (error) {
			console.error('Error updating dispense time:', error);
			throw error;
		}
	} else {
		console.error('User is not logged in');
		throw new Error('User is not logged in');
	}
}

export async function getMedicines(supabase: SupabaseClient): Promise<Pill[]> {
	const { data, error } = await supabase
		.from('medicine')
		.select();

	if (error) {
		console.error('Error getting contents:', error);
		throw error;
	}
	return data;
}

export async function addMedicine(medicine: Pill, supabase: SupabaseClient) {
	const { error } = await supabase
		.from('medicine')
		.insert({
			name: medicine.name,
			description: medicine.description,
			color: medicine.color,
			sectors: medicine.sectors
		});

	if (error) {
		console.error('Error inserting medicine:', error);
		throw error;
	}
}

export async function removeMedicine(medicine: Pill, supabase: SupabaseClient) {
	const { error } = await supabase
		.from('medicine')
		.delete()
		.eq('name', medicine.name);

	if (error) {
		console.error('Error deleting medicine:', error);
		throw error;
	}
}

export async function editMedicine(medicine: Pill, supabase: SupabaseClient) {
	const { error } = await supabase
		.from('medicine')
		.update({
			name: medicine.name,
			description: medicine.description,
			color: medicine.color,
			sectors: medicine.sectors
		})
		.eq('name', medicine.name);

	if (error) {
		console.error('Error updating medicine:', error);
		throw error;
	}
}

export async function addPillToSector(pillname: string, sector: number, supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from('medicine')
		.select('sectors')
		.eq('name', pillname);

	if (error) {
		console.error('Error getting medicine:', error);
		throw error;
	}

	if (data.length === 0) {
		console.error('Medicine not found');
		throw new Error('Medicine not found');
	}

	console.log('sector_data', data);

	const medicine = data[0];
	const sectors = medicine.sectors;
	if (sectors.includes(sector)) {
		console.error('Medicine already in sector');
		throw new Error('Medicine already in sector');
	}

	sectors.push(sector);

	const { error: updateError } = await supabase
		.from('medicine')
		.update({
			sectors: sectors
		})
		.eq('name', pillname);

	if (updateError) {
		console.error('Error updating medicine:', updateError);
		throw updateError;
	}
}

export async function removePillFromSector(pillname: string, sector: number, supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from('medicine')
		.select('sectors')
		.eq('name', pillname);

	if (error) {
		console.error('Error getting medicine:', error);
		throw error;
	}

	if (data.length === 0) {
		console.error('Medicine not found');
		throw new Error('Medicine not found');
	}

	const medicine = data[0];
	const sectors = medicine.sectors;
	if (!sectors.includes(sector)) {
		console.error('Medicine not in sector');
		throw new Error('Medicine not in sector');
	}

	const newSectors = sectors.filter((s:number) => s !== sector);

	const { error: updateError } = await supabase
		.from('medicine')
		.update({
			sectors: newSectors
		})
		.eq('name', pillname);

	if (updateError) {
		console.error('Error updating medicine:', updateError);
		throw updateError;
	}
}

export async function clearCompartment(sector: number, supabase: SupabaseClient) {
	try {
        const contents = await getContents(supabase);

        for (const pill of contents[sector - 1]) {
            await removePillFromSector(pill.name, sector, supabase);
        }

        console.log(`Compartment ${sector} cleared successfully.`);
    } catch (error) {
        console.error('Error clearing compartment:', error);
        throw error;
    }
}

// export async function addUser(supabase: SupabaseClient) {
		
// } //harder than i thought





// mock database
const db: Database = generateDatabase();

// export function getMedicines(): Medicine[] {
// 	return db.medicines;
// }

export function getLogs(): Log[] {
	return db.logs;
}

export function getUsers(): User[] {
	return db.users;
}
