import { SIZE_FIELD } from './../constants/Constants';
import { Coordinate, PlayerInfo } from './../definition/Model.d';
import { CELL_STATE, ORIENTATION } from "src/constants/Constants";
import { Cell, Row, IShip } from "../definition/Model.d";
import { Ship } from "../controls/Ship";

interface Place {
    x: number;
    y: number;
    orientation: ORIENTATION;
}

let tentativeSteps: {
    steps: Coordinate[],
    hits: Coordinate[],
    orientation?: ORIENTATION,
} = {
    steps: [],
    hits: [],
};

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

export function createShips(listOfShips: any[]): Map<number, IShip> {
    const ships: Map<number, IShip> = new Map<number, IShip>();
    listOfShips.forEach((item: any, index: number) => {
        const ship = new Ship(item.size);
        ships.set(index, ship);
    })
    return ships;
}


export function fillRandom(field: Row[], ships: Map<number, IShip>) {
    ships.forEach((ship: IShip, key: number) => {
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

function createCell({ x = 0, y = 0, state = CELL_STATE.EMPTY, ship = -1, highlight = false } = {}): Cell {
    return { x, y, state, ship, highlight };
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
      }
    }
    if (orientation === ORIENTATION.VERTICAL) {
      for (let j = y; j < y + shipSize; j++) {
        field[x].cells[j].ship = ship;
      }
    }
}

function calculateOrientation(firstCoordinate: Coordinate, secondCoordinate: Coordinate): ORIENTATION | undefined {
    if (firstCoordinate.x - secondCoordinate.x !== 0) return ORIENTATION.HORIZONTAL;
    if (firstCoordinate.y - secondCoordinate.y !== 0) return ORIENTATION.VERTICAL;

    return;
}

export function checkCoordinate(field: Row[], coordinate: Coordinate) {
    const { x, y } = coordinate;
    if (x > SIZE_FIELD - 1 || y > SIZE_FIELD - 1 || x < 0 || y < 0) {
        return false;
    };

    console.log(`check x:${coordinate.x} y: ${coordinate.y}`);
    
    return field[x].cells[y].state === CELL_STATE.EMPTY;
}

function calculateTentativeSteps(field: Row[], coordinate: Coordinate, orientation?: ORIENTATION): void {
    const { x, y } = coordinate;
    if (!orientation) {
        checkCoordinate(field, { x: x + 1, y }) && tentativeSteps.steps.push({ x: x + 1, y });
        checkCoordinate(field, { x: x - 1, y }) && tentativeSteps.steps.push({ x: x - 1, y });
        checkCoordinate(field, { x, y: y + 1 }) && tentativeSteps.steps.push({ x, y: y + 1 });
        checkCoordinate(field, { x, y: y - 1 }) && tentativeSteps.steps.push({ x, y: y - 1 });
    }
    if (orientation === ORIENTATION.HORIZONTAL) {
        const xCoordinates = tentativeSteps.hits.map(({ x }) => x);
        const maxX = Math.max(...xCoordinates);
        const minX = Math.min(...xCoordinates);
        
        checkCoordinate(field, { x: maxX + 1, y }) && tentativeSteps.steps.push({ x: maxX + 1, y });
        checkCoordinate(field, { x: minX - 1, y }) && tentativeSteps.steps.push({ x: minX - 1, y });
    }
    if (orientation === ORIENTATION.VERTICAL) {
        const yCoordinates = tentativeSteps.hits.map(({ y }) => y);
        const maxY = Math.max(...yCoordinates);
        const minY = Math.min(...yCoordinates);

        checkCoordinate(field, { x, y: maxY + 1 }) && tentativeSteps.steps.push({ x, y: maxY + 1 });
        checkCoordinate(field, { x, y: minY - 1 }) && tentativeSteps.steps.push({ x, y: minY - 1 });
    }
}

export function calculateCoordinate(playerInfo: PlayerInfo): Coordinate {
    const { field, ships } = playerInfo;
    console.log('1');
    
    if (tentativeSteps.steps && tentativeSteps.steps.length > 0) {
        const { x, y } = tentativeSteps.steps.pop()!;
        const ship = ships.get(field[x].cells[y].ship);
        if (ship && !tentativeSteps.orientation) {
            // set orientation
            tentativeSteps.orientation = calculateOrientation({ x, y }, tentativeSteps.hits[tentativeSteps.hits.length - 1]);
            tentativeSteps.steps = [];
            calculateTentativeSteps(field, { x, y }, tentativeSteps.orientation);
        }

        if (ship && ship.getHealth() > 1) {
            // increase hits
            tentativeSteps.hits.push({ x, y });
            tentativeSteps.steps = [];
            calculateTentativeSteps(field, { x, y }, tentativeSteps.orientation);
        }       
        
        if (ship && ship.getHealth() === 1) {
            // reset steps
            tentativeSteps = {
                steps: [],
                hits: [],
            };
        }
        console.log(`health: ${ship && ship.getHealth()}, tentativeSteps: ${tentativeSteps}`);

        console.log(tentativeSteps);        
        return { x, y };
    }

    console.log('2');

    let x = random(SIZE_FIELD);
    let y = random(SIZE_FIELD);
    while (field[x].cells[y].state !== CELL_STATE.EMPTY) {
        console.log('3');
        x = random(SIZE_FIELD);
        y = random(SIZE_FIELD);
    }

    const ship = ships.get(field[x].cells[y].ship);
    if (ship && ship.getHealth() > 1) {
        calculateTentativeSteps(field, { x, y });
        tentativeSteps.hits.push({ x, y });
    }

    return { x, y };
}
