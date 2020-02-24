import * as React from "react";
import { Row as RowModel } from "../definition/Model";
import Row from "./Row";

export interface FieldProps {
    playerID: string;
    field: RowModel[];
    onCellClick?: (x: number, y: number) => void;
}

export interface CellProps {
    x: number;
    y: number;
}

export default class Field extends React.Component<FieldProps, {}> {
    public static defaultProps = {
        playerID: "bot",
        size: 10
    };
    
    public render() {
        const className = `seabattle-field player-${this.props.playerID}`;
        const { field } = this.props;
        return (
            <div className={className} key={this.props.playerID}>
                {this.renderRows(field)}
            </div>
        );
    }

    private renderRows(field: RowModel[]): JSX.Element[] {
        return field.map(row => <Row key={row.x.toString()} x={row.x} cells={row.cells} onCellClick={this.props.onCellClick}/>);
    }
}