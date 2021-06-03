import {
  Container,
  ContainerProps,
  Paper,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import { ReactNode } from "react";
import { PRIMARY_GRADIENT  } from "../theme/theme";
import { Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100vw",
      height: "100vh",
      backgroundImage: PRIMARY_GRADIENT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      width: "100%",
      [theme.breakpoints.down("xs")]: {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      },
      overflowY: "auto",
      padding: 0,
      opacity: 0.9,
    },
  })
);

type AuthContainerProps = {
  children: ReactNode;
  maxWidth?: ContainerProps["maxWidth"];
};

export default function AuthContainer({
  children,
  maxWidth = "lg",
}: AuthContainerProps) {
  const classes = useStyles();

  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  return (
    <div className={classes.root}>
      <Container maxWidth={maxWidth} disableGutters={isXs}>
        <Paper elevation={0} className={classes.paper}>
          {children}
        </Paper>
      </Container>
    </div>
  );
}
