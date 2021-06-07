import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import UserListResults from "./UserListResults";

export default function UserList() {

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
                        <UserListResults userRecords={[]}/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
