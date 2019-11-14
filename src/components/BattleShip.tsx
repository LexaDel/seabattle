import * as React from "react";
import Field from "./Field";
import { SIZE_FIELD, GAME_OVER, STATUS, STEP_TIME, GAME_MODE } from "../constants/Constants";
import { History as HistoryModel, PlayerInfo } from "../definition/Model";
import { Player } from "../controls/Player";
import { createField, createShips, fillRandom, random } from "../utils/Utils";
import { Cell as CellModel, Row as RowModel } from "src/definition/Model";
import { CELL_STATE } from "src/constants/Constants";
import { PlayerInfoForm } from './PlayerInfoForm';

interface BattleShipProps {
    players: string[];
    gameMode: string;
}
interface State {	
	[name: string]: any;
	gameState: string;
    message?: string;
    status: string;
}

export class BattleShip extends React.PureComponent<BattleShipProps, {}> {
    public queuePlayers: string[] = [];
	public state: State;

	constructor(props: any) {
		super(props);
		const listOfShip = [{
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
		const fieldP1 = createField(SIZE_FIELD);
		const fieldP2 = createField(SIZE_FIELD);
		const shipsP1 = createShips(listOfShip);
		const shipsP2 = createShips(listOfShip);
		const history: HistoryModel = { 
			steps: []
        };
		const players: string[] = [...this.props.players];
		let isPC = false;
        if (players.length === 1) {
			players.push("computer");
			isPC = true;
        }
		// TODO: вынести в создание или поля или игрока
		fillRandom(fieldP1, shipsP1);
		fillRandom(fieldP2, shipsP2);
		const player1 = new Player(players[0], fieldP2, history, shipsP1);
		const player2 = new Player(players[1], fieldP1, history, shipsP2, isPC);
		this.queuePlayers.push(...players);
		this.state = {
            gameState: players[0],
            status: STATUS.ATTACK
        };

		Object.assign(this.state, player1.getUser(), player2.getUser());
	}


	public render() {
		if (this.state.gameState !== GAME_OVER) {
			const player: PlayerInfo = this.state[this.state.gameState];
            const field = player.field;
			const status = this.state.status;
			const message = this.state.message ? this.state.message : "";
			return (
				<React.Fragment>
					<PlayerInfoForm player={player} active={true} message={message} />
					<div className="board">
						<h3> {this.state.gameState} </h3>
						<div className="flipper">
							<div className="front">
								<Field 
									playerID={this.state.gameState} 
									field={field} 
									onCellClick={status === STATUS.ATTACK && !player.isPC ? this.cellClick : undefined}
								/>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<div> Игра окончена </div>
			);
		}
    }
    

	private cellClick = (x: number, y: number) => {
		this.setState((state: State) => {
			const player: PlayerInfo = state[state.gameState];
			const cell = player.field[x].cells[y];
			const result = this.ply(cell, player);
			return result && {
				gameState: result.gameState,
				[state.gameState]: result.player,
                message: result.message,
                status: STATUS.SHOW
			}
        });
        
        // Shows field for 5 seconds and pass the move to the next player.
		setTimeout(() => {
            this.setState(() => {			
                const turn = this.queuePlayers.shift();
                if (turn !== undefined) { this.queuePlayers.push(turn) };
                return {
                    gameState: this.queuePlayers[0],
                    message: `Ходит ${this.queuePlayers[0]}`,
                    status: STATUS.ATTACK
                }
            });
            if (this.props.gameMode === GAME_MODE.USER_VS_PC && this.state[this.queuePlayers[0]].isPC) {
                this.computerStep();
            }
        }, STEP_TIME);


	}

	private ply(cell: CellModel, player: PlayerInfo): any {
		if (cell.state === CELL_STATE.SHIP || cell.state === CELL_STATE.EMPTY) {
			let message = "";
            let gameState = this.queuePlayers[0];
			if (CELL_STATE.SHIP === cell.state) {
				cell.state = CELL_STATE.HIT;
				const ship = player.ships.getValue(cell.ship);
				const deathShip = ship && ship.hit();
				if (deathShip) {
					player.kills++;
					player.ships.remove(cell.ship);
					message = "Убил";
					if (player.ships.size() === 0) {
						message = "Игра окончена";
						gameState = GAME_OVER;
					}
				} else {
					message = "Попал";
				}
			} else {
				cell.state = CELL_STATE.MISS;
				player.misses++;
				message = "Промахнулся";
			}
			return {
				gameState,
				message,
				player
			}
		}
		return undefined;
    }
    
    private computerStep(): void {
        setTimeout(() => {
            const field = this.state[this.state.gameState].field as RowModel[];
            const x = random(9);
            const y = random(9);
            if (field[x].cells[y].state !== CELL_STATE.MISS) {
                this.cellClick(x, y);
            } else {
                this.computerStep();
            }
        },900);
    }
}
