import { CELL_STATE, ORIENTATION } from "src/constants/Constants";
import { Cell, Row, IShip } from "../definition/Model.d";
import { Ship } from "../controls/Ship";
import * as Collections from "typescript-collections";

interface Place {
    x: number;
    y: number;
    orientation: ORIENTATION;
}

export function createField(size: number): Row[] {
    const rows = new Array<Row>(size);
    for (let i = 0; i < size; i++) {
        rows[i] = {
            cells: new Array<Cell>(size),
            x: i
        };
        for (let j = 0; j < size; j++) {
            rows[i].cells[j] = createCell({ x: i, y: j});
        }
      }
    return rows;
}

export function createShips(listOfShips: any[]): Collections.Dictionary<number, IShip> {
    const ships: Collections.Dictionary<number, IShip> = new Collections.Dictionary<number, IShip>();
    listOfShips.forEach((item: any, index: number) => {
        const ship = new Ship(item.size);
        ships.setValue(index, ship);
    })
    return ships;
}


export function fillRandom(field: Row[], ships: Collections.Dictionary<number, IShip>) {
    ships.forEach((key: number, ship: IShip) => {
        const size = ship.getSize();
        const places = getPlaces(field, size);
        if (places.length) {
            const placeIndex = random(places.length);
            placeTo(field, key, size, shuffle(places)[placeIndex]);
        }
    });
}

export function random (max: number, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getPlaces(field: Row[], size: number): Place[] {
    const places: Place[] = [];
    field.forEach((row: Row) => {
        row.cells.forEach((cell: Cell) => {
            const {x, y} = cell;
            if (x + size < field.length) {
                let i = x;
                for (; i < x + size; i++) {
                    if (isShipAround(field, i, y)){
                        break;
                    }
                    if (i === x + size - 1) {
                        places.push({x, y, orientation: ORIENTATION.HORIZONTAL});
                    }
                }
            }

            if (y + size < field[x].cells.length) {
                let j = y;
                for (; j < y + size; j++) {
                    if (isShipAround(field, x, j)){
                        break;
                    }
                    if (j === y + size - 1) {
                        places.push({x, y, orientation: ORIENTATION.VERTICAL});
                    }
                }
            }
        });
    });
    return places;
}

function isShipAround(field: Row[], x: number, y: number): boolean {
    const minX = Math.max(x - 1, 0);
    const minY = Math.max(y - 1, 0);
    const maxX = Math.min(x + 1, field.length - 1);
    const maxY = Math.min(y + 1, field[0].cells.length - 1);
    return field[x].cells[y].ship !== -1 || field[minX].cells[y].ship !== -1 || field[x].cells[minY].ship !== -1
      || field[maxX].cells[y].ship !== -1 || field[x].cells[maxY].ship !== -1;
}

function createCell({ x = 0, y = 0, state = CELL_STATE.EMPTY, ship = -1 } = {}): Cell {
    return { x, y, state, ship };
}

function shuffle(array: any[]): any[] {
    let counter = array.length;
  
    while (counter > 0) {
        const index = random(counter);
  
        counter--;
  
        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
  
    return array;
}

function placeTo(field: Row[], ship: number, shipSize: number, place: Place): void {
    const {x, y, orientation} = place;
    if (orientation === ORIENTATION.HORIZONTAL) {
      for (let i = x; i < x + shipSize; i++) {
        field[i].cells[y].ship = ship;
        field[i].cells[y].state = CELL_STATE.SHIP; 
      }
    }
    if (orientation === ORIENTATION.VERTICAL) {
      for (let j = y; j < y + shipSize; j++) {
        field[x].cells[j].ship = ship;
        field[x].cells[j].state = CELL_STATE.SHIP;
      }
    }
}