import * as React from "react";
import Icon from "../../Common/Icon";

const styles = require("./index.css");

interface IButton {
  icon: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface IProps {
  name: string;
  buttons?: IButton[];
  showBottomBorder?: boolean;
  headerElement?: React.ReactElement<any>;
}

export default class Panel extends React.Component<IProps, void> {

  static defaultProps: any = {
    showBottomBorder: true
  };

  private renderButtons() {
    if (this.props.buttons == null) return null;

    return this.props.buttons.map((button) => {
      return (
        <button className={styles.button} onClick={button.onClick} key={button.icon}>
          <Icon icon={button.icon} />
        </button>
      );
    });
  }

  private renderExtraHeaderElement() {
    return this.props.headerElement;
  }

  render() {
    return (
      <div className={styles.container + (!this.props.showBottomBorder ? ` ${styles.noBorder}` : "")}>
        <div className={styles.header}>
          <div className={styles.name}>{this.props.name}</div>
          {this.renderExtraHeaderElement()}
          {this.renderButtons()}
        </div>
        {this.props.children}
      </div>
    );
  }
}
