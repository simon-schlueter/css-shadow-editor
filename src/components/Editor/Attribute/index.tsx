import * as React from "react";

const styles = require("./index.css");

interface IProps {
  name: string;
}

export default class Attribute extends React.Component<IProps, void> {

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.name}>
          {this.props.name}
        </div>
        <div className={styles.control}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
