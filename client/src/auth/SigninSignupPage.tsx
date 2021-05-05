import {
  createStyles,
  Grid,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_DASHBOARD, APP_LANDING, RESET_PASSWORD_PATH } from "../constants";
import { SECONDARY_GRADIENT, Theme } from "../theme/theme";
import AuthContainer from "./AuthContainer";
import { ReactComponent as ForgotPasswordImg } from "./forgot_password.svg";
import { ReactComponent as LoginImg } from "./login_dashboard.svg";
import { ReactComponent as Logo } from "./logo.svg";
import { ReactComponent as NewAccountImg } from "./new_account.svg";
import ResetPassword from "./ResetPassword";
import SigninSignupForm from "./SigninSignupForm";
import { useSession } from "./useSession";
import { useEffect } from "react";
import { log } from "../util/logging-config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imgContainer: {
      background: SECONDARY_GRADIENT,
      opacity: 0.9,
      display: "flex",
      alignItems: "center",
    },
    contentContainer: {
      padding: theme.spacing(5),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    logo: {
      height: 56,
      width: 56,
      marginBottom: theme.spacing(4),
    },
    img: {
      width: "100%",
      height: "auto",
      maxHeight: "80%",
      marginLeft: theme.spacing(-4),
    },
  })
);

type SigninSignupPageProps = {
  variant: "signup" | "signin";
};

const SigninSignupPage = ({ variant }: SigninSignupPageProps) => {
  const classes = useStyles();
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location?.state as any)?.from?.pathname || APP_LANDING;
  const resetPasswordMatch = location.pathname.includes(RESET_PASSWORD_PATH);
  const { user, loading } = useSession();

  useEffect(() => {
    log.info("useEffect:user:", user?.email);
    if (user?.email && !location.pathname.includes(APP_DASHBOARD)) {
      log.info(
        "useEffect:navigating to",
        APP_DASHBOARD,
        "from",
        location.pathname
      );
      navigate(APP_DASHBOARD, { replace: true });
    }
  });

  let component = null;
  let Img = LoginImg;

  if (location.pathname.includes(RESET_PASSWORD_PATH)) {
    component = <ResetPassword />;
    Img = ForgotPasswordImg;
  } else {
    component = <SigninSignupForm variant={variant} from={from} />;
    Img = variant === "signin" ? LoginImg : NewAccountImg;
  }

  return (
    <AuthContainer>
      <Grid container>
        <Grid item xs={12} md={6} lg={5} className={classes.contentContainer}>
          <Logo className={classes.logo} />
          {component}
        </Grid>
        {!isSm && (
          <Grid item md={6} lg={7} className={classes.imgContainer}>
            <Img className={classes.img} />
          </Grid>
        )}
      </Grid>
    </AuthContainer>
  );
};

export default SigninSignupPage;
