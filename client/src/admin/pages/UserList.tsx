import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import UserListResults from "../components/user/UserListResults";
import customers from "../__mocks__/customers";
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../atoms/dashboard-atoms';
import { useEffect } from 'react';
import { log } from '../../util/logging-config';

export default function UserList() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    useEffect(() => {
        log.info("CustomerListResults triggered");
        setButtonCaptions(["add user"])
    },[])
    return (
        <>
            <Helmet>
                <title>Customers | AU Projects</title>
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
                        <UserListResults customers={customers}/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
