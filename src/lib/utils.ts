import { NUM_SECTORS, LOG_TYPES, MEDICINE_NAMES } from './constants';
import type { Database, Log, Medicine, User } from './types';

// [min, max)
export function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min));
}

function randElement<T>(a: T[]): T {
	return a[randInt(0, a.length)];
}

// adapted from https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
export function hsv2rgb([h, s, v]: [number, number, number]): [number, number, number] {
	const h_i = Math.floor(h * 6);
	const f = h * 6 - h_i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	let [r, g, b] = [0, 0, 0];
	if (h_i === 0) {
		[r, g, b] = [v, t, p];
	} else if (h_i === 1) {
		[r, g, b] = [q, v, p];
	} else if (h_i === 2) {
		[r, g, b] = [p, v, t];
	} else if (h_i === 3) {
		[r, g, b] = [p, q, v];
	} else if (h_i === 4) {
		[r, g, b] = [t, p, v];
	} else {
		[r, g, b] = [v, p, q];
	}
	return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)];
}

// adapted from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c: number): string {
	const hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex([r, g, b]: [number, number, number]): string {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function randColor(): string {
	return rgbToHex(hsv2rgb([Math.random(), 0.5, 0.95]));
}

function randDate(): Date {
	return new Date(new Date().getTime() + randInt(-120, 120) * 60 * 60 * 1000);
}

function randString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; ++i) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function generateLog(medicineId: number, userId: number): Log {
	return {
		timestamp: randDate(),
		type: LOG_TYPES[randInt(0, 3)],
		medicine_name: '',
		medicine_description: '',
		// medicine: medicineId,
		sector: randInt(0, NUM_SECTORS),
		user_id: String(userId)
	};
}

function generateMedicine(medicineId: number, userId: number): Medicine {
	const in_sectors = Array<number>(0);
	for (let i = 0; i < NUM_SECTORS; ++i) {
		if (randInt(0, 2) === 0) {
			in_sectors.push(i);
		}
	}
	return {
		id: medicineId,
		name: MEDICINE_NAMES[medicineId % MEDICINE_NAMES.length],
		color: randColor(),
		description: 'Success is not final',
		user_id: String(userId),
		in_sectors
	};
}

function generateUser(userId: number): User {
	return {
		user_id: String(userId),
		email: `${randString(3)}@gmail.com`,
		sector_1: randDate(),
		sector_2: randDate(),
		sector_3: randDate(),
		sector_4: randDate(),
		sector_5: randDate(),
		sector_6: randDate(),
		sector_7: randDate(),
		sector_8: randDate()
	};
}

export function uniquify<T>(a: T[]): T[] {
	return Array.from(new Set([...a]));
}

export function generateDatabase(): Database {
	const userIdPool = uniquify([...Array(1000)].map(() => randInt(0, 65536)));
	const medicineIdPool = uniquify([...Array(1000)].map(() => randInt(0, 65536)));
	const users = userIdPool.map((userId) => generateUser(userId));
	const userMedicineIdPool = uniquify(
		[...Array(1000)].map(() => [randElement(userIdPool), randElement(medicineIdPool)])
	);
	const medicines = userMedicineIdPool.map(([userId, medicineId]) =>
		generateMedicine(medicineId, userId)
	);
	const userMedicinePool = [...Array(1000)].map(() => [
		randElement(userIdPool),
		randElement(medicineIdPool)
	]);
	const logs = userMedicinePool.map(([userId, medicineId]) => generateLog(medicineId, userId));
	return {
		logs,
		medicines,
		users
	};
}
