import React, { Component } from "react";
import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import HomePage from "./HomePage";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // return (<h1>{this.props.name}</h1>); // need cury brace if you put javascript code into a html tag
    return (
      <div className="center">
        <HomePage />
      </div>
    );
  };
};
// createRoot https://stackoverflow.com/questions/71668256/deprecation-notice-reactdom-render-is-no-longer-supported-in-react-18
const appDiv = ReactDOM.createRoot(document.getElementById("app")); // strict mode https://www.bing.com/search?pglt=41&q=%3C%2FReact.StrictMode%3E+%E3%81%A8%E3%81%AF&cvid=bb581dfc230340f5a2a4279df417f961&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBAAGEDSAQgyNjMxajBqMagCALACAA&FORM=ANNTA1&PC=NMTS
appDiv.render(
  <React.StrictMode> 
      <App />
  </React.StrictMode>
);