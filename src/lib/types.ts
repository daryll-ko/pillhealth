export interface Pill {
	name: string;
	color: string;
}

export interface Log {
	date: Date;
	action: 'dispense' | 'refill';
	sector: number;
	pill?: Pill;
}

export interface Database {
	contents: Pill[][];
	logs: Log[];
}

export interface Sector {
	id: number;
	name: string;
}

export interface Medicine {
	id: number;
	name: string;
	sector: number;
	color: string;
}
