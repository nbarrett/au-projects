import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import UserListResults from "./UserListResults";
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../../atoms/dashboard-atoms';
import { useEffect, useState } from 'react';
import { log } from '../../../util/logging-config';
import { queryCollection } from '../../../atoms/firebase-services';
import { AuthenticatedUserData } from '../../../models/user-models';

export default function UserList() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    const [users, setUsers] = useState<AuthenticatedUserData[]>([]);
    // const [userRecords, setUserRecords] = useState<auth.UserRecord[]>([]);
    // const [authenticatedUsers, setAuthenticatedUsers] = useState<AuthenticatedUserData[]>([]);


    useEffect(() => {
        log.info("CustomerListResults triggered");
        setButtonCaptions(["add user"])
        // allUsers().then(setUserRecords)
        queryCollection<AuthenticatedUserData>("users").then(setUsers);
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
