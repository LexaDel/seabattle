import * as React from "react";
import { Cell as CellModel } from "src/definition/Model";
import Cell from "./Cell";

export interface RowProps {
    x: number
    cells: CellModel[];
    onCellClick?: (x: number, y: number) => void;
}

export default class Row extends React.Component<RowProps, {}> {

    public render() {
        const { x, cells } = this.props; 
        return (
            <div className="row" key={x}> 
                {this.renderCells(cells)}
            </div>);
    }

    private renderCells(list: CellModel[]): JSX.Element[] {
        return list.map(cell => <Cell key={`cell-${cell.x}-${cell.y}`} cell={cell} onCellClick={this.props.onCellClick}/>);
    }
}
