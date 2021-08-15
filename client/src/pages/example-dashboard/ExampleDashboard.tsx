import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import Budget from "../../admin/components/dashboard/Budget";
import TotalCustomers from "../../admin/components/dashboard/TotalCustomers";
import TasksProgress from "../../admin/components/dashboard/TasksProgress";
import TotalProfit from "../../admin/components/dashboard/TotalProfit";
import Sales from "../../admin/components/dashboard/Sales";
import SalesByCustomer from "../../admin/components/dashboard/SalesByCustomer";

export default function ExampleDashboard() {
    return (
        <>
            <Helmet>
                <title>Dashboard | AU Projects</title>
            </Helmet>
            <Box sx={{backgroundColor: "background.default", minHeight: "100%", py: 3,}}>
                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <Budget/>
                        </Grid>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <TotalCustomers/>
                        </Grid>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <TasksProgress/>
                        </Grid>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <TotalProfit sx={{height: "100%"}}/>
                        </Grid>
                        <Grid item lg={8} md={12} xl={9} xs={12}>
                            <Sales/>
                        </Grid>
                        <Grid item lg={4} md={6} xl={3} xs={12}>
                            <SalesByCustomer sx={{height: "100%"}}/>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>);
}
