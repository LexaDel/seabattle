import * as React from "react";
import { Cell as CellModel } from "src/definition/Model";
import { CELL_STATE } from "src/constants/Constants";

export interface CellProps {
    cell: CellModel;
    onCellClick?: (x: number, y: number) => void;
    state: CELL_STATE;
}

export default class Cell extends React.Component<CellProps, {}> {
    public render() {
        const { x, y, state } = this.props.cell;
        const className = `cell ${state}`;
        return (<div className={className} key={`cell-${x}-${y}`} attr-x={x} attr-y={y} onClick={this.handleCellClick.bind(this, x, y)} />);
    }
    
    private handleCellClick(x: number, y: number) {
        if (this.props.onCellClick) {
            this.props.onCellClick(x, y);
        }
    }
}