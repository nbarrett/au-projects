import { Card, CardActions, CardContent, Grid } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import { firstNameForUser } from "../../util/strings";
import { contentContainer } from "../../admin/components/GlobalStyles";
import useCurrentUser from "../../hooks/use-current-user";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { toAppRoute } from "../../mappings/route-mappings";
import { AppRoute } from "../../models/route-models";

export function Home() {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    return <>
        <Helmet>
            <title>Home | AU Projects</title>
        </Helmet>
        <Grid sx={contentContainer} container spacing={5}>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontSize: 18, fontWeight: "bold", mb: 3, mt: 3}} color="text.primary"
                                    gutterBottom>
                            Hi {firstNameForUser(currentUser.document?.data)}!
                        </Typography>
                        <Typography variant="h5" component="div">
                            Welcome to the AU Projects Portal
                        </Typography>
                        <Typography sx={{mt: 3}} color="text.secondary">
                            We can add some introductory words here that you can customise....
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => {
                            navigate(toAppRoute(AppRoute.ORDERS));
                        }}>Get Started</Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    </>;

}
