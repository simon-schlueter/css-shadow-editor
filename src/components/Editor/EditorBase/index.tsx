import * as React from "react";
import { Link } from "react-router";
import Icon from "../../Common/Icon";
import BottomArea from "./Areas/BottomArea";
import PreviewArea from "./Areas/PreviewArea";
import SideArea from "./Areas/SideArea";
import CenterArea from "./Areas/CenterArea";
import ToolSelector from "./ToolSelector";

const styles = require("./index.css");

interface IProps {
  onImport: () => void;
  onCopyToClipboard: () => void;
  onRestore: (data?: any) => void;
  onAutoSave: () => any;
  id: string;
  name: string;
}

export default class EditorBase extends React.Component<IProps, void> {

  componentWillMount() {
    const sessionData = sessionStorage.getItem(`csseditors.${this.props.id}.data`);

    if (sessionData != null) {
      this.props.onRestore(JSON.parse(sessionData));
    }

    window.addEventListener("beforeunload", this.onBeforeUnload);
  }

  componentWillUnmount() {
    this.saveToSessionStorage();

    window.removeEventListener("beforeunload", this.onBeforeUnload);
  }

  private onBeforeUnload = () => {
    this.saveToSessionStorage();
  };

  private saveToSessionStorage() {
    sessionStorage.setItem(`csseditors.${this.props.id}.data`, JSON.stringify(this.props.onAutoSave()));
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <ToolSelector activeTool={this.props.name} />
          </div>
          <div className={styles.toolbar}>
            <button className={styles.toolButton} title="Copy CSS to clipboard" onClick={this.props.onCopyToClipboard}>
              <Icon icon="clipboard" />
            </button>
            <button className={styles.toolButton} title="Import effect" onClick={this.props.onImport}>
              <Icon icon="upload" />
            </button>
            <div className={styles.author}>
              <a href="https://github.com/CdePanda/css-shadow-editor" target="_blank" rel="noopener">GitHub <Icon icon="external-link" className={styles.githubIcon} /></a>
            </div>
          </div>
        </div>
        <div className={styles.columns}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export { BottomArea, PreviewArea, SideArea, CenterArea };
