import * as React from "react";
import { Cell as CellModel } from "src/definition/Model";

export interface CellProps {
    cell: CellModel;
    onCellClick?: (x: number, y: number) => void;
}

export default class Cell extends React.Component<CellProps, {}> {
    public render() {
        const { x, y, state, highlight } = this.props.cell;
        const className = `cell ${state} ${highlight ? "highlight" : ""}`;
        return (
        <div 
            className={className} 
            onClick={this.handleCellClick.bind(this, x, y)}
        />);
    }
    
    private handleCellClick(x: number, y: number) {
        if (this.props.onCellClick) {
            this.props.onCellClick(x, y);
        }
    }
}
