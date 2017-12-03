import * as React from "react";
import { IShadowEffect, IRgbaColor } from "../../../../interfaces";
import { getBoxShadowString } from "../../../../util/conversion";

const styles = require("./index.css");

interface IProps {
  boxShadowEffects: IShadowEffect[];
  foreground: IRgbaColor;
  borderRadius: number;
  size: number;
}

export default class Preview extends React.Component<IProps, void> {

  render() {
    const background = this.props.foreground;
    const style = {
      boxShadow: this.props.boxShadowEffects.filter((layer) => layer.visible).map(getBoxShadowString).join(", "),
      backgroundColor: `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a})`,
      borderRadius: this.props.borderRadius,
      width: this.props.size,
      height: this.props.size
    };

    return (
      <div className={styles.container} style={style} />
    );
  }
}
