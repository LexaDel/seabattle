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
            <div className={className}>
                {this.renderRows(field)}
            </div>
        );
    }

    private renderRows(field: RowModel[]): JSX.Element[] {
        const rows: JSX.Element[] = [];
        for (const row of field) {
            const {x, cells} = row;
            rows.push(<Row x={x} cells={cells} onCellClick={this.props.onCellClick}/>);
        }
        return rows;
    }
}