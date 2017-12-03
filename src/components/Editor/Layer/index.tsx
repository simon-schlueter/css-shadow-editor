import * as React from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DragSourceSpec, DragSourceMonitor, DropTargetSpec, DragSourceConnector, ConnectDragSource, DropTarget, DropTargetConnector, DropTargetMonitor, ConnectDropTarget } from "react-dnd";
import Icon from "../../Common/Icon";
import { IRgbaColor } from "../../../interfaces";

const styles = require("./index.css");

interface IProps {
  name: string;
  visible: boolean;
  active: boolean;
  index: number;
  color: IRgbaColor;
  inset: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onToggleVisibility: (visible: boolean) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
}

const layerSource: DragSourceSpec<IProps> = {
  beginDrag: (props: IProps) => ({
    name: props.name,
    index: props.index
  })
};

const layerTarget: DropTargetSpec<IProps> = {
  hover(props, monitor, component) {
    const dragIndex = (monitor.getItem() as any).index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.onMoveCard(dragIndex, hoverIndex);

    (monitor.getItem() as any).index = hoverIndex;
  }
};

const sourceCollector = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
};

const targetCollector = (connect: DropTargetConnector, monitor: DropTargetMonitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  }
};

class Layer extends React.Component<IProps, any> {

  private onRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.onRemove();
  };

  private onToggleVisibility = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.onToggleVisibility(!this.props.visible)
  };

  render() {
    const { connectDragSource, connectDropTarget, isDragging, color, inset } = this.props;

    if (isDragging) {
      return connectDragSource(connectDropTarget(
        <div className={styles.container} onClick={this.props.onSelect}></div>
      ));
    }

    return connectDragSource(connectDropTarget(
      <div className={this.props.active ? styles.containerActive : styles.container} onClick={this.props.onSelect} style={{ opacity: isDragging ? 0 : 1 }}>
        <div className={styles.preview} style={{ boxShadow: `0px 0px 5px rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})${inset ? " inset" : ""}` }}></div>
        <div className={styles.name}>{this.props.name}</div>
        <button className={styles.button} onClick={this.onRemove}>
          <Icon icon={"trash"} />
        </button>
        <button className={this.props.visible ? styles.button : styles.buttonInactive} onClick={this.onToggleVisibility}>
          <Icon icon={this.props.visible ? "eye" : "eye-slash"} />
        </button>
      </div>
    ));
  }
}

export default DropTarget("layer", layerTarget, targetCollector)(DragSource("layer", layerSource, sourceCollector)(Layer)) as any as typeof Layer;
