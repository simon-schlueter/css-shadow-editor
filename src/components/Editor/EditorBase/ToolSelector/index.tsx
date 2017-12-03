import * as React from "react";
import { Link } from "react-router";
import Icon from "../../../Common/Icon";

const styles = require("./index.css");

interface IProps {
  activeTool: string;
}

interface IState {
  open?: boolean;
}

export default class ToolSelector extends React.Component<IProps, IState> {

  state: IState = {
    open: false
  };

  componentDidMount() {
    window.addEventListener("click", this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onClick);
  }

  private onClick = (e: MouseEvent) => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  };

  private onToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div>
        <a href="#" onClick={this.onToggle} className={styles.toolSelectorLink}>
          {this.props.activeTool}
          <Icon icon="caret-down" className={styles.caretIcon} />
        </a>
        {this.state.open && <div className={styles.toolSelector}>
          <Link className={styles.tool} to="/boxshadow-editor">CSS box-shadow Editor</Link>
          <Link className={styles.tool} to="/textshadow-editor">CSS text-shadow Editor</Link>
        </div>}
      </div>
    );
  }
}
