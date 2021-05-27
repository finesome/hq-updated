// modules
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import $ from "jquery";
// assets
// styles
import "semantic-ui-css/semantic.min.css";
import "./index.css";
// components
import App from "components/App";
// redux
import store from "store/Store";

// jQuery
window.$ = window.jQuery = $;

// render top component
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
