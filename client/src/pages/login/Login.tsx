import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, Container, Grid, Link, TextField, Typography, } from "@material-ui/core";
import { log } from "../../util/logging-config";
import { useSnackbarNotification } from "../../snackbarNotification";
import { useEffect, useState } from "react";
import { useLogout } from "../../auth/logout";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import { useSignInWithEmail } from "../../auth/signInProviders";
import { AppRoute } from "../../constants";
import { toAppRoute } from "../../admin/routes";

export default function Login() {
    const {user, loading} = useFirebaseUser();
    const notification = useSnackbarNotification();
    const signInWithEmail = useSignInWithEmail();
    const logout = useLogout();
    const navigate = useNavigate();
    const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    function showVerificationNotification(user) {
        setShowVerifyEmail(true);
        const message = `${user.email} has not yet been verified so please respond to an email in your inbox`;
        log.debug("showing message:", message);
        notification.warning(message);
    }

    useEffect(() => {
        log.debug("Login:useEffect user.uid:", user?.uid, "emailVerified", user?.emailVerified, "loading:", loading, "submitted:", submitted);
        if (!submitted && user?.uid && !user?.emailVerified) {
            logout();
        } else if (submitted && !loading && user?.uid && !user?.emailVerified) {
            showVerificationNotification(user);
        } else {
            log.debug("Login:useEffect no action: user.uid:", user?.uid, "emailVerified", user?.emailVerified, "loading:", loading, "submitted:", submitted);
        }
    }, [user, loading]);

    function resendVerification() {
        log.debug("Login:resendVerification user.uid:", user?.uid, "emailVerified", user?.emailVerified, "loading:", loading);
        if (user) {
            setSubmitted(true);
            user.sendEmailVerification();
            logout();
        }
    }

    return (
        <>
            <Helmet>
                <title>Login | AU Projects</title>
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
                    <Formik initialValues={{
                        email: "",
                        password: "",
                        rememberMe: true,
                    }} validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email("Must be a valid email")
                            .max(255)
                            .required("Email is required"),
                        password: Yup.string().max(255).required("Password is required"),
                    })} onSubmit={(values, actions) => {
                        setSubmitted(true);
                        const signInData = {
                            email: values.email,
                            password: values.password,
                            rememberMe: values.rememberMe,
                        };
                        log.debug("Login:signInData", signInData);
                        signInWithEmail(signInData).then(response => {
                            log.debug("Login:useEffect user.uid:", user?.uid, "emailVerified", user?.emailVerified, "loading:", loading, "response:", response);
                            if (!loading) {
                                actions.setSubmitting(false);
                            }
                            if (response.user?.uid) {
                                if (!response.user?.emailVerified) {
                                    showVerificationNotification(response.user);
                                } else {
                                    log.debug("navigate off login screen");
                                    navigate(toAppRoute(AppRoute.HOME));
                                }

                            }
                        }).catch(error => {
                            actions.setSubmitting(false);
                            log.error("Login:error:", error);
                        });
                    }}>
                        {({
                              errors,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              isSubmitting,
                              touched,
                              values,
                          }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <Box sx={{mb: 3}}>
                                        <Typography color="textPrimary" variant="h2">
                                            AU Projects
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            gutterBottom
                                            variant="body2"
                                        >
                                            Sign in to the portal
                                        </Typography>
                                    </Box>
                                    <TextField InputLabelProps={{ shrink: true }}
                                        error={Boolean(touched.email && errors.email)}
                                        fullWidth
                                        helperText={touched.email && errors.email}
                                        label="Email Address"
                                        margin="normal"
                                        size={"small"}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="email"
                                        value={values.email}
                                        variant="outlined"
                                    />
                                    <TextField InputLabelProps={{ shrink: true }}
                                        error={Boolean(touched.password && errors.password)}
                                        fullWidth
                                        size={"small"}
                                        helperText={touched.password && errors.password}
                                        label="Password"
                                        margin="normal"
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.password}
                                        variant="outlined"
                                    />
                                    <Box sx={{py: 2}}>
                                        <Grid container spacing={3}>
                                            {showVerifyEmail ? <><Grid item lg={6} md={6} xs={12}>
                                                <Button
                                                    color="primary"
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                >
                                                    Sign in now
                                                </Button>
                                            </Grid>
                                                <Grid item lg={6} md={6} xs={12}>
                                                    <Button
                                                        color="primary"
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                        size="large"
                                                        onClick={resendVerification}
                                                        variant="contained">
                                                        Resend Verification
                                                    </Button>
                                                </Grid></> : <Grid item lg={12} md={12} xs={12}>
                                                <Button
                                                    color="primary"
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                >
                                                    Sign in now
                                                </Button>
                                            </Grid>}
                                        </Grid>
                                    </Box>
                                    <Typography color="textSecondary" variant="body1">
                                        Don&apos;t have an account?{" "}
                                        <Link component={RouterLink} to="/register" variant="h6">
                                            Sign up
                                        </Link>
                                    </Typography>
                                </form>
                            );
                        }}
                    </Formik>
                </Container>
            </Box>
        </>
    );
}
