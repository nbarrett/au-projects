import { Avatar, Box, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import * as React from "react";
import useCurrentUser from "../../hooks/use-current-user";
import { useFirebaseUser } from "../../hooks/use-firebase-user";

export function SidebarAvatar() {

    const currentUser = useCurrentUser();
    const firebaseUser = useFirebaseUser();

    return <Box sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        p: 2,
    }}><Avatar component={RouterLink}
               src={currentUser.document?.data?.avatarUrl}
               sx={{
                   cursor: "pointer",
                   width: 64,
                   height: 64,
               }}
               to="/app/account"/>
        <Typography color="textPrimary" variant="h5">
            {firebaseUser?.user?.email}
        </Typography>
        <Typography color="textSecondary" variant="body2">
            {`${currentUser.document?.data?.firstName} ${currentUser.document?.data?.lastName}`}
        </Typography>
    </Box>;
}
