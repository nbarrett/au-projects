import * as React from "react";
import { Avatar, Box, Typography, } from "@material-ui/core";
import { fullNameForUser, initialsForUser } from "../../util/strings";
import { UserData } from '../../models/user-models';

export default function NamedAvatar(props: { user: UserData }) {

    return (
        <Box sx={{alignItems: "center", display: "flex",}}>
            <Avatar src={props?.user?.avatarUrl} sx={{mr: 2}}>
                {props?.user && initialsForUser(props?.user)}
            </Avatar>
            <Typography color="textPrimary" variant="body1">
                {props?.user && fullNameForUser(props?.user)}
            </Typography>
        </Box>
    );
}
