import * as React from "react";
import { IRgbaColor } from "../../../../interfaces";
import { ChromePicker } from "react-color";

const styles = require("./index.css");

interface IProps {
  value: IRgbaColor;
  onChange: (value: ReactColor.ColorResult) => void;
}

interface IState {
  visible?: boolean;
}

export default class ColorInput extends React.Component<IProps, IState> {

  state: IState = {
    visible: false
  };

  private modal: HTMLElement;
  private button: HTMLElement;

  componentDidMount() {
    window.addEventListener("mousedown", this.onClickInWindow);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.onClickInWindow);
  }

  private onClickInWindow = (e: MouseEvent) => {
    if (!this.state.visible) return;

    if (e.target === this.button) {
      return;
    }

    if (!this.modal.contains(e.target as HTMLElement)) {
      e.stopPropagation();
      e.preventDefault();

      this.setState({ visible: false });
    }
  };

  private onToggleVisibility = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({ visible: !this.state.visible });
  };

  private onModalRef = (modal: HTMLElement) => {
    this.modal = modal;
  };

  private onButtonRef = (button: HTMLElement) => {
    this.button = button;
  };

  render() {
    const { value } = this.props;

    return (
      <div className={styles.container}>
        <div
          className={styles.preview}
          style={{ backgroundColor: `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})` }}
          onClick={this.onToggleVisibility}
          ref={this.onButtonRef}
        />
        {this.state.visible && <div className={styles.modal} ref={this.onModalRef}>
          <ChromePicker color={this.props.value} onChange={this.props.onChange} />
        </div>}
      </div>
    );
  }
}
