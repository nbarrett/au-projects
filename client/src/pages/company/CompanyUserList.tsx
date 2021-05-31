import * as React from "react";
import {
    Avatar,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { fullNameForUser, initialsForUser } from "../../util/strings";
import useAllUsers from "../../hooks/use-all-users";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import useSingleCompany from '../../hooks/use-single-company';

export default function CompanyUserList() {
    const allUsers = useAllUsers()
    const company = useSingleCompany();

    const usersForCompany = allUsers.users.filter(user => user.data.companyId === company.company.uid);
    return (
        <Grid item xs>
            <Typography color="textPrimary" gutterBottom variant="h4">
                Company Users ({usersForCompany.length})
            </Typography>
            <List dense>
                {usersForCompany.map(user => <ListItem key={user.uid}>
                    <ListItemAvatar>
                        <Avatar src={user.data.avatarUrl} sx={{mr: 2}}>
                            {initialsForUser(user.data)}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={fullNameForUser(user.data)}
                        secondary={company.company.data.primaryContact === user.uid ? "(Primary Contact)" : ""}
                    />
                    <ListItemSecondaryAction>
                        <Tooltip title={`Make ${fullNameForUser(user.data)} the primary contact`}>
                            <IconButton edge="end" aria-label="default" onClick={() => {
                                company.changeField("data.primaryContact", user.uid)
                            }}>
                                <ContactMailIcon/>
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>)}
            </List>
        </Grid>
    );
}
