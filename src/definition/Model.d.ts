import { CELL_STATE } from "../constants/Constants";
import * as Collections from 'typescript-collections';

export interface Row {
	x: number;
	cells: Cell[];
}

export interface Cell {
	x: number;
	y: number;
	state: CELL_STATE;
	ship: number;
	highlight: boolean;
}

export interface Player {
	[name: string]: PlayerInfo;
}

export interface PlayerInfo {
	name: string;
	kills: number;
	misses: number; 
	field: Row[],
	history: History,
	ships: Collections.Dictionary<number, IShip>,
	isPC: boolean
}

export interface History {
	steps: string[];
}

export interface IShip {
	/** Get size ship. */
	getSize(): number;
	/** Shot in the ship. */
	hit(): boolean;
}
