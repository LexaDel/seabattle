import * as React from "react";
import { List } from "./List";
import { Form } from "./Form";

interface State {
	countPlayers: number;
}

interface LoginFormProps {
    onLogin: (state: boolean, players: string[]) => void;
}

export default class LoginForm extends React.PureComponent<LoginFormProps, {}> {
    public state: State
    
    constructor(props: any) {        
        super(props);
        
        this.state = {
            countPlayers: 1
        };
    }

    public render() {
        const countPlayers = this.state.countPlayers;
        return (
            <div className="login-container">
                <div className="login-list-container">
                    <div className="login-list-title">Выберите количество игроков</div>
                    <List onCountPlayerChange={this.onHandleChange} />
                </div>
                <div className="login-form-container">
                    {this.renderInputName(countPlayers)}
                </div>
                <div className="login-start-container">
                    <button onClick={this.onHandleClick}>Начать игру</button>
                </div>
            </div>
        );
    }

    private renderInputName(countPlayers: number): JSX.Element[] {
        const forms: JSX.Element[] = [];
        for (let i = 1; i <= countPlayers; i++) {
            const title = `Введите имя игрока ${i}`;
            const idEl = `player-${i}`;

            forms.push(<Form title={title} id={idEl}/>);
        }
        return forms;
    }

    private onHandleChange = (countPlayers: number) => {
        this.setState({
            countPlayers
        })
    }

    private onHandleClick = () => {
        const players: string[] = [];
        for (let i = 1; i <= this.state.countPlayers; i++) {
            const idEl = `player-${i}`;
            const input = document.getElementById(idEl) as HTMLInputElement;
            players.push(input.value || idEl);
        }
        this.props.onLogin(true, players);
    }
}
