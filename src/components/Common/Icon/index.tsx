import * as React from "react";

interface IProps {
  icon: string;
  className?: string;
}

export default class Icon extends React.Component<IProps, void> {

  render() {
    let className = `fa fa-${this.props.icon}`;

    if (this.props.className != null) {
      className += ` ${this.props.className}`;
    }

    return (
      <i className={className} />
    );
  }
}
