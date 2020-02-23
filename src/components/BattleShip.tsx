import * as React from "react";
import Field from "./Field";
import { SIZE_FIELD, GAME_OVER, STATUS, STEP_TIME, GAME_MODE, COMPUTER_NAME, listOfShip } from "../constants/Constants";
import { History as HistoryModel, PlayerInfo } from "../definition/Model";
import { Player } from "../controls/Player";
import { createField, createShips, fillRandom, getCoords } from "../utils/Utils";
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
	winner?: string;
}

export class BattleShip extends React.PureComponent<BattleShipProps, {}> {
    public queuePlayers: string[] = [];
	public state: State;

	constructor(props: any) {
		super(props);
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
			players.push(COMPUTER_NAME);
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
			const player1 = this.state[this.props.players[0]]; 
			const playerName = this.props.players.length === 1 ? COMPUTER_NAME : this.props.players[1];
			const player2 = this.state[playerName];
			return (
				<React.Fragment>
					<PlayerInfoForm player={player1} active={player1.name === this.state.gameState} position={"left"}/>
					<div className="board">
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
					<PlayerInfoForm player={player2} active={player2.name === this.state.gameState}  position={"right"}/>
				</React.Fragment>
			);
		} else {
			return (
				<div className="game-over">
					<h1> Игра окончена </h1>
					<div>Победил {this.state.winner}</div> 
				</div>
			);
		}
    }
    

	private cellClick = (x: number, y: number) => {
		let gameOver = false;
		this.setState((state: State) => {
			const player: PlayerInfo = state[state.gameState];
			const cell = player.field[x].cells[y];
			const result = this.ply(cell, player);
			this.highlightRiskCells(player.field, cell);
			gameOver = result.gameState === GAME_OVER;
			return result && {
				gameState: result.gameState,
				[state.gameState]: result.player,
                message: result.message,
				status: STATUS.SHOW,
				winner: result.winner
			}
		});
        
		// Shows field for 5 seconds and pass the move to the next player.
		setTimeout(() => {
			if (!gameOver) {
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
			}
		}, STEP_TIME);
	}

	private ply(cell: CellModel, player: PlayerInfo): any {
		if (cell.ship !== -1 || cell.state === CELL_STATE.EMPTY) {
			let message = "";
			let winner = "";
            let gameState = this.queuePlayers[0];
			if (cell.ship !== -1) {
				cell.state = CELL_STATE.HIT;
				const ship = player.ships.get(cell.ship);
				const deathShip = ship && ship.hit();
				if (deathShip) {
					player.kills++;
					cell.highlight = false;
					player.ships.delete(cell.ship);
					message = "Убил";
					if (player.ships.size === 0) {
						message = "Игра окончена";
						gameState = GAME_OVER;
						winner = player.name;
					}
				} else {
					cell.highlight = false;
					message = "Попал";
				}
			} else {
				cell.state = CELL_STATE.MISS;
				cell.highlight = false;
				player.misses++;
				message = "Промахнулся";
			}
			return {
				gameState,
				message,
				player,
				winner
			}
		}
		return undefined;
    }
    
    private computerStep(): void {
        setTimeout(() => {
			const field = this.state[this.state.gameState].field as RowModel[];
            const { x, y } = getCoords(field);
			this.cellClick(x, y);
        },900);
	}
	
	private highlightRiskCells(field: RowModel[], cell: CellModel): void {
		if (cell.state === CELL_STATE.HIT) {
			const {x, y} = cell;
			this.highlight(x + 1, y, field);
			this.highlight(x - 1, y, field);
			this.highlight(x, y + 1, field);
			this.highlight(x, y - 1, field);
		}
	}

	private highlight(x: number, y: number, field: RowModel[]) {
		if ((x >= 0 && x < SIZE_FIELD) && (y >= 0 && y < SIZE_FIELD)) {
			field[x].cells[y].highlight = field[x].cells[y].state === CELL_STATE.EMPTY;
		}
	}
}
