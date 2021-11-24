import { Workbox } from "workbox-window";
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app/App";

if (process.env.API_USE_MOCK) {
  const { worker } = require("./mocks/browser");
  worker.start();
}

if ("serviceWorker" in navigator) {
  const wb = new Workbox("/service-worker.js");
  wb.register();
}

const $app = document.getElementById("app");
ReactDOM.render(<App />, $app);
