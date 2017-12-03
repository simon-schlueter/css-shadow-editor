import * as React from "react";

const styles = require("./index.css");

const SideArea = (props: React.Props<void>) => {
  return (
    <div className={styles.side}>
      {props.children}
    </div>
  );
};

export default SideArea;
