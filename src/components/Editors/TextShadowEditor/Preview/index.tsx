import * as React from "react";
import { IShadowEffect, IRgbaColor } from "../../../../interfaces";
import { getBoxShadowString } from "../../../../util/conversion";

const styles = require("./index.css");

interface IProps {
  boxShadowEffects: IShadowEffect[];
  foreground: IRgbaColor;
  fontSize: number;
  fontFamily: string;
}

export default class Preview extends React.Component<IProps, void> {

  render() {
    const background = this.props.foreground;
    const style = {
      textShadow: this.props.boxShadowEffects.filter((layer) => layer.visible).map(getBoxShadowString).join(", "),
      color: `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a})`,
      fontSize: this.props.fontSize,
      fontFamily: this.props.fontFamily
    };

    return (
      <div className={styles.container} style={style}>
        CSS Text Shadow
      </div>
    );
  }
}
