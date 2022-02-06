import { Workbox } from "workbox-window";
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app/App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

declare global {
  interface Window {
    /**
     * The Workbox Window instance
     */
    wb?: Workbox;

    /**
     * Whether the Workbox Service Worker is waiting
     */
    swIsWaiting: boolean;
  }
}

if (process.env.API_USE_MOCK) {
  const { worker } = require("./mocks/browser");
  worker.start();
}

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  const wb = new Workbox("/service-worker.js");

  window.wb = wb;

  window.swIsWaiting = false;
  wb.addEventListener("waiting", () => {
    window.swIsWaiting = true;
  });

  wb.register();
}

const $app = document.getElementById("app");
ReactDOM.render(<App />, $app);
