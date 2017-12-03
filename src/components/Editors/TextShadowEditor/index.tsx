import * as React from "react";
import * as copy from "copy-to-clipboard";
import * as parseColor from "parse-color";
import { ChromePicker } from "react-color";
import Preview from "./Preview";
import { IShadowEffect, IRgbaColor } from "../../../interfaces";
import EditorBase, { SideArea, PreviewArea, BottomArea, CenterArea } from "../../Editor/EditorBase";
import Attribute from "../../Editor/Attribute";
import SliderInput from "../../Common/Form/SliderInput";
import NumberInput from "../../Common/Form/NumberInput";
import ColorInput from "../../Common/Form/ColorInput";
import Panel from "../../Editor/Panel";
import Layer from "../../Editor/Layer";
import Layers from "../../Editor/Layers";
import CodeBox from "../../Editor/CodeBox";
import Icon from "../../Common/Icon";
import { parseBoxShadowString, getTextShadowString } from "../../../util/conversion";

const update = require("react/lib/update");

const styles = require("./index.css");

interface IProps {
}

interface IState {
  layers?: IShadowEffect[];
  selectedLayerName?: string;
  background?: IRgbaColor;
  foreground?: IRgbaColor;
  fontSize?: number;
  fontFamily?: string;
}

export default class TextShadowEditor extends React.Component<IProps, IState> {

  state: IState = {
    layers: [],
    background: { r: 255, g: 255, b: 255, a: 1 },
    foreground: { r: 238, g: 238, b: 238, a: 1 },
    fontSize: 28,
    fontFamily: "Lato"
  };

  private currentId: number = 0;

  componentWillMount() {
    this.onAddLayer();
  }

  private onSelectLayer = (layer: IShadowEffect) => {
    this.setState({ selectedLayerName: layer.name });
  };

  private onToggleVisibility = (layer: IShadowEffect, visible: boolean) => {
    layer.visible = visible;
    this.forceUpdate();
  };

  private onCopyToClipboard = () => {
    copy(this.onSerialize(this.state.layers));
  };

  private onImport = () => {
    const value = prompt("Enter the box-shadow value below:", "0px 0px 7px 0px #000");

    if (value == null) return;

    const layers = parseBoxShadowString(value);

    if (layers == null) {
      return;
    }

    this.setState({
      layers,
      selectedLayerName: layers[0].name
    });
  };

