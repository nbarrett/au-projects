import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import CustomerListToolbar from "../components/customer/CustomerListToolbar";

export default function Companies() {
    return (
        <>
            <Helmet>
                <title>Companies | AU Projects</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                }}
            >
                <Container maxWidth={false}>
                    <CustomerListToolbar/>
                    <Box sx={{pt: 3}}>
                        <div>to add</div>
                        {/*<CustomerListResults customers={customers}/>*/}
                    </Box>
                </Container>
            </Box>
        </>
    );
}
