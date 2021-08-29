import { BrowserRouter, useRoutes } from "react-router-dom";
import "./mixins/chartjs";
import appRoutes from "./routes";
import GlobalStyles from "./components/GlobalStyles";
import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { SnackbarNotificationProvider } from "../snackbarNotification";
import { RecoilRoot } from "recoil";
import { theme } from "../theme";
import { useFirebaseUser } from "../hooks/use-firebase-user";
import LoadingDiv from "../components/LoadingDiv";
import useUserRoles from "../hooks/use-user-roles";
import { WithUid } from "../models/common-models";
import { UserRoles } from "../models/user-models";

export default function AppContainer(): JSX.Element {

  function AppRoutes() {
    const {user, loading} = useFirebaseUser();
    const userRoles = useUserRoles();
    const userRolesForId: WithUid<UserRoles> = userRoles.forCurrentUser();
    return useRoutes(appRoutes(user, loading, userRolesForId));
  }

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