  private onMoveLayer = (dragIndex: number, hoverIndex: number) => {
    const { layers } = this.state;
    const dragCard = layers[dragIndex];

    this.setState(update(this.state, {
      layers: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  private onDeleteLayer = (layer: IShadowEffect) => {
    const index = this.state.layers.indexOf(layer);

    if (index === -1) {
      return;
    }

    this.state.layers.splice(index, 1);

    if (this.state.selectedLayerName === layer.name) {
      this.setState({ selectedLayerName: this.state.layers[0] != null ? this.state.layers[0].name : null });
    }

    this.forceUpdate();
  };

  private onChangeBackground = (res: ReactColor.ColorResult) => {
    this.setState({ background: res.rgb as any });
  };

  private onChangeForeground = (res: ReactColor.ColorResult) => {
    this.setState({ foreground: res.rgb as any });
  };

  private onChangeFontFamily = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    this.setState({ fontFamily: e.currentTarget.options[e.currentTarget.selectedIndex].value });
  };

  private onChangeFontSize = (res: number) => {
    this.setState({ fontSize: res });
  };

  private onAddLayer = () => {
    ++this.currentId;

    const effect: IShadowEffect = {
      inset: false,
      xOffset: 0,
      yOffset: 0,
      spread: 0,
      blur: 8,
      color: {r: 0, g: 0, b: 0, a: 1},
      name: `Layer ${this.currentId}`,
      visible: true
    };

    this.setState({
      layers: [effect].concat(this.state.layers),
      selectedLayerName: effect.name
    });
  }

  private onChangeInset = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState(update(this.state, {
      layers: {
        [this.getCurrentLayerIndex()]: {
          inset: {
            $set: e.currentTarget.checked
          }
        }
      }
    }));
  };

  private onSerialize = (layers: IShadowEffect[]) => {
    const value = layers.filter((effect) => effect.visible).map(getTextShadowString).join(", ");

    return `text-shadow: ${value};\n`;
  }

  private onChangeColor = (res: ReactColor.ColorResult) => {
    this.setState(update(this.state, {
      layers: {
        [this.getCurrentLayerIndex()]: {
          color: {
            $set: res.rgb
          }
        }
      }
    }));
  };

  private onChangeValue = (value: number, name: string) => {
    this.setState(update(this.state, {
      layers: {
        [this.getCurrentLayerIndex()]: {
          [name]: {
            $set: value
          }
        }
      }
    }));
  };

  private getCurrentLayerIndex() {
    for (let i = 0; i < this.state.layers.length; ++i) {
      if (this.state.layers[i].name === this.state.selectedLayerName) {
        return i;
      }
    }

    return -1;
  }

  private renderControls() {
    const effect = this.state.layers[this.getCurrentLayerIndex()];

    if (effect == null) {
      return null;
    }

    return [
      <Panel name="Attributes" key="attributes">
        <Attribute name="Blur">
          <SliderInput value={effect.blur} onChange={this.onChangeValue} name="blur" min={0} max={100} step={1} />
          <NumberInput min={0} step={1} value={effect.blur} name="blur" onChange={this.onChangeValue} />
        </Attribute>
        <Attribute name="Offset X">
          <SliderInput value={effect.xOffset} onChange={this.onChangeValue} name="xOffset" min={-50} max={50} step={1} />
          <NumberInput min={0} step={1} value={effect.xOffset} name="xOffset" onChange={this.onChangeValue} />
        </Attribute>
        <Attribute name="Offset Y">
          <SliderInput value={effect.yOffset} onChange={this.onChangeValue} name="yOffset" min={-50} max={50} step={1} />
          <NumberInput step={1} value={effect.yOffset} name="yOffset" onChange={this.onChangeValue} />
        </Attribute>
      </Panel>,
      <Panel name="Color" key="color">
        <ChromePicker
          color={effect.color}
          onChange={this.onChangeColor}
        />
      </Panel>
    ];
  }

  render() {
    const { background } = this.state;

    return (
      <EditorBase
        onImport={this.onImport}
        onCopyToClipboard={this.onCopyToClipboard}
        name="CSS text-shadow Editor"
        onRestore={(data) => this.setState(data)}
        onAutoSave={() => this.state}
        id="textshadow"
      >
        <SideArea>
          {this.renderControls()}
        </SideArea>
        <CenterArea>
          <PreviewArea style={{ backgroundColor: `rgba(${background.r}, ${background.g}, ${background.b}, 1)` }}>
            <Preview
              boxShadowEffects={this.state.layers}
              foreground={this.state.foreground}
              fontSize={this.state.fontSize}
              fontFamily={this.state.fontFamily}
            />
          </PreviewArea>
          <BottomArea>
            <Panel name="Code" showBottomBorder={false}>
              <CodeBox onSeralize={this.onSerialize} layers={this.state.layers} />
            </Panel>
          </BottomArea>
        </CenterArea>
        <SideArea>
          <Panel name="Shadow Layers" buttons={[{ icon: "plus", onClick: this.onAddLayer }]}>
            <Layers>
              {this.state.layers.map((layer, index) => {
                return (
                  <Layer
                    name={layer.name}
                    visible={layer.visible}
                    color={layer.color}
                    inset={layer.inset}
                    active={this.state.selectedLayerName === layer.name}
                    onSelect={() => this.onSelectLayer(layer)}
                    onToggleVisibility={(visible) => this.onToggleVisibility(layer, visible)}
                    onRemove={() => this.onDeleteLayer(layer)}
                    onMoveCard={this.onMoveLayer}
                    index={index}
                    key={layer.name}
                  />
                );
              })}
            </Layers>
          </Panel>
          <Panel name="Preview Settings">
            <Attribute name="Background">
              <ColorInput value={background} onChange={this.onChangeBackground} />
            </Attribute>
            <Attribute name="Foreground">
              <ColorInput value={this.state.foreground} onChange={this.onChangeForeground} />
            </Attribute>
            <Attribute name="Font Family">
              <select value={this.state.fontFamily} onChange={this.onChangeFontFamily}>
                <option>Lato</option>
                <option>Arial</option>
                <option>Times</option>
                <option>Georgia</option>
                <option>Arial Black</option>
                <option>Impact</option>
                <option>Courier New</option>
                <option>Comic Sans MS</option>
              </select>
            </Attribute>
            <Attribute name="Font Size">
              <SliderInput value={this.state.fontSize} onChange={this.onChangeFontSize} name="fontSize" min={10} max={100} step={1} />
              <NumberInput min={1} step={1} value={this.state.fontSize} name="fontSize" onChange={this.onChangeFontSize} />
            </Attribute>
          </Panel>
        </SideArea>
      </EditorBase>
    );
  }
}
