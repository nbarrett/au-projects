import { createTheme } from "@mui/material/styles";
import shadows from "./shadows";
import typography from "./typography";
import { ADMIN_BACKGROUND } from "./theme";
import { colors } from "@mui/material";

export const theme = createTheme({
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
