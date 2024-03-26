import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { store } from "./reducers/store";
import { Provider } from "react-redux";
import Router from "./Router";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </Provider>,
    document.getElementById("root")
);
