import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import UserListResults from "../../components/users/UserListResults";
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../../atoms/dashboard-atoms';
import { useEffect, useState } from 'react';
import { log } from '../../../util/logging-config';
import { queryCollection } from '../../../atoms/firebase-services';
import { AuthenticatedUserData, UserData } from '../../../models/user-models';
import { allUsers } from '../../../atoms/user-data-services';
import { auth } from 'firebase-admin/lib/auth';

export default function UserList() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    const [users, setUsers] = useState<UserData[]>([]);
    const [userRecords, setUserRecords] = useState<auth.UserRecord[]>([]);
    const [authenticatedUsers, setAuthenticatedUsers] = useState<AuthenticatedUserData[]>([]);


    useEffect(() => {
        log.info("CustomerListResults triggered");
        setButtonCaptions(["add user"])
        allUsers().then(setUserRecords)
        queryCollection<UserData>("users").then(setUsers);
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
                        <UserListResults users={authenticatedUsers} userRecords={userRecords}/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
