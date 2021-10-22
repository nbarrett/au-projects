import { WithUid } from "../../models/common-models";
import { Company } from "../../models/company-models";
import { Order, OrderItem, OrderStatus } from "../../models/order-models";
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { OrderLineItem } from "./OrderLineItem";
import { UseSingleOrder } from "../../hooks/use-single-order";
import Button from "@mui/material/Button";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import useSnackbar from "../../hooks/use-snackbar";


export function OrderLineItems(props: { singleOrder: UseSingleOrder, company: WithUid<Company>, order: WithUid<Order>, open: boolean, pricedProducts: any }) {
    const snackbar = useSnackbar();

    function SubmissionPanel() {
        return props.order.data.status === OrderStatus.DRAFT ? <TableRow>
            <TableCell sx={{paddingTop: 2, border: "none"}} colSpan={12} align={"right"}>
                <Button variant={"contained"} onClick={()=> props.singleOrder.submit(props.order)
                    .then(() => snackbar.success(`Order ${props.order.data.orderNumber} was submitted`))} startIcon={<ScheduleSendIcon/>}>Submit Order</Button></TableCell>
        </TableRow> : null;
    }

    return <TableRow sx={{border: "none"}}>
        <TableCell style={{border: "none"}} colSpan={12}>
            <Collapse in={props.open} timeout="auto" unmountOnExit>
                <Box sx={{marginTop: 2, marginBottom: 2, paddingBottom: 0}}>
                    <Typography variant="h5" sx={{
                        fontWeight: 550,
                        fontSize: "1rem",
                        lineHeight: "1.5",
                    }} gutterBottom component="div">
                        Order {props.order?.data?.orderNumber} Line Items
                    </Typography>
                    <Table size="small" aria-label="order details">
                        <TableHead>
                            <TableRow>
                                <TableCell>Line</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Specific Gravity</TableCell>
                                <TableCell align="center">Thickness</TableCell>
                                <TableCell align="center">Width</TableCell>
                                <TableCell align="center">Length</TableCell>
                                <TableCell align="center">Kg Per Roll</TableCell>
                                <TableCell align="center">Price Per Kg</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="right">Price Per Roll</TableCell>
                                <TableCell align="right">Total Price</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.order?.data?.items?.map((orderItem: OrderItem, index) => <OrderLineItem
                                pricedProducts={props.pricedProducts}
                                key={orderItem?.productId + "-" + index}
                                order={props.order}
                                company={props.company}
                                orderItem={orderItem}
                                index={index} singleOrder={props.singleOrder}/>)}
                            <SubmissionPanel/>
                        </TableBody>
                    </Table>
                </Box>
            </Collapse>
        </TableCell>
    </TableRow>;
}
