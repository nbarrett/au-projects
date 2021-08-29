import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useBooleanState } from "react-use-object-state";
import { useSnackbarNotification } from "../../snackbarNotification";
import { Theme } from "@material-ui/core/styles";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme: Theme) => ({
  loading: {
    marginRight: theme.spacing(2),
    height: theme.spacing(3),
    width: theme.spacing(3),
    color: "white",
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  emailSentMessage: {
    marginBottom: theme.spacing(4),
  },
  email: {
    color: theme.palette.text.primary,
  },
}));

export default function EmailVerification() {
  const classes = useStyles({});
  const notification = useSnackbarNotification();
  const {user} = useFirebaseUser();

  const loading = useBooleanState(false);

  async function submitEmailVerification() {
    loading.setTrue();
    try {
      await user?.sendEmailVerification();
    } catch (error) {
      notification.error(error.message);
    } finally {
      loading.setFalse();
    }
  }

  return (
    <>
      <Helmet>
        <title>Verify email | AU Projects</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <form>
            <Box sx={{ mb: 3 }}>
              <Typography color="textPrimary" variant="h2">
                Email verification
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                We sent an email verification to{" "}
                <b className={classes.email}>{user?.email}</b>.
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                <b>Not seeing an email?</b>
                <br />
                Try waiting at least a minute. Try refreshing your inbox and
                checking your spam folder. Make sure your email displayed above
                is correct.
              </Typography>
              <Button
                disabled={!user}
                color="primary"
                onClick={submitEmailVerification}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {loading.state ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className={classes.loading}
                    />
                    Resending...
                  </>
                ) : (
                  "Resend verification"
                )}
              </Button>
              <Button
                disabled={!user}
                color="primary"
                onClick={submitEmailVerification}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {loading.state ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className={classes.loading}
                    />
                    Resending...
                  </>
                ) : (
                  "Resend verification"
                )}
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
}
