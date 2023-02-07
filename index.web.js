import 'array-flat-polyfill';
import React from 'react'
import { createRoot } from 'react-dom/client';
import App from "./App";

const container = document.getElementById('react-root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App/>);

/*
import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  rootTag: document.getElementById("react-root")
});
*/