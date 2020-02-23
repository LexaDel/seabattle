export const enum CELL_STATE {
    MISS = "miss",
    HIT = "hit",
    SHIP = "ship",
    EMPTY = "empty"
}

export const listOfShip = [{
    size: 1
}, {
    size: 1
}, {
    size: 1
}, {
    size: 1
}, {
    size: 2
}, {
    size: 2
}, {
    size: 2
}, {
    size: 3
}, {
    size: 3
}, {
    size: 4
}];

export const SIZE_FIELD = 10;
export const STEP_TIME = 1500;

export const enum ORIENTATION {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}

export const enum STATUS {
    SHOW = "show",
    ATTACK = "attack"
}

export enum GAME_MODE {
    USER_VS_PC = "user_pc",
    USER_VS_USER = "user_user"
}

export const GAME_OVER = "game over";
export const COMPUTER_NAME = "computer";
