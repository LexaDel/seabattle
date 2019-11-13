import { IShip } from "./../definition/Model.d";
import * as Collections from "typescript-collections";
import {
    History,
    Player as PlayerModel,
    PlayerInfo,
    Row
    } from "../definition/Model";
export class Player {
    private name: string;
    private userInfo: PlayerInfo;

    constructor(name: string, field: Row[], history: History, ships: Collections.Dictionary<number, IShip>, pc?: boolean) {
        this.name = name;
        this.userInfo = {
            field,
            history,
            isPC: !!pc,
            ships
        }
    }

    public getUser(): PlayerModel {
        return { [this.name]: this.userInfo };
    }
}