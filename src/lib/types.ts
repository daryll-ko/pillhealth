export interface Log {
	timestamp: Date;
	medicine_name: string;
	medicine_description: string;
	sector: number;
	user_id: string;
	time_taken: Date | null;
}

export interface Medicine {
	id: number;
	name: string;
	color: string;
	description: string;
	user_id: string;
	in_sectors: number[];
}

export interface User {
	user_id: string;
	email: string;
	sector_1?: Date;
	sector_2?: Date;
	sector_3?: Date;
	sector_4?: Date;
	sector_5?: Date;
	sector_6?: Date;
	sector_7?: Date;
	sector_8?: Date;
}

export interface Database {
	logs: Log[];
	medicines: Medicine[];
	users: User[];
}
