import * as React from "react";
import { PlayerInfo } from 'src/definition/Model';

interface PlayerInfoProps {
    active: boolean;
    player: PlayerInfo;
    position: string;
}
export class PlayerInfoForm extends React.PureComponent<PlayerInfoProps, {}> {
    public render() {
        const {active, player, position} = this.props;
        const className = `player-info-container ${ active ? "active" : ""} ${position}`;
        return (
            <div className={className}>
                <div className="player-name">{player.name}</div>
                <div className="player-shots">
                    <div className="player-kill">Убито: {player.kills}</div>
                    <div className="player-miss">Промахов: {player.misses}</div>
                </div>
                <div className="player-ships"> Кораблей осталось: {player.ships.size()}</div>
            </div>
        );
    }
}
