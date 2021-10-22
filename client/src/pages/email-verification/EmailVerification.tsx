import { Box, Container } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useBooleanState } from "react-use-object-state";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import { Helmet } from "react-helmet";
import useSnackbar from "../../hooks/use-snackbar";

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
  const snackbar = useSnackbar();
  const {user} = useFirebaseUser();

  const loading = useBooleanState(false);

  async function submitEmailVerification() {
    loading.setTrue();
    try {
      await user?.sendEmailVerification();
    } catch (error) {
      snackbar.error(error.message);
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
