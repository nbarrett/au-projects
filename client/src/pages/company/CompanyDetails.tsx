import { Grid, TextareaAutosize, TextField, } from "@material-ui/core";
import * as React from "react";
import { Company } from "../../models/company-models";
import useCompanyData from "../../hooks/use-company-data";
import { DataBoundAutoComplete } from "../../components/DataBoundAutoComplete";
import useSingleCompany from "../../hooks/use-single-company";
import useUniqueValues from '../../hooks/use-unique-values';

export default function CompanyDetails() {
    const company = useSingleCompany();
    const companyData = useCompanyData();
    const uniqueValues = useUniqueValues(companyData.companies);
    return (
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
                                                options={uniqueValues.values.suburb}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.province"} label={"Province"} type={"text"}
                                                onChange={company.changeField} document={company.company}
                                                options={uniqueValues.values.province||[]}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.postcode"} label={"Postcode"} type={"text"}
                                                onChange={company.changeField} document={company.company}
                                                options={uniqueValues.values.postcode||[]}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.city"} label={"City"} type={"text"}
                                                onChange={company.changeField} document={company.company}
                                                options={uniqueValues.values.city||[]}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.country"} label={"Country"} type={"text"}
                                                onChange={company.changeField} document={company.company}
                                                options={uniqueValues.values.country||[]}/>
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
    );
}
