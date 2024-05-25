import type { Log, Medicine, User } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function setDispenseTime(sector: number, time: Date, supabase: SupabaseClient) {
	const columnName = `sector_${sector + 1}`;

	let loggedInUID: null | string = null;
	const { data: authData } = await supabase.auth.getUser();
	loggedInUID = authData.user?.id ?? null;

	if (loggedInUID) {
		const updateData: { [key: string]: Date } = {};
		updateData[columnName] = time;

		const { error } = await supabase.from('user').update(updateData).eq('user_id', loggedInUID);

		if (error) {
			console.error('Error updating dispense time:', error);
			throw error;
		}
	} else {
		console.error('User is not logged in');
		throw new Error('User is not logged in');
	}
}

export async function getMedicines(supabase: SupabaseClient): Promise<Medicine[]> {
	const { data, error } = await supabase.from('medicine').select();

	if (error) {
		console.error('Error getting contents:', error);
		throw error;
	}

	// console.log('getMedicines', data);
	return data;
}

export async function addMedicine(medicine: Medicine, supabase: SupabaseClient) {
	const { error } = await supabase.from('medicine').insert({
		name: medicine.name,
		color: medicine.color,
		description: medicine.description,
		user_id: medicine.user_id,
		in_sectors: Array.from(medicine.in_sectors)
	});

	if (error) {
		console.error('Error inserting medicine:', error);
		throw error;
	}
}

export async function removeMedicine(medicine_id: number, supabase: SupabaseClient) {
	const { error } = await supabase.from('medicine').delete().eq('id', medicine_id);

	if (error) {
		console.error('Error deleting medicine:', error);
		throw error;
	}
}

export async function editMedicine(medicine: Medicine, supabase: SupabaseClient) {
	const { error } = await supabase
		.from('medicine')
		.update({
			name: medicine.name,
			description: medicine.description,
			color: medicine.color,
			in_sectors: medicine.in_sectors
		})
		.eq('id', medicine.id);

	if (error) {
		console.error('Error updating medicine:', error);
		throw error;
	}
}

export async function addPillToSector(
	medicine_id: number,
	sector: number,
	supabase: SupabaseClient
) {
	const { data, error } = await supabase
		.from('medicine')
		.select('in_sectors')
		.eq('id', medicine_id)
		.single();

	if (error) {
		console.error('Error getting medicine:', error);
		throw error;
	}

	if (!data) {
		console.error('Medicine not found');
		throw new Error('Medicine not found');
	}

	// console.log('sector_data', data);

	const sectors = data.in_sectors;
	if (sectors.includes(sector)) {
		console.error('Medicine already in sector');
		throw new Error('Medicine already in sector');
	}

	sectors.push(sector);

	const { error: updateError } = await supabase
		.from('medicine')
		.update({
			in_sectors: sectors
		})
		.eq('id', medicine_id);

	if (updateError) {
		console.error('Error updating medicine:', updateError);
		throw updateError;
	}
}

export async function removePillFromSector(
	medicine_id: number,
	sector: number,
	supabase: SupabaseClient
) {
	const { data, error } = await supabase
		.from('medicine')
		.select('in_sectors')
		.eq('id', medicine_id)
		.single();

	if (error) {
		console.error('Error getting medicine:', error);
		throw error;
	}

	if (!data) {
		console.error('Medicine not found');
		throw new Error('Medicine not found');
	}

	const sectors = data.in_sectors;
	if (!sectors.includes(sector)) {
		console.error('Medicine not in sector');
		throw new Error('Medicine not in sector');
	}

	const newSectors = sectors.filter((s: number) => s !== sector);

	const { error: updateError } = await supabase
		.from('medicine')
		.update({
			in_sectors: newSectors
		})
		.eq('id', medicine_id);

	if (updateError) {
		console.error('Error updating medicine:', updateError);
		throw updateError;
	}
}

export async function clearCompartment(sector: number, supabase: SupabaseClient) {
	const { data, error } = await supabase.from('medicine').select('id, in_sectors');

	if (error) {
		console.error('Error getting medicines:', error);
		throw error;
	}
	if (!data) {
		console.error('No medicines found');
		throw new Error('No medicines found');
	}
	for (const medicine of data) {
		const { id, in_sectors } = medicine;

		if (in_sectors.includes(sector)) {
			const updatedSectors = in_sectors.filter((s: number) => s !== sector);
			const { error: updateError } = await supabase
				.from('medicine')
				.update({ in_sectors: updatedSectors })
				.eq('id', id);

			if (updateError) {
				console.error(`Error updating medicine with id ${id}:`, updateError);
				throw updateError;
			}
			// perform log ?
		}
	}
	// console.log(`Compartment ${sector} cleared successfully.`);
}

export async function getLogs(supabase: SupabaseClient): Promise<Log[]> {
	const { data, error } = await supabase.from('log').select();

	if (error) {
		console.error('Error getting logs:', error);
		throw error;
	}

	const res: Log[] = data.map((entry) => ({
		timestamp: new Date(entry.timestamp),
		type: entry.type,
		medicine_name: entry.medicine_name,
		medicine_description: entry.medicine_description,
		sector: Number(entry.sector),
		user_id: entry.user_id
	}));

	return res;
}

export async function addLog(log: Log, supabase: SupabaseClient) {
	const { error } = await supabase.from('log').insert({
		timestamp: log.timestamp,
		type: log.type,
		medicine_name: log.medicine_name,
		medicine_description: log.medicine_description,
		sector: log.sector,
		user_id: log.user_id
	});

	if (error) {
		console.error('Error inserting log:', error);
		throw error;
	}
}

export async function getUser(supabase: SupabaseClient): Promise<User> {
	const { data, error } = await supabase.from('user').select().single();

	if (error) {
		console.error('Error getting user:', error);
		throw error;
	}

	if (data.length === 0) {
		console.error('User not found');
		throw new Error('User not found');
	}
	// console.log('getUser', data);

	return data;
}

// mock database

// import type { Database, Log, Medicine, User } from './types';
// import { generateDatabase } from './utils';

// const db: Database = generateDatabase();

// export function getLogs(): Log[] {
// 	return db.logs;
// }

// export function getMedicines(): Medicine[] {
// 	return db.medicines;
// }

// export function getUsers(): User[] {
// 	return db.users;
// }
