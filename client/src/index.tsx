import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppContainer from "./pages/global/AppContainer";

import firebase from "firebase";
import { FIREBASE_CONFIG } from "./constants";
import { log } from "./util/logging-config";

firebase.initializeApp(FIREBASE_CONFIG).auth()
    .onAuthStateChanged((user) => log.debug("onAuthStateChanged:user:", user?.email));


ReactDOM.render(<AppContainer/>, document.getElementById("root"));
