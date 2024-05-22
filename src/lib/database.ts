import type { Database, Log, Medicine, User } from './types';
import { generateDatabase } from './utils';

// mock database
const db: Database = generateDatabase();

export function getMedicines(): Medicine[] {
	return db.medicines;
}

export function getLogs(): Log[] {
	return db.logs;
}

export function getUsers(): User[] {
	return db.users;
}
