import { COMPARTMENT_CAPACITY } from './constants';
import type { Database, Log, Pill } from './types';
import { generateContents } from './utils';

const db: Database = {
	contents: generateContents(),
	logs: []
};

export function getContents(): Pill[][] {
	return db.contents;
}

export function getLogs(): Log[] {
	return db.logs;
}

export async function addToCompartment(index: number, pill: Pill) {
	if (db.contents[index].length < COMPARTMENT_CAPACITY) {
		db.contents[index].push(pill);
	}
}

export async function clearCompartment(index: number) {
	db.contents[index] = [];
}
