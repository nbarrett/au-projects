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
    Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import * as React from "react";
import { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import { remove, save } from "../../data-services/firebase-services";
import { WithUid } from "../../models/common-models";
import DeleteIcon from "@material-ui/icons/Delete";
import { cloneDeep, set } from "lodash";
import { Company } from '../../models/company-models';
import { useNavigate } from 'react-router-dom';
import { APP_PATH, AppRoute } from '../../constants';
import useCompanyData from '../../hooks/use-company-data';
import { DataBoundAutoComplete } from '../../components/DataBoundAutoComplete';

export default function CompanyDetails(props: { company: WithUid<Company>, rest?: any[] }) {
    const navigate = useNavigate();
    const [company, setCompany] = useState<WithUid<Company>>(props.company);
    const companyData = useCompanyData();

    useEffect(() => {
        log.info("changed company:", company);
    }, [company])

    function changeField(field: string, value: any) {
        log.info("companyChange:" + company.data.name, "field:", field, "value:", value, "typeof:", typeof value);
        const mutableCompany: WithUid<Company> = cloneDeep(company);
        set(mutableCompany, field, value)
        setCompany(mutableCompany);
    }

    function companyChange(event?: any) {
        const field = event.target.name;
        const value = event.target.value;
        changeField(field, value);
    }

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
                            onChange={companyChange}
                            value={company?.data?.name || ""}
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
                            onChange={companyChange}
                            value={company?.data?.address?.building || ""}
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
                            onChange={companyChange}
                            value={company?.data?.address?.street || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.suburb"} label={"Suburb"} type={"text"}
                                                        onChange={changeField} document={company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.province"} label={"Province"} type={"text"}
                                                        onChange={changeField} document={company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.postcode"} label={"Postcode"} type={"text"}
                                                        onChange={changeField} document={company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.city"} label={"City"} type={"text"}
                                                        onChange={changeField} document={company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Company> field={"data.address.country"} label={"Country"} type={"text"}
                                                        onChange={changeField} document={company}
                                                        allDocuments={companyData.companies}/>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <TextField
                            fullWidth
                            label="Media"
                            name="data.avatarUrl"
                            onChange={companyChange}
                            value={company?.data?.avatarUrl || ""}
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
                            onChange={companyChange}
                            value={company?.data?.notes || ""}
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
                        <Tooltip title={`Delete ${company?.data?.name}`}>
                            <IconButton onClick={() => {
                                remove<Company>("companies", props.company.uid).then(backToCompanies);
                            }}>
                                <DeleteIcon color="secondary"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item sx={{
                        alignItems: "center",
                        display: "flex",
                    }}>
                        <Tooltip title={`Save changes to ${company?.data?.name}`}>
                            <IconButton onClick={() => {
                                save<Company>("companies", company).then(backToCompanies);
                            }}>
                                <SaveIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Undo changes to ${company?.data?.name}`}>
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
