import * as React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import CompanyDetails from "./CompanyDetails";
import AvailableProducts from "./AvailableProducts";
import AppBar from "@material-ui/core/AppBar";
import { Divider, Grid, IconButton, Tooltip } from "@material-ui/core";
import { remove, save } from "../../data-services/firebase-services";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useNavigate } from "react-router-dom";
import { APP_PATH, AppRoute } from "../../constants";
import { TabPanelProps } from "../../models/common-models";
import useSingleCompany from "../../hooks/use-single-company";
import { Company } from "../../models/company-models";

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel"
             hidden={value !== index}
             id={`simple-tabpanel-${index}`}
             aria-labelledby={`simple-tab-${index}`}
             {...other}>
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function CompanyTabs() {
    const navigate = useNavigate();
    const document = useSingleCompany();

    function backToCompanies() {
        navigate(`/${APP_PATH}/${AppRoute.COMPANIES}`);
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{bgcolor: "background.paper"}}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="secondary"
                      textColor="inherit"
                      variant="fullWidth">
                    <Tab label="Company Details" {...a11yProps(0)} />
                    <Tab label="Available Products" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <CompanyDetails/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AvailableProducts/>
            </TabPanel>
            <Box sx={{flexGrow: 1}}/>
            <Divider/>
            <Box sx={{p: 2}}>
                <Grid container justifyContent="space-between"
                      alignItems="center">
                    <Grid item sx={{alignItems: "center", display: "flex"}}>
                        <Tooltip title={`Delete ${document.document?.data?.name}`}>
                            <IconButton onClick={() => {
                                remove<Company>("companies", document.document.uid).then(backToCompanies);
                            }}>
                                <DeleteIcon color="secondary"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item sx={{
                        alignItems: "center",
                        display: "flex",
                    }}>
                        <Tooltip title={`Save changes to ${document.document?.data?.name}`}>
                            <IconButton onClick={() => {
                                save<Company>("companies", document.document).then(backToCompanies);
                            }}>
                                <SaveIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Undo changes to ${document.document?.data?.name}`}>
                            <IconButton onClick={backToCompanies}>
                                <UndoIcon
                                    color="action"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
