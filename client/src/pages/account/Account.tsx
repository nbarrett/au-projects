import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@mui/material";
import AccountUploadImage from "./AccountUploadImage";
import AccountPersonalDetails from "./AccountPersonalDetails";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { StoredValue } from "../../util/ui-stored-values";
import { log } from "../../util/logging-config";
import max from "lodash/max";
import { useUpdateUrl } from "../../hooks/use-url-updating";
import { useUrls } from "../../hooks/use-urls";
import { AccountTab, AccountTabDescriptions, allTabs } from "../../models/account-models";
import Typography from "@mui/material/Typography";
import { AccountSettingsChangePassword } from "./AccountSettingsChangePassword";
import { AccountSettings } from "./AccountSettings";

export default function Account() {
    const updateUrl = useUpdateUrl();
    const urls = useUrls();
    const tabValues = allTabs();
    const [tabValue, setTabValue] = useState<AccountTab>();
    const classes = makeStyles((theme: Theme) => ({
        tabHeading: {
            textTransform: "none",
        },
        badge: {
            marginLeft: 15
        },
        tabs: {
            marginBottom: 20
        },
    }))({});

    useEffect(() => {
        const initialValue: number = +urls.initialStateFor(StoredValue.TAB, AccountTab.PERSONAL_DETAILS);
        log.debug("initialValue:", initialValue);
        if (!Number.isNaN(initialValue)) {
            setTabValue(initialValue);
        }
    }, []);

    useEffect(() => {
        updateUrl({value: tabValue, name: StoredValue.TAB});
    }, [tabValue]);

    function changeTabTo(newValue: number) {
        log.debug("tab selected:", newValue);
        setTabValue(newValue);
    }

    function tabIndex(): number {
        return max([tabValues.indexOf(tabValue), 0]);
    }

    return (
        <>
            <Helmet>
                <title>Account | AU Projects</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                }}
            >
                <Container maxWidth="lg">
                    <Tabs className={classes.tabs} selectionFollowsFocus scrollButtons
                          allowScrollButtonsMobile value={tabIndex()} indicatorColor="secondary" variant="scrollable">
                        {allTabs().map(tab => <Tab key={tab} onClick={() => changeTabTo(tab)}
                                                   value={tab}
                                                   className={classes.tabHeading}
                                                   label={
                                                       <Typography
                                                           className={classes.tabHeading}>{AccountTabDescriptions[tab]}</Typography>}/>)}
                    </Tabs>
                    <Grid container alignItems={"center"} spacing={3}>
                        {tabValue === AccountTab.IMAGE && <Grid item lg={4} md={6} xs={12}>
                            <AccountUploadImage/>
                        </Grid>}
                        {tabValue === AccountTab.PERSONAL_DETAILS && <Grid item lg={8} md={6} xs={12}>
                            <AccountPersonalDetails/>
                        </Grid>}
                        {tabValue === AccountTab.SETTINGS && <Grid item lg={8} md={6} xs={12}>
                            <AccountSettings/>
                        </Grid>}
                        {tabValue === AccountTab.CHANGE_PASSWORD && <Grid item lg={8} md={6} xs={12}>
                            <AccountSettingsChangePassword/>
                        </Grid>}
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
