import { IShip } from "./../definition/Model.d";
import {
    History,
    Player as PlayerModel,
    PlayerInfo,
    Row,
    } from "../definition/Model";

export class Player {
    private name: string;
    private userInfo: PlayerInfo;

    constructor(name: string, field: Row[], history: History, ships: Map<number, IShip>, pc?: boolean) {
        const kills = 0
        const misses = 0;
        this.name = name;
        this.userInfo = {
            field,
            history,
            isPC: !!pc,
            kills,
            misses,
            name,
            ships
        }
    }

    public getUser(): PlayerModel {
        return { [this.name]: this.userInfo };
    }
}
