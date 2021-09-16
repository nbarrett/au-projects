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
import { toAppRoute } from "../../mappings/route-mappings";
import { AppRoute } from "../../models/route-models";
import useUserRoles from "../../hooks/use-user-roles";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import { PRIMARY_LIGHT } from "../../theme/theme";
import isEmpty from "lodash/isEmpty";

export function ContactUs() {
    const classes = makeStyles((theme: Theme) => ({
        root: {
            color: "white",
            fontWeight: "bold"
        },
    }))({});
    return <Link color={PRIMARY_LIGHT} className={classes.root}
                 href={"mailto:support@auind.co.za?subject=System Access"}>Contact us</Link>;
}

export default function Login() {
    const {user, loading, debugUser, debugCurrentUser} = useFirebaseUser();
    const notification = useSnackbarNotification();
    const signInWithEmail = useSignInWithEmail();
    const logout = useLogout();
    const userRoles = useUserRoles();
    const navigate = useNavigate();
    const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);
    const [submittedCount, setSubmittedCount] = useState<number>(0);

    useEffect(() => {
        if (!loading && user?.uid) {
            const currentUserRoles = userRoles.forCurrentUser();
            log.info("Login:useEffect for user:", debugCurrentUser(), "loading:", loading, "currentUserRoles:", currentUserRoles, "submittedCount:", submittedCount);
            if (!user?.emailVerified) {
                showVerificationNotification(user);
            } else if (!isEmpty(currentUserRoles.data)) {
                if (!currentUserRoles.data.systemAccess) {
                    showNoSystemAccessNotification(user);
                    logout("showNoSystemAccessNotification");
                } else {
                    log.info("navigate off login screen");
                    navigate(toAppRoute(AppRoute.HOME));
                }
            }
        } else {
            log.info("Login:useEffect no action for user:", debugCurrentUser(), "loading:", loading);
        }
    }, [user, loading, submittedCount]);

    function showVerificationNotification(user) {
        setShowVerifyEmail(true);
        const message = `${user?.email} has not yet been verified so please respond to an email in your inbox`;
        log.info("showing message:", message);
        notification.warning(<>{message}. <ContactUs/></>);
    }

    function showNoSystemAccessNotification(user) {
        setShowVerifyEmail(false);
        const message = `${user?.email} has not yet been granted system access. You will receive an email when this is complete`;
        log.info("showing message:", message);
        notification.warning(<>{message}. <ContactUs/></>);
    }

    function resendVerification() {
        log.info("Login:resendVerification user:", debugCurrentUser(), "loading:", loading);
        if (user) {
            user.sendEmailVerification();
            logout("resendVerification");
            const message = `Verification email has been sent to ${user.email} so please respond to an email in your inbox, then try logging in again`;
            log.info("showing message:", message);
            notification.warning(message);
        } else {
            notification.error("cant resend verification email. Refresh your browser and try again");
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
                        const signInData = {
                            email: values.email,
                            password: values.password,
                            rememberMe: values.rememberMe,
                        };
                        log.info("Login:signInData", signInData);
                        setSubmittedCount(submittedCount + 1);
                        signInWithEmail(signInData).then(response => {
                            log.info("Login:signInWithEmail:signInData", signInData, "user:", debugUser(response.user), "loading:", loading, "response:", response);
                            if (!loading) {
                                actions.setSubmitting(false);
                            }
                            if (response.user?.uid) {
                                if (!response.user?.emailVerified) {
                                    showVerificationNotification(response.user);
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
                                    <TextField InputLabelProps={{shrink: true}}
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
                                    <TextField InputLabelProps={{shrink: true}}
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
        </>);
}
