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
import { useRecoilValue } from "recoil";
import { currentUserDataState, currentUserState } from "../../../atoms/user-atoms";
import { FirebaseUser, UserData } from "../../../models/auth-models";

export default function AccountProfile() {
  const dummyUser = {
    avatar: "/static/images/avatars/nick.png",
  };

  const user = useRecoilValue<FirebaseUser>(currentUserState);
  const userData = useRecoilValue<UserData>(currentUserDataState);

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
            {`${userData?.firstName} ${userData?.lastName}`}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user?.email}
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
