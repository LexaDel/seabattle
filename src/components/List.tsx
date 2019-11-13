import * as React from "react";

interface ListProps {
    onCountPlayerChange: (countPlayers: number) => void; 
}

export class List extends React.PureComponent<ListProps, {}> {
    public render () {
        return (
            <div className="list">
                <select onChange={this.handleChange}>
                    <option value={1}>1 игрок</option>
                    <option value={2}>2 игрока</option>
                </select>
            </div>
        );
    }

    private handleChange = (e: any) => {
        this.props.onCountPlayerChange(e.target.value);
    }
}