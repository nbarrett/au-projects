import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, Container, Grid, Link, TextField, Typography, } from "@mui/material";
import { log } from "../../util/logging-config";
import { useEffect, useState } from "react";
import { useLogout } from "../../hooks/use-logout";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import { useLoginWithEmail } from "../../hooks/use-login";
import { toAppRoute } from "../../mappings/route-mappings";
import { AppRoute } from "../../models/route-models";
import { UseLoginWithEmailProps } from "../../models/authentication-models";
import useNotificationMessages from "../../hooks/use-notification-messages";
import { useRecoilState } from "recoil";
import { loginSubmittedCountState, showVerifyEmailState } from "../../atoms/snackbar-atoms";

export default function Login() {
    const {loading, debugUser, debugCurrentUser} = useFirebaseUser();
    const loginWithEmail = useLoginWithEmail();
    const logout = useLogout();
    const [showVerifyEmail, setShowVerifyEmail] = useRecoilState<boolean>(showVerifyEmailState);
    const [submittedCount, setSubmittedCount] = useRecoilState<number>(loginSubmittedCountState);
    const [loginWithEmailProps, setLoginWithEmailProps] = useState<UseLoginWithEmailProps>({});
    const notificationMessages = useNotificationMessages();

    async function resendVerification() {
        loginWithEmail(loginWithEmailProps).then(async response => {
            const user = response.user;
            log.debug("Login:resendVerification user:", debugCurrentUser(), "loading:", loading);
            if (user) {
                await user.sendEmailVerification();
                notificationMessages.showVerificationSent(user, async () => {
                    await logout("resendVerification");
                    setLoginWithEmailProps({});
                    setShowVerifyEmail(false);
                });
            } else {
                notificationMessages.showCantSendVerificationEmail(() => logout("showCantSendVerificationEmail"));
            }
        });
    }

    useEffect(() => {
        logout("Login");
    }, []);

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
                        const loginData = {
                            email: values.email,
                            password: values.password,
                            rememberMe: values.rememberMe,
                        };
                        log.debug("Login:loginData", loginData);
                        setSubmittedCount(submittedCount + 1);
                        setLoginWithEmailProps(loginData);
                        loginWithEmail(loginData).then(response => {
                            log.debug("Login:loginWithEmail:loginData", loginData, "user:", debugUser(response.user), "loading:", loading, "response:", response);
                            if (!loading) {
                                actions.setSubmitting(false);
                            }
                            if (response.user?.uid) {
                                if (!response.user?.emailVerified) {
                                    notificationMessages.showVerificationNotification(response.user, () => setShowVerifyEmail(true));
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
                                        Don&apos;t have an account? <Link component={RouterLink}
                                                                          to={toAppRoute(AppRoute.REGISTER)}
                                                                          variant="h6">Register</Link>
                                    </Typography>
                                </form>
                            );
                        }}
                    </Formik>
                </Container>
            </Box>
        </>);
}
