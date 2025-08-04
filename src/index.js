// index.js
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import pageReducer from "./features/page";
import userReducer from "./features/user";
import reportWebVitals from "./reportWebVitals";
import { getAccessToken, setupAxiosInterceptors } from "./services/auth_utils";
import "./style/style.css";

const token = getAccessToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
setupAxiosInterceptors();

const store = configureStore({
  reducer: {
    page: pageReducer,
    user: userReducer,
  },
});

// Force default hash route to #/login if empty or only "#/"
if (!window.location.hash || window.location.hash === "#/" || window.location.hash === "") {
  window.location.replace(window.location.origin + window.location.pathname + "#/login");
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
