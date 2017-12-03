import * as React from "react";

const styles = require("./index.css");

const BottomArea = (props: React.Props<void>) => {
  return (
    <div className={styles.bottom}>
      {props.children}
    </div>
  );
};

export default BottomArea;
