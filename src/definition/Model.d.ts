import { CELL_STATE } from "../constants/Constants";

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
	ships: Map<number, IShip>,
	isPC: boolean,
}

export interface History {
	steps: Coordinate[];
}

export interface Coordinate {
	x: number;
	y: number;
}

export interface IShip {
	/** Get size ship. */
	getSize(): number;
	/** Get health ship. */
	getHealth(): number;
	/** Shot in the ship. */
	hit(): boolean;
}
