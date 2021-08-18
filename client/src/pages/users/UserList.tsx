import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import UserListResults from "./UserListResults";
import { contentContainer } from "../../admin/components/GlobalStyles";

export default function UserList() {

    return (
        <>
            <Helmet>
                <title>Users | AU Projects</title>
            </Helmet>
            <Grid sx={contentContainer} container spacing={3}>
                <Grid item xs={12}>
                    <UserListResults userRecords={[]}/>
                </Grid>
            </Grid>
        </>
    );
}
