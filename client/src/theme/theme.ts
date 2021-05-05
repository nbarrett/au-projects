import createMuiTheme, {
  Theme as T_Theme,
} from "@material-ui/core/styles/createMuiTheme";
import { colors, PaletteMode } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

const PRIMARY_LIGHT = "#E5F9FF";
const PRIMARY_MAIN = "#33C1EA";
const PRIMARY_DARK = "#197FC3";

const SECONDARY_LIGHT = "#35709E";
const SECONDARY_MAIN = "#245987";
const SECONDARY_DARK = "#2F4E8D";

export const PRIMARY_GRADIENT = `linear-gradient( 135deg, ${PRIMARY_MAIN} 0%, ${PRIMARY_DARK} 50%, ${SECONDARY_LIGHT} 100%)`;
export const SECONDARY_GRADIENT = `linear-gradient( 135deg, ${SECONDARY_LIGHT} 0%, ${SECONDARY_MAIN} 50%, ${SECONDARY_DARK} 100%)`;

export const createTheme = (type: PaletteMode): Theme =>
  createMuiTheme({
    palette: {
      primary: {
        light: PRIMARY_LIGHT,
        main: PRIMARY_MAIN,
        dark: PRIMARY_DARK,
        contrastText: colors.common.white,
      },
      secondary: {
        light: SECONDARY_LIGHT,
        main: SECONDARY_MAIN,
        dark: SECONDARY_DARK,
        contrastText: colors.common.white,
      },
    },
    shadows,
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          elevation1: {
            boxShadow: "none",
          },
          elevation2: {
            boxShadow: "none",
          },
          rounded: {
            borderRadius: 8,
          },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            background: "none",
            border: "none",
            padding: 0,
          },
        },
      },
    },
  });

export type Theme = T_Theme;
