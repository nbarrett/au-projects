import { Grid, TextareaAutosize, TextField, } from "@material-ui/core";
import * as React from "react";
import { DataBoundAutoComplete } from "../../components/DataBoundAutoComplete";
import useUniqueValues from "../../hooks/use-unique-values";
import useSingleCompany from "../../hooks/use-single-company";
import { Company } from "../../models/company-models";
import useCompanyData from "../../hooks/use-company-data";

export default function CompanyDetails() {
    const document = useSingleCompany();
    const companyData = useCompanyData();
    const uniqueValues = useUniqueValues(companyData.documents);
    return (
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Company Name"
                    name="data.name"
                    onChange={document.companyChange}
                    value={document.document?.data?.name || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Code"
                    name="data.code"
                    onChange={document.companyChange}
                    value={document.document?.data?.code || ""}
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
                    onChange={document.companyChange}
                    value={document.document?.data?.registrationNumber || ""}
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
                    onChange={document.companyChange}
                    value={document.document?.data?.vatNumber || ""}
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
                    onChange={document.companyChange}
                    value={document.document?.data?.address?.building || ""}
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
                    onChange={document.companyChange}
                    value={document.document?.data?.address?.street || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.suburb"} size={"medium"} label={"Suburb"}
                                                type={"text"}
                                                onChange={document.changeField} document={document.document}
                                                options={uniqueValues.field("address.suburb")}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.province"} size={"medium"} label={"Province"}
                                                type={"text"}
                                                onChange={document.changeField} document={document.document}
                                                options={uniqueValues.field("address.province")}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.postcode"} size={"medium"} label={"Postcode"}
                                                type={"text"}
                                                onChange={document.changeField} document={document.document}
                                                options={uniqueValues.field("address.postcode")}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.city"} size={"medium"} label={"City"} type={"text"}
                                                onChange={document.changeField} document={document.document}
                                                options={uniqueValues.field("address.city")}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <DataBoundAutoComplete<Company> field={"data.address.country"} size={"medium"} label={"Country"}
                                                type={"text"}
                                                onChange={document.changeField} document={document.document}
                                                options={uniqueValues.field("address.country")}/>
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    size={"medium"}
                    label="Media"
                    name="data.avatarUrl"
                    onChange={document.companyChange}
                    value={document.document?.data?.avatarUrl || ""}
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
                    onChange={document.companyChange}
                    value={document.document?.data?.notes || ""}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
}
