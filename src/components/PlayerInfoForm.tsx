import * as React from "react";
import { PlayerInfo } from 'src/definition/Model';

interface PlayerInfoProps {
    active: boolean;
    message: string;
    player: PlayerInfo;
}
export class PlayerInfoForm extends React.PureComponent<PlayerInfoProps, {}> {
    public render() {
        const {active, player, message} = this.props;
        const className = `player-info-container ${ active ? "active" : ""}`;
        return (
            <div className={className}>
                <div className="player-name">{player.name}</div>
                <div className="player-shots">
                    <div className="player-kill">Убито: {player.kills}</div>
                    <div className="player-miss">Промахов: {player.misses}</div>
                </div>
                <div className="player-ships"> Кораблей осталось: {player.ships.size()}</div>
				<div className="message-container">{player.name} {message}</div>
            </div>
        );
    }
}
