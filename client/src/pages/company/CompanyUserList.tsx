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
} from "@mui/material";
import { fullNameForUser, initialsForUser } from "../../util/strings";
import useUsers from "../../hooks/use-users";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import useSingleCompany from "../../hooks/use-single-company";

export default function CompanyUserList() {
    const users = useUsers()
    const company = useSingleCompany();
    const usersForCompany = users.documents.filter(user => user.data.companyId === company.document.uid);
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
                        secondary={company.document.data.primaryContact === user.uid ? "(Primary Contact)" : ""}
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
