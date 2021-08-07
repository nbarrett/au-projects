import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import CompanyImage from "./CompanyImage";
import { Company } from "../../models/company-models";
import { useParams } from "react-router";
import { log } from "../../util/logging-config";
import { WithUid } from "../../models/common-models";
import { useEffect } from "react";
import CompanyUsers from "./CompanyUsers";
import useSingleCompany from "../../hooks/use-single-company";
import CompanyTabs from "./CompanyTabs";

export default function CompanyEdit() {
    const {uid} = useParams();
    const company = useSingleCompany();

    useEffect(() => {
        if (uid === "new") {
            log.debug("Creating new company:");
            company.setCompany({uid: "", data: {}} as WithUid<Company>);
        } else if (uid) {
            log.debug("finding company:", uid);
            company.findCompany(uid)
        } else {
            log.error("Need to specify company /uid or /new");
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>Company details | AU Projects</title>
            </Helmet>
            <Box sx={{
                backgroundColor: "background.default",
                minHeight: "100%",
                py: 3,
            }}>
                {company && <Container maxWidth="lg">
                    <Grid container alignItems={"stretch"} spacing={3}>
                        <Grid item lg={4} md={6} xs={12}>
                            <CompanyImage/>
                        </Grid>
                        <Grid item lg={4} md={6} xs={12}>
                            <CompanyUsers/>
                        </Grid>
                        <Grid item lg={8} md={6} xs={12}>
                            <CompanyTabs/>
                        </Grid>
                    </Grid>
                </Container>}
            </Box>
        </>
    );
}
