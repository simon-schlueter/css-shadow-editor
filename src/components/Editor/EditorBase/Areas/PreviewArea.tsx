import * as React from "react";

const styles = require("./index.css");

const PreviewArea: React.StatelessComponent<{style: React.CSSProperties}> = ({ children, style }) => {
  return (
    <div className={styles.preview} style={style}>
      {children}
    </div>
  );
};

export default PreviewArea;
