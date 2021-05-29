import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography, } from "@material-ui/core";
import { Company } from '../../models/company-models';
import { WithUid } from '../../models/common-models';
import { useSnackbarNotification } from '../../snackbarNotification';

export default function CompanyImage(props: { company: WithUid<Company> }) {

    const notification = useSnackbarNotification();

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Avatar
                        src={props.company.data.avatarUrl}
                        sx={{
                            height: 100,
                            width: 100,
                        }}
                    />
                    <Typography color="textPrimary" gutterBottom variant="h3">
                        {`${props.company.data.name || "New Company"}`}
                    </Typography>
                </Box>
            </CardContent>
            <Divider/>
            <CardActions>
                <Button onClick={() => notification.error("This doesn't work yet, so for the time being, paste in the url to the image in the media field and it should display")} color="primary" fullWidth variant="text">
                    Upload image
                </Button>
            </CardActions>
        </Card>
    );
}
