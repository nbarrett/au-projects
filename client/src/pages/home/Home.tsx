import { Card, CardActions, CardContent, Grid } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/styles";
import { firstNameForUser } from "../../util/strings";
import { contentContainer } from "../../admin/components/GlobalStyles";
import useCurrentUser from "../../hooks/use-current-user";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { AppRoute } from "../../constants";
import { useNavigate } from "react-router-dom";
import { toAppRoute } from "../../admin/routes";

export function Home() {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const classes = makeStyles(
        {}
    )();

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
