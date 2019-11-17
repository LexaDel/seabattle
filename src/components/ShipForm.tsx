import * as React from "react";
interface ShipFormProp {
    size: number;
}

export class ShipForm extends React.PureComponent<ShipFormProp, {}> {
    public render() {
        const deck = this.getDeck(this.props.size);
        const cls = `ship${this.props.size}`;
        return (
            <div className={cls}>{deck}</div>
        );
    }

    private getDeck(size: number): string {
        let deck = "";
        for (let i = 1; i <= size; i++) {
            deck += "*";
        }
        return deck;
    }
}
