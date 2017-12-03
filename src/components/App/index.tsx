import * as React from "react";
import { Router, Route, Redirect, Link, browserHistory } from "react-router";
import BoxShadowEditor from "../Editors/BoxShadowEditor";
import TextShadowEditor from "../Editors/TextShadowEditor";

export default class App extends React.Component<void, void> {

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="boxshadow-editor" component={BoxShadowEditor} />
        <Route path="textshadow-editor" component={TextShadowEditor} />
        <Redirect from="*" to="boxshadow-editor" />
      </Router>
    );
  }
}
