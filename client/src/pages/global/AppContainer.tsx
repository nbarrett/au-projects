import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "../../admin/components/GlobalStyles";
import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarNotificationProvider } from "../../snackbarNotification";
import { RecoilRoot } from "recoil";
import { theme } from "../../theme";
import LoadingDiv from "../../components/LoadingDiv";
import AppRoutes from "./AppRoutes";

export default function AppContainer(): JSX.Element {

  return (
      <RecoilRoot>
        <BrowserRouter>
            <React.Suspense fallback={<LoadingDiv/>}>
              <SnackbarNotificationProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline/>
                  <GlobalStyles/>
                  <AppRoutes/>
                </ThemeProvider>
              </SnackbarNotificationProvider>
            </React.Suspense>
        </BrowserRouter>
      </RecoilRoot>
  );
}
