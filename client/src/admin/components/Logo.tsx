import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export default function Logo() {
  const useStyles = makeStyles((theme: Theme) => ({
    loading: {
      height: 30,
      padding: 0,
      marginTop: 5,
      marginLeft: 0,
      marginRight: 10,
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
