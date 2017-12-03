import * as React from "react";

const styles = require("./index.css");

interface IProps {
  value: number;
  onChange: (value: number, name?: string) => void;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default class NumberInput extends React.Component<IProps, void> {

  private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.props.onChange(Number(e.currentTarget.value), this.props.name);
  };

  render() {
    return (
      <input
        type="number"
        className={styles.input}
        value={this.props.value}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        onChange={this.onChange}
      />
    );
  }
}
