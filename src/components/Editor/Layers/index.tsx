import * as React from "react";
import { DragDropContext } from "react-dnd";
import * as HTML5Backend from "react-dnd-html5-backend";

class Layers extends React.Component<void, void> {

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Layers) as any as typeof Layers;
