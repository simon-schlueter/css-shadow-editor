import * as React from "react";
import * as shallowCompare from "react-addons-shallow-compare";

const styles = require("./index.css");

interface IProps {
  value: number;
  onChange: (value: number, name?: string) => void;
  min: number;
  max: number;
  step: number;
  name?: string;
}

export default class SliderInput extends React.Component<IProps, void> {

  private dragging: boolean = false;
  private container: HTMLElement;

  shouldComponentUpdate(nextProps: IProps, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (this.dragging) return;

    e.preventDefault();

    this.dragging = true;

    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
  };

  onMouseUp = () => {
    if (!this.dragging) return;

    this.dragging = false;

    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mousemove", this.onMouseMove);
  };

  onMouseMove = (e: MouseEvent) => {
    this.updatePosition(e.pageX);
  };

  onClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget !== e.target) return;

    this.updatePosition(e.pageX);
  };

  onRef = (container: HTMLElement) => {
    this.container = container;
  };

  private updatePosition(x: number) {
    const rect = this.container.getBoundingClientRect();

    const position = Math.min(rect.right, Math.max(rect.left, x)) - rect.left;
    const percentage = position / rect.width;
    const steps = Math.abs(this.props.min - this.props.max) / this.props.step;
    const step = Math.round(percentage * steps);
    const value = (step * this.props.step) + this.props.min;

    if (value === this.props.value) {
      return;
    }

    this.props.onChange(value, this.props.name);
  }

  render() {
    const value = Math.max(Math.min(this.props.max, this.props.value), this.props.min) - this.props.min;
    const max = Math.abs(this.props.min - this.props.max);
    const progress = value / max;

    return (
      <div className={styles.container} onMouseDown={this.onMouseDown} ref={this.onRef}>
        <div className={styles.filling} onClick={this.onClick} style={{ width: `${progress * 100}%` }}>
          <div className={styles.thumb} style={{ right: `${-14 * (1 - progress)}px` }}></div>
        </div>
      </div>
    );
  }
}
