import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { currentUserDataState, currentUserState } from "../../../atoms/user-atoms";
import { FirebaseUser} from "../../../models/authentication-models";
import { useEffect, useState } from "react";
import { log } from "../../../util/logging-config";
import { useSnackbarNotification } from '../../../snackbarNotification';
import { UserData } from '../../../models/user-models';

export default function AccountProfileDetails(props: any) {
    const notification = useSnackbarNotification();
    const [user, setUser] = useRecoilState<FirebaseUser>(currentUserState);
    const [userEdit, setUserEdit] = useState<FirebaseUser>(user);
    const [userData, setUserData] = useRecoilState<UserData>(currentUserDataState);
    const [userDataEdit, setUserDataEdit] = useState<UserData>(userData);

    useEffect(() => {
        log.info("useEffect:user:", user);
        if (user) {
            setUserEdit(user)
        }
    }, [user])

    useEffect(() => {
        log.info("useEffect:userData:", userData);
        if (userData) {
            setUserDataEdit(userData)
        }
    }, [userData])

    const userDataChange = (event?: any) => {
        const field = event.target.name;
        const value = event.target.value;
        log.info("userDataChange:   field:", field, "value:", value);
        setUserDataEdit({
            ...userDataEdit,
            [field]: value,
        });
    };

    const userChange = (event?: any) => {
        const field = event.target.name;
        const value = event.target.value;
        log.info("userChange:field:", field, "value:", value);
        setUserEdit({
            ...userEdit,
            [field]: value,
        });
    };

    return (
        <form autoComplete="off" noValidate {...props}>
            <Card>
                <CardHeader subheader="The information can be edited" title="Profile"/>
                <Divider/>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                helperText="Please specify the first name"
                                label="First name"
                                name="firstName"
                                onChange={userDataChange}
                                value={userDataEdit?.firstName || ""}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Last name"
                                name="lastName"
                                onChange={userDataChange}
                                required
                                value={userDataEdit?.lastName || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                onChange={userChange}
                                required
                                value={userEdit?.email || ""}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                onChange={userDataChange}
                                type="number"
                                value={userDataEdit?.phone || ""}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider/>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                    }}
                >
                    <Button color="primary" variant="contained" onClick={() => {
                        log.info("saving ", userEdit, "and", userDataEdit)
                        if (user.email !== userEdit.email) {
                            setUser(userEdit)
                            const message = `${userEdit.email} will need to be verified before your next login, so please respond to an email in your inbox`;
                            log.info("showing message:", message);
                            notification.success(message);
                        } else {
                            log.info("no change to user's email")
                        }
                        setUserData(userDataEdit)
                    }}>
                        Save details
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

