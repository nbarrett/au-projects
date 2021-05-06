import { colors, createMuiTheme } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";
import { ADMIN_BACKGROUND } from "./theme";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#F4F6F8",
      paper: colors.common.white,
    },
    primary: {
      contrastText: colors.common.white,
      main: ADMIN_BACKGROUND,
    },
    text: {
      primary: "#172b4d",
      secondary: "#6b778c",
    },
  },
  shadows,
  typography,
});

export default theme;
