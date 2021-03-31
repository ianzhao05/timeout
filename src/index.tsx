import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "fontsource-open-sans";
import "fontsource-open-sans/700.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
