import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarNotificationProvider } from "./snackbarNotification";
import { createTheme } from "./theme";
import { BrowserRouter, useRoutes } from "react-router-dom";
import {
  APP_LANDING,
  AUTH_ACTION_PATH,
  FIREBASE_CONFIG,
  SIGNIN_ROUTE,
  SIGNUP_ROUTE,
} from "./constants";
import SigninSignupPage from "./auth/SigninSignupPage";
import { SessionProvider, useSession } from "./auth/useSession";
import firebase from "firebase";
import AuthAction from "./auth/authActions/AuthAction";
import React from "react";
import ProtectedRoute from "./admin/ProtectedRoute";

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
const db = firebaseApp.firestore();

export default function App(): JSX.Element {
  const { user, loading } = useSession();
  console.log("App:user:pathname", "user:", user, "loading:", loading);

  firebase
    .auth()
    .onAuthStateChanged((user) =>
      console.info("onAuthStateChanged:user:", user)
    );

  console.log("App:user:", user, "loading:", loading);
  const routes = [
    {
      path: SIGNIN_ROUTE,
      element: <SigninSignupPage variant="signin" />,
    },
    {
      path: SIGNUP_ROUTE,
      element: <SigninSignupPage variant="signup" />,
    },
    {
      path: AUTH_ACTION_PATH,
      element: <AuthAction />,
    },
    {
      path: APP_LANDING,
      element: <ProtectedRoute />,
    },
  ];

  const AppRoutes = () => {
    return useRoutes(routes);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={createTheme("dark")}>
        <CssBaseline />
        <SnackbarNotificationProvider>
          <SessionProvider>
            <AppRoutes />
          </SessionProvider>
        </SnackbarNotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
