import { WithUid } from "../../models/common-models";
import { CallOff, Order, OrderItem } from "../../models/order-models";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import { UseSingleOrder } from "../../hooks/use-single-order";
import { CallOffRequest } from "./CallOffRequest";

export function CallOffs(props: { order: WithUid<Order>, orderItem: OrderItem, singleOrder: UseSingleOrder }) {
    const order = props.order;
    const singleOrder = props.singleOrder;
    const orderItem = props.orderItem;
    return props?.orderItem?.callOffs?.length > 0 ? <TableRow sx={{"& > *": {borderTop: "none"}}}>
        <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={12}>
            <Box sx={{marginTop: 0, marginBottom: 0}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Calloff Request Details</TableCell>
                            <TableCell>Calloff Remaining</TableCell>
                            <TableCell>Events</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.orderItem?.callOffs?.map((callOff: CallOff, callOffItemIndex) => <CallOffRequest
                            callOff={callOff} key={callOffItemIndex}
                            callOffItemIndex={callOffItemIndex} order={order} orderItem={orderItem}
                            singleOrder={singleOrder}/>)}
                    </TableBody>
                </Table>
            </Box>
        </TableCell>
    </TableRow> : null;
}
