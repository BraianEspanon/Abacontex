/*
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'

import keycloak from "./keycloak";
import { config } from "./config";

if (config.ENVIRONMENT === "development") {
  window.keycloak = keycloak;
}

keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
  })
  .then((authenticated) => {
    console.log("Authenticated:", authenticated);

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Keycloak init failed", error);
  });