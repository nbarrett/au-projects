import { Avatar, Button, Card, CardActions, CardContent, Divider, Grid, Typography, } from "@material-ui/core";
import { useRecoilValue } from "recoil";
import { currentUserDataState, currentUserState } from "../../atoms/user-atoms";
import { FirebaseUser } from "../../models/authentication-models";
import { UserData } from "../../models/user-models";
import { useSnackbarNotification } from "../../snackbarNotification";

export default function AccountUploadImage() {

    const user = useRecoilValue<FirebaseUser>(currentUserState);
    const userData = useRecoilValue<UserData>(currentUserDataState);
    const notification = useSnackbarNotification();

    return (
        <Card>
            <CardContent>
                <Grid sx={{
                    flexDirection: "column",
                }} container alignContent={"center"} alignItems={"center"} spacing={3}>
                    <Grid item>
                        <Avatar
                            src={userData.avatarUrl}
                            sx={{
                                height: 100,
                                width: 100,
                            }}/>
                    </Grid>
                    <Grid item>
                        <Typography color="textPrimary" gutterBottom variant="h3">
                            {`${userData?.firstName} ${userData?.lastName}`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography color="textSecondary" variant="body1">
                            {user?.email}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider/>
            <CardActions>
                <Button color="primary"
                        onClick={() => notification.warning("Ah. That's not done yet but will be coming soon once we move to a nodejs based server....")}
                        fullWidth variant="text">
                    Upload Image
                </Button>
            </CardActions>
        </Card>
    );
}
