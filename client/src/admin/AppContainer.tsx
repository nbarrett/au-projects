import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import "./mixins/chartjs";
import theme from "./theme";
import routes from "./routes";
import GlobalStyles from "./components/GlobalStyles";
import { useSession } from "../auth/useSession";

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
