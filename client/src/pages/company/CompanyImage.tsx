import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography, } from "@material-ui/core";
import { useSnackbarNotification } from "../../snackbarNotification";
import useSingleCompany from "../../hooks/use-single-company";

export default function CompanyImage() {

    const notification = useSnackbarNotification();
    const company = useSingleCompany();
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
                    <Typography color="textPrimary" gutterBottom variant="h3">
                        {`${company.document.data.name || "New Company"}`}
                    </Typography>
                    <Avatar
                        src={company.document.data.avatarUrl}
                        sx={{
                            height: 100,
                            width: 100,
                        }}
                    />
                </Box>
            </CardContent>
            <Divider/>
            <CardActions>
                <Button onClick={() => notification.info("This doesn't work yet, so for the time being, paste in the url to the image in the media field and it should display")} color="primary" fullWidth variant="text">
                    Upload image
                </Button>
            </CardActions>
        </Card>
    );
}
