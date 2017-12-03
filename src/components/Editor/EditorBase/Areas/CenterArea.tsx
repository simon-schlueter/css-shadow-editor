import * as React from "react";

const styles = require("./index.css");

const CenterArea = (props: React.Props<void>) => {
  return (
    <div className={styles.center}>
      {props.children}
    </div>
  );
};

export default CenterArea;
