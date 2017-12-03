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
import { parseBoxShadowString, getBoxShadowString } from "../../../util/conversion";

const update = require("react/lib/update");

const styles = require("./index.css");

interface IProps {
}

interface IState {
  layers?: IShadowEffect[];
  selectedLayerName?: string;
  generatePrefixes?: boolean;
  background?: IRgbaColor;
  foreground?: IRgbaColor;
  borderRadius?: number;
  size?: number;
}

export default class BoxShadowEditor extends React.Component<IProps, IState> {

  state: IState = {
    layers: [],
    generatePrefixes: false,
    background: { r: 255, g: 255, b: 255, a: 1 },
    foreground: { r: 221, g: 221, b: 221, a: 1 },
    borderRadius: 0,
    size: 150
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

  private onSerialize = (layers: IShadowEffect[]) => {
    const value = layers.filter((effect) => effect.visible).map(getBoxShadowString).join(", ");

    let str = "";

    if (this.state.generatePrefixes) {
      str += `-webkit-box-shadow: ${value};\n`;
      str += `-moz-box-shadow: ${value};\n`;
    }

    str += `box-shadow: ${value};\n`;

    return str;
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

  private onToggleGeneratePrefixes = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ generatePrefixes: e.currentTarget.checked });
  };

  private onChangeBackground = (res: ReactColor.ColorResult) => {
    this.setState({ background: res.rgb as any });
  };

  private onChangeForeground = (res: ReactColor.ColorResult) => {
    this.setState({ foreground: res.rgb as any });
  };

  private onChangeBorderRadius = (res: number) => {
    this.setState({ borderRadius: res });
  };

  private onChangeSize = (res: number) => {
    this.setState({ size: res });
  };

  private onAddLayer = () => {
    ++this.currentId;

    const effect: IShadowEffect = {
      inset: false,
      xOffset: 0,
      yOffset: 0,
      spread: 0,
      blur: 10,
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
        <Attribute name="Spread">
          <SliderInput value={effect.spread} onChange={this.onChangeValue} name="spread" min={0} max={100} step={1} />
          <NumberInput step={1} value={effect.spread} name="spread" onChange={this.onChangeValue} />
        </Attribute>
        <Attribute name="Offset X">
          <SliderInput value={effect.xOffset} onChange={this.onChangeValue} name="xOffset" min={-50} max={50} step={1} />
          <NumberInput min={0} step={1} value={effect.xOffset} name="xOffset" onChange={this.onChangeValue} />
        </Attribute>
        <Attribute name="Offset Y">
          <SliderInput value={effect.yOffset} onChange={this.onChangeValue} name="yOffset" min={-50} max={50} step={1} />
          <NumberInput step={1} value={effect.yOffset} name="yOffset" onChange={this.onChangeValue} />
        </Attribute>
        <Attribute name="Inset">
          <input type="checkbox" checked={effect.inset} onChange={this.onChangeInset} />
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

  private renderPrefixOption() {
    return (
      <span className={styles.prefixOption}>
        <input type="checkbox" checked={this.state.generatePrefixes} onChange={this.onToggleGeneratePrefixes} /> Generate Prefixes
      </span>
    );
  }

  render() {
    const { background } = this.state;

    return (
      <EditorBase
        onImport={this.onImport}
        onCopyToClipboard={this.onCopyToClipboard}
        onRestore={(data) => this.setState(data)}
        onAutoSave={() => this.state}
        name="CSS box-shadow Editor"
        id="boxshadow"
      >
        <SideArea>
          {this.renderControls()}
        </SideArea>
        <CenterArea>
          <PreviewArea style={{ backgroundColor: `rgba(${background.r}, ${background.g}, ${background.b}, 1)` }}>
            <Preview
              boxShadowEffects={this.state.layers}
              foreground={this.state.foreground}
              size={this.state.size}
              borderRadius={this.state.borderRadius}
            />
          </PreviewArea>
          <BottomArea>
            <Panel name="Code" showBottomBorder={false} headerElement={this.renderPrefixOption()}>
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
            <Attribute name="Round Corner">
              <SliderInput value={this.state.borderRadius} onChange={this.onChangeBorderRadius} name="blur" min={0} max={100} step={1} />
              <NumberInput min={0} step={1} value={this.state.borderRadius} name="blur" onChange={this.onChangeBorderRadius} />
            </Attribute>
            <Attribute name="Size">
              <SliderInput value={this.state.size} onChange={this.onChangeSize} name="blur" min={0} max={500} step={1} />
              <NumberInput min={0} step={1} value={this.state.size} name="blur" onChange={this.onChangeSize} />
            </Attribute>
          </Panel>
        </SideArea>
      </EditorBase>
    );
  }
}
