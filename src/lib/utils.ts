import { COMPARTMENTS, COMPARTMENT_CAPACITY, PILL_TYPES } from './constants';
import type { Pill } from './types';

// [min, max)
export function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min));
}

export function generateContents(): Pill[][] {
	const res: Pill[][] = [[], [], [], [], [], [], [], []];
	for (let i = 0; i < COMPARTMENTS; ++i) {
		for (let j = 0; j < randInt(5, COMPARTMENT_CAPACITY + 1); ++j) {
			res[i].push(PILL_TYPES[randInt(0, PILL_TYPES.length)]);
		}
	}
	return res;
}
