import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./mixins/chartjs";
import appRoutes from "./routes";
import GlobalStyles from "./components/GlobalStyles";
import { SessionProvider, useSession } from "../auth/useSession";
import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarNotificationProvider } from "../snackbarNotification";
import { RecoilRoot } from "recoil";
import { theme } from "../theme";

export default function AppContainer(): JSX.Element {

  function AppRoutes() {
    const { user } = useSession();
    return useRoutes(appRoutes(user?.emailVerified));
  }

  return (
    <RecoilRoot>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <SnackbarNotificationProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline/>
              <SessionProvider>
                <GlobalStyles/>
                <AppRoutes/>
              </SessionProvider>
            </ThemeProvider>
          </SnackbarNotificationProvider>
        </React.Suspense>
      </BrowserRouter>
    </RecoilRoot>
  );
}
