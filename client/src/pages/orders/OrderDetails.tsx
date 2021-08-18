import { Grid, TextField, } from "@material-ui/core";
import * as React from "react";
import useSingleOrder from "../../hooks/use-single-order";
import useAllUsers from "../../hooks/use-all-users";
import { fullNameForUser } from "../../util/strings";
import { asDateTime, DateFormats } from "../../util/dates";
import { OrderStatusDescriptions } from "../../models/order-models";
import useCompanyData from "../../hooks/use-company-data";

export default function OrderDetails() {
    const allUsers = useAllUsers();
    const companies = useCompanyData();
    const order = useSingleOrder();
    return (
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <TextField
                    fullWidth
                    disabled
                    label="Order Number"
                    name="data.orderNumber"
                    value={order.document?.data?.orderNumber || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    fullWidth
                    disabled
                    autoComplete="off"
                    label="Company"
                    name="data.companyId"
                    onChange={order.change}
                    value={companies.companyForUid(order.document?.data?.companyId)?.data?.name || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Created by"
                    name="data.createdBy"
                    type="text"
                    value={fullNameForUser(allUsers.userForUid(order.document?.data?.createdBy)) || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Updated by"
                    name="data.updatedBy"
                    type="text"
                    value={fullNameForUser(allUsers.userForUid(order.document?.data?.updatedBy)) || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Created"
                    name="data.createdAt"
                    type="date"
                    value={asDateTime(order.document?.data?.createdAt).toFormat(DateFormats.displayDateAndTime) || ""}
                    variant="outlined"
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    label="Updated"
                    name="data.updatedAt"
                    type="date"
                    onChange={order.change}
                    value={asDateTime(order.document?.data?.updatedAt).toFormat(DateFormats.displayDateAndTime) || ""}
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
                    onChange={order.change}
                    value={OrderStatusDescriptions[order.document?.data?.status] || ""}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
}
