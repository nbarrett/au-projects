import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import "./mixins/chartjs";
import routes from "./routes";
import GlobalStyles from "./components/GlobalStyles";
import { useSession } from "../auth/useSession";
import React from "react";
import theme from "../theme";
import { ThemeProvider } from "@material-ui/core";

export default function AppContainer() {
  const routing = useRoutes(routes);
  const { user, loading } = useSession();
  console.log("AppContainer:user:", user, "loading:", loading);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
}
