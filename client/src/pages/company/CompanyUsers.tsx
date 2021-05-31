import { Box, Card, CardContent, Divider, } from "@material-ui/core";
import CompanyUserList from './CompanyUserList';

export default function CompanyUsers() {

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <CompanyUserList/>
                </Box>
            </CardContent>
            <Divider/>
        </Card>
    );
}
