import moment from "moment";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import { useSession } from "../../../auth/useSession";

export default function AccountProfile() {
  const dummyUser = {
    avatar: "/static/images/avatars/nick.png",
    city: "Ashford",
    country: "UK",
    jobTitle: "Developer",
    name: "AccountProfile.name",
    timezone: "GMT",
  };

  const { user, loading } = useSession();
  console.info("AccountProfile:user:", user);
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
            src={dummyUser.avatar}
            sx={{
              height: 100,
              width: 100,
            }}
          />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user?.displayName || user?.email || dummyUser.name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${dummyUser.city} ${dummyUser.country}`}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${moment().format("hh:mm A")} ${dummyUser.timezone}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
