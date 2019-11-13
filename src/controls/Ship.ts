import { IShip } from "../definition/Model";

export class Ship implements IShip {
    private size: number;
    private health: number;

    constructor(size: number) {
        this.size = size;
        this.health = size;
    }

    public getSize(): number {
        return this.size;
    }

    public getHealth(): number {
        return this.health;
    }

    /**
     * Ship shot and check death hit or not.
     * @return boolean
     */
    public hit(): boolean {
        this.health--;
        return this.health === 0;
    }
}