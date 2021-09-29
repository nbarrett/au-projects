import { Avatar, Button, Card, CardActions, CardContent, Divider, Grid, Typography, } from "@material-ui/core";
import useCurrentUser from "../../hooks/use-current-user";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import useSnackbar from "../../hooks/use-snackbar";

export default function AccountUploadImage() {

    const snackbar = useSnackbar();
    const currentUser = useCurrentUser();
    const firebaseUser = useFirebaseUser();

    return (
        <Card>
            <CardContent>
                <Grid sx={{
                    flexDirection: "column",
                }} container alignContent={"center"} alignItems={"center"} spacing={3}>
                    <Grid item>
                        <Avatar
                            src={currentUser?.document?.data?.avatarUrl}
                            sx={{
                                height: 100,
                                width: 100,
                            }}/>
                    </Grid>
                    <Grid item>
                        <Typography color="textPrimary" gutterBottom variant="h3">
                            {`${currentUser?.document?.data?.firstName} ${currentUser?.document?.data?.lastName}`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography color="textSecondary" variant="body1">
                            {firebaseUser.user?.email}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider/>
            <CardActions>
                <Button color="primary"
                        onClick={() => snackbar.warning("Ah. That's not done yet but will be coming soon once we move to a nodejs based server....")}
                        fullWidth variant="text">
                    Upload Image
                </Button>
            </CardActions>
        </Card>
    );
}
