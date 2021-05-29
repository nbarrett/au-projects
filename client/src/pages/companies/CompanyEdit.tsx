import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import CompanyImage from './CompanyImage';
import { Company } from '../../models/company-models';
import CompanyDetails from './CompanyDetails';
import { useParams } from 'react-router';
import { log } from '../../util/logging-config';
import { find } from '../../data-services/firebase-services';
import { WithUid } from '../../models/common-models';
import { useEffect, useState } from 'react';

export default function CompanyEdit() {
    const {uid} = useParams();
    const [company, setCompany] = useState<WithUid<Company>>();

    useEffect(() => {
        if (uid == "new") {
            log.info("Creating new company:");
            setCompany({uid: "", data: {}} as WithUid<Company>);
        } else if (uid) {
            log.info("finding company:", uid);
            find<Company>("companies", uid).then(setCompany)
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
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={6} xs={12}>
                            <CompanyImage company={company}/>
                        </Grid>
                        <Grid item lg={8} md={6} xs={12}>
                            <CompanyDetails company={company}/>
                        </Grid>
                    </Grid>
                </Container>}
            </Box>
        </>
    );
}
