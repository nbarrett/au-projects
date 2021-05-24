import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import UserListResults from "./UserListResults";
import { useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { log } from '../../../util/logging-config';
import { findAll } from '../../../data-services/firebase-services';
import { AuthenticatedUserData } from '../../../models/authentication-models';
import { ToolbarButton } from '../../../models/toolbar-models';
import { toolbarButtonState } from '../../../atoms/navbar-atoms';
import { WithUid } from '../../../models/user-models';

export default function UserList() {
    const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);
    const [users, setUsers] = useState<WithUid<AuthenticatedUserData>[]>([]);
    // const [userRecords, setUserRecords] = useState<auth.UserRecord[]>([]);
    // const [authenticatedUsers, setAuthenticatedUsers] = useState<AuthenticatedUserData[]>([]);


    useEffect(() => {
        log.info("CustomerListResults triggered");
        setToolbarButtons(["add user"])
        // allUsers().then(setUserRecords)
        findAll<AuthenticatedUserData>("users").then(setUsers);
    }, [])
    return (
        <>
            <Helmet>
                <title>Users | AU Projects</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                }}
            >
                <Container maxWidth={false}>
                    <Box sx={{pt: 3}}>
                        <UserListResults users={users} userRecords={[]}/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
