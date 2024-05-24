export interface Log {
	timestamp: Date;
	type: 'dispense' | 'take' | 'refill';
	medicine: number;
	sector: number;
	dose: number;
	user_id: number;
}

export interface Medicine {
	id: number;
	name: string;
	color: string;
	description: string;
	user_id: number;
	in_sectors: Set<number>;
}

export interface User {
	user_id: number;
	email: string;
	sector_1: Date;
	sector_2: Date;
	sector_3: Date;
	sector_4: Date;
	sector_5: Date;
	sector_6: Date;
	sector_7: Date;
	sector_8: Date;
}

export interface Database {
	logs: Log[];
	medicines: Medicine[];
	users: User[];
}
