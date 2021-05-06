import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./mixins/chartjs";
import appRoutes from "./routes";
import GlobalStyles from "./components/GlobalStyles";
import { SessionProvider, useSession } from "../auth/useSession";
import React from "react";
import theme from "../theme";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarNotificationProvider } from "../snackbarNotification";
import firebase from "firebase";
import { log } from "../util/logging-config";
import { FIREBASE_CONFIG } from "../constants";

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
const db = firebaseApp.firestore();

export default function AppContainer(): JSX.Element {
  firebase
    .auth()
    .onAuthStateChanged((user) => log.info("onAuthStateChanged:user:", user));

  function AppRoutes() {
    const { user } = useSession();
    return useRoutes(appRoutes(user?.emailVerified));
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarNotificationProvider>
          <SessionProvider>
            <GlobalStyles />
            <AppRoutes />
          </SessionProvider>
        </SnackbarNotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
