import { makeStyles } from "@material-ui/core";
import { Theme } from "../../theme/theme";

export default function Logo() {
  const useStyles = makeStyles((theme: Theme) => ({
    loading: {
      height: 40,
      padding: 0,
      marginTop: 5,
      marginLeft: 0,
    },
  }));
  const classes = useStyles({});

  return (
    <img
      alt="Logo"
      src="/static/images/logo/au-projects-logo-only.png"
      className={classes.loading}
    />
  );
}
