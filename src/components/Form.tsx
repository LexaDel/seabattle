import * as React from "react";

interface FormProps {
    title: string;
    id: string;
}

export class Form extends React.PureComponent<FormProps, {}> {
    public render() {
        return (
            <div className="form">
                <div className="form-title">{this.props.title}</div>
                <input id={this.props.id} type="text" placeholder={this.props.id}/>
            </div>
        );
    }
}