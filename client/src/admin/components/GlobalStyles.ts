import { createStyles, makeStyles } from "@material-ui/styles";

export default function GlobalStyles() {
  const useStyles = makeStyles(() =>
      createStyles({
        "@global": {
          "*": {
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
          },
          html: {
            "-webkit-font-smoothing": "antialiased",
            "-moz-osx-font-smoothing": "grayscale",
            height: "100%",
            width: "100%",
          },
          body: {
            backgroundColor: "#f4f6f8",
            height: "100%",
            width: "100%",
          },
          a: {
            textDecoration: "none",
          },
          "#root": {
            height: "100%",
            width: "100%",
          },
        },
      })
  );
  useStyles();
  return null;
};

export const cardStyle = {p: 1, m: 1};
export const cellStyle = {
  p: 0.1, m: 0, width: 130,
  color: "white",
  backgroundColor: "white",
  // opacity: [0.9, 0.8, 0.7],
  "&:hover": {
    backgroundColor: "white",
  }
};
export const contentContainer = {marginTop: 1, width: window.innerWidth - 280};
