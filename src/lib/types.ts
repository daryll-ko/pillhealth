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
