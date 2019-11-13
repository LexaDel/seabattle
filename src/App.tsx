import * as React from "react";
import { BattleShip } from "./components/BattleShip";
import LoginForm from "./components/LoginForm";
import { GAME_MODE } from "./constants/Constants";

interface State {
	isLogin: boolean;
	players: string[];
}

export default class App extends React.Component {
	public state: State;
	
	constructor(props: any) {
		super(props);
		this.state = {
			isLogin: false,
			players: []
		};
	}

	public render() {
		return (this.startGame());
	}

	private startGame(): JSX.Element {
		if (this.state.isLogin) {
			return <BattleShip 
				players={this.state.players}
				gameMode={this.state.players.length === 1 ? GAME_MODE.USER_VS_PC : GAME_MODE.USER_VS_USER}
			/>
		} 
		return <LoginForm onLogin={this.onLogin}/>
	}

	private onLogin = (state: boolean, players: string[]) => {
		this.setState({
			isLogin: state,
			players
		});
	}
}
