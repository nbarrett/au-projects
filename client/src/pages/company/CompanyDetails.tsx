import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    TextareaAutosize,
    TextField,
    Tooltip,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import * as React from "react";
import { remove, save } from "../../data-services/firebase-services";
import DeleteIcon from "@material-ui/icons/Delete";
import { Company } from "../../models/company-models";
import { useNavigate } from "react-router-dom";
import { APP_PATH, AppRoute } from "../../constants";
import useCompanyData from "../../hooks/use-company-data";
import { DataBoundAutoComplete } from "../../components/DataBoundAutoComplete";
import useSingleCompany from "../../hooks/use-single-company";

export default function CompanyDetails(props: { rest?: any[] }) {
    const navigate = useNavigate();
    const company = useSingleCompany();
    const companyData = useCompanyData();

    function backToCompanies() {
        navigate(`/${APP_PATH}/${AppRoute.COMPANIES}`);
    }

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
            {...props.rest}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            autoComplete="off"
                            label="Company Name"
                            name="data.name"
                            onChange={company.companyChange}
                            value={company.company?.data?.name || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            autoComplete="off"
                            label="Company Registration Number"
                            name="data.registrationNumber"
                            type="text"
                            onChange={company.companyChange}
                            value={company.company?.data?.registrationNumber || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            autoComplete="off"
                            label="VAT Number"
                            name="data.vatNumber"
                            type="text"
                            onChange={company.companyChange}
                            value={company.company?.data?.vatNumber || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            autoComplete="off"
                            label="Building"
                            name="data.address.building"
                            type="text"
                            onChange={company.companyChange}
                            value={company.company?.data?.address?.building || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            autoComplete="off"
                            label="Street"
                            name="data.address.street"
                            type="text"
                            onChange={company.companyChange}
                            value={company.company?.data?.address?.street || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.suburb"} label={"Suburb"} type={"text"}
                                                        onChange={company.changeField} document={company.company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.province"} label={"Province"} type={"text"}
                                                        onChange={company.changeField} document={company.company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.postcode"} label={"Postcode"} type={"text"}
                                                        onChange={company.changeField} document={company.company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.city"} label={"City"} type={"text"}
                                                        onChange={company.changeField} document={company.company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.country"} label={"Country"} type={"text"}
                                                        onChange={company.changeField} document={company.company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Media"
                            name="data.avatarUrl"
                            onChange={company.companyChange}
                            value={company.company?.data?.avatarUrl || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            InputProps={{
                                inputComponent: TextareaAutosize,
                                rows: 4
                            }}
                            fullWidth
                            label="Notes"
                            name="data.notes"
                            onChange={company.companyChange}
                            value={company.company?.data?.notes || ""}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Box sx={{flexGrow: 1}}/>
            <Divider/>
            <Box sx={{p: 2}}>
                <Grid container justifyContent="space-between"
                      alignItems="center">
                    <Grid item sx={{alignItems: "center", display: "flex"}}>
                        <Tooltip title={`Delete ${company.company?.data?.name}`}>
                            <IconButton onClick={() => {
                                remove<Company>("companies", company.company.uid).then(backToCompanies);
                            }}>
                                <DeleteIcon color="secondary"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item sx={{
                        alignItems: "center",
                        display: "flex",
                    }}>
                        <Tooltip title={`Save changes to ${company.company?.data?.name}`}>
                            <IconButton onClick={() => {
                                save<Company>("companies", company.company).then(backToCompanies);
                            }}>
                                <SaveIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Undo changes to ${company.company?.data?.name}`}>
                            <IconButton onClick={backToCompanies}>
                                <UndoIcon
                                    color="action"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}
