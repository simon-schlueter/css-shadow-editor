import * as React from "react";
import { IShadowEffect } from "../../../interfaces";
import { getBoxShadowString } from "../../../util/conversion";

const styles = require("./index.css");

interface IProps {
  layers: IShadowEffect[];
  onSeralize: (layers: IShadowEffect[]) => string;
}

interface IState {
  code?: string;
}

export default class CodeBox extends React.Component<IProps, IState> {

  private timeout: number;

  componentWillMount() {
    this.setState({ code: this.props.onSeralize(this.props.layers) });
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (this.timeout != null) {
      return;
    }

    this.timeout = setTimeout(
      () => {
        this.timeout = null;
        this.setState({ code: this.props.onSeralize(this.props.layers) });
      },
      150
    );
  }

  componentWillUnmount() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return (
      <pre className={styles.container}>{this.state.code}</pre>
    );
  }
}
