import * as React from "react";
import { PlayerInfo, IShip } from 'src/definition/Model';
import { ShipForm } from './ShipForm';

interface PlayerInfoProps {
    active: boolean;
    player: PlayerInfo;
    position: string;
}
export class PlayerInfoForm extends React.PureComponent<PlayerInfoProps, {}> {
    public render() {
        const {active, player, position} = this.props;
        const className = `player-info-container ${ active ? "active" : ""} ${position}`;
        const playerNameCls = `player-name ${ player.isPC ? "computer" : ""}`;
        return (
            <div className={className}>
                <div className={playerNameCls}>{player.name}</div>
                <div className="player-shots">
                    <div className="player-kill">Убито: {player.kills}</div>
                    <div className="player-miss">Промахов: {player.misses}</div>
                </div>
                <div className="player-ships"> Кораблей осталось: {player.ships.size}
                    {this.renderShips(player.ships)}
                </div>
            </div>
        );
    }

    private renderShips(ships: Map<number, IShip>): JSX.Element[] {
        const shipForm: JSX.Element[] = [];
        ships.forEach(ship => {
            shipForm.push(<ShipForm size={ship.getSize()}/>)
        });
        return shipForm
    }
}
