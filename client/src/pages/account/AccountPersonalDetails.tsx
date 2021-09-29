import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, } from "@material-ui/core";
import { useEffect } from "react";
import { log } from "../../util/logging-config";
import useCurrentUser from "../../hooks/use-current-user";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import { useLogout } from "../../hooks/use-logout";
import useSnackbar from "../../hooks/use-snackbar";

export default function AccountPersonalDetails(props: any) {
    const snackbar = useSnackbar();
    const currentUser = useCurrentUser();
    const firebaseUser = useFirebaseUser();
    const logout = useLogout();

    useEffect(() => {
        log.debug("useEffect:currentUser.document:", currentUser.document);
    }, [currentUser.document]);

    function userDataChange(event?: any) {
        currentUser.changeField(event.target.name, event.target.value);
    }

    function userChange(event?: any) {
        firebaseUser.changeField(event.target.name, event.target.value);
    }

    function handleLogoutIfRequired(logoutAfterChange: boolean) {
        if (logoutAfterChange) {
            return logout("AccountPersonalDetails:logoutAfterChange");
        } else {
            return Promise.resolve();
        }
    }

    return (
        <form autoComplete="off" noValidate {...props}>
            <Card>
                <CardHeader subheader="You can change your details here" title="Profile"/>
                <Divider/>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                helperText="Please specify a first name"
                                label="First name"
                                name="data.firstName"
                                onChange={userDataChange}
                                value={currentUser.document?.data?.firstName || ""}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField {...props}
                                       inputProps={{
                                           ...props.inputProps,
                                           autoComplete: "new-password",
                                       }}
                                       fullWidth
                                       helperText="Please specify a last name"
                                       label="Last name"
                                       name="data.lastName"
                                       onChange={userDataChange}
                                       required
                                       value={currentUser.document?.data?.lastName || ""}
                                       variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField {...props}
                                       inputProps={{
                                           ...props.inputProps,
                                           autoComplete: "new-password",
                                       }}
                                       fullWidth
                                       label="Phone Number"
                                       name="data.phone"
                                       onChange={userDataChange}
                                       value={currentUser.document?.data?.phone || ""}
                                       variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField {...props}
                                       inputProps={{
                                           ...props.inputProps,
                                           autoComplete: "new-password",
                                       }}
                                       fullWidth
                                       label="Email Address"
                                       name="email"
                                       onChange={userChange}
                                       required
                                       value={firebaseUser.document?.email || ""}
                                       variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider/>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                }}>
                    <Button color="primary" variant="contained" onClick={() => {
                        log.debug("saving firebase user:", firebaseUser.document, " and user document:", currentUser.document?.data);
                        const logoutAfterChange = firebaseUser.logoutAfterChange();
                        Promise.all([firebaseUser.saveUser(), currentUser.saveUser("Personal details")])
                            .then((responses: any[]) => {
                                return handleLogoutIfRequired(logoutAfterChange)
                                    .then(() => snackbar.success(responses.filter(item => item).join(".\n\n")));
                            }).catch((error => snackbar.error(error.toString())));
                    }}>
                        Save details
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

