import { WithUid } from "../../models/common-models";
import { Company } from "../../models/company-models";
import { Order, OrderItem, OrderStatus, OrderStatusDescriptions } from "../../models/order-models";
import {
    callOffOrderStatusDescription,
    callOffSummary,
    cancellable,
    deletable,
    editable
} from "../../mappings/order-mappings";
import { Chip, IconButton, TableCell, TableRow, TextField, Tooltip } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { asDateTime } from "../../util/dates";
import { fullNameForUser } from "../../util/strings";
import { asCurrency } from "../../mappings/product-mappings";
import sum from "lodash/sum";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import useSnackbar from "../../hooks/use-snackbar";
import { UseSingleOrder } from "../../hooks/use-single-order";
import useUsers from "../../hooks/use-users";
import { UseOrders } from "../../hooks/use-orders";
import useUserRoles from "../../hooks/use-user-roles";


export function OrderRow(props: { useOrders: UseOrders, singleOrder: UseSingleOrder, company: WithUid<Company>, order: WithUid<Order>, open: boolean, toggleOpen: () => void, pricedProducts: any }) {
    const snackbar = useSnackbar();
    const orders: UseOrders = props.useOrders;
    const singleOrder: UseSingleOrder = props.singleOrder;
    const isEditable = editable(props.order?.data?.status);
    const isCancellable = cancellable(props.order?.data?.status);
    const isDeletable = deletable(props.order?.data?.status);
    const users = useUsers();
    const currentUserRoles = useUserRoles().forCurrentUser();

    function lineItemCost(pricedProducts, orderItem: OrderItem) {
        return pricedProducts.lineItemPricing(orderItem).lineItemTotal;
    }

    function saveOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        singleOrder.saveOrder(currentOrder, OrderStatus.DRAFT).then(orders.refreshOrders).then(() => snackbar.success(`Order ${orderNumber} was saved`));
    }

    function undoOrderChanges(currentOrder: WithUid<Order>) {
        if (currentOrder.uid) {
            singleOrder.findOrder(currentOrder.uid);
        } else {
            singleOrder.resetAndMarkForDelete();
        }
    }

    function cancelOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        singleOrder.saveOrder(currentOrder, OrderStatus.CANCELLED).then(orders.refreshOrders).then(() => snackbar.success(`Order ${orderNumber} was cancelled`));
    }

    function deleteOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        singleOrder.deleteOrder(currentOrder).then(orders.refreshOrders).then(() => snackbar.success(`Order ${orderNumber} was deleted`));
    }

    function revertOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        singleOrder.saveOrder(currentOrder, OrderStatus.DRAFT).then(orders.refreshOrders).then(() => snackbar.success(`Order ${orderNumber} was reverted`));
    }

    function addLineItem(currentOrder: WithUid<Order>) {
        singleOrder.addLineItem(currentOrder);
    }

    return <TableRow sx={{"& > *": {borderBottom: "none"}}}>
        <TableCell>
            <Tooltip
                title={props.open ? "Hide Line Items" : "Show Line Items"}>
                <IconButton aria-label="expand row"
                            size="small"
                            onClick={props.toggleOpen}>{props.open ?
                    <KeyboardArrowUpIcon/> :
                    <KeyboardArrowDownIcon/>}
                </IconButton>
            </Tooltip>
        </TableCell>
        <TableCell>
            {isEditable ? <TextField size={"small"}
                                     inputProps={{style: {textTransform: "uppercase"}, autoComplete: "new-password"}}
                                     type={"string"}
                                     sx={{width: 100}}
                                     onChange={(event: any) => singleOrder.changeField(props.order, "data.companyOrderNumber", event.target.value)}
                                     value={props.order.data.companyOrderNumber || ""}
                                     name={"companyOrderNumber"}
                                     variant={"outlined"}/> : props.order.data.companyOrderNumber}
        </TableCell>
        <TableCell>{props.order.data.orderNumber}</TableCell>
        <TableCell>
            {asDateTime(props.order.data.createdAt).toFormat("dd-MMM-yyyy")}
        </TableCell>
        <TableCell>
            {props.order.data.updatedAt ? asDateTime(props.order.data.updatedAt).toFormat("dd-MMM-yyyy") : null}
        </TableCell>
        <TableCell>{props.company?.data?.name || ""}</TableCell>
        <TableCell>{fullNameForUser(users.userForUid(props.order.data?.createdBy)?.data)}</TableCell>
        <TableCell>
            <Chip label={callOffSummary(props.order)} size="small"/>
        </TableCell>
        <TableCell>
            <Chip color="primary" label={callOffOrderStatusDescription(props.order)} size="small"/>
        </TableCell>
        <TableCell>
            {props.order?.data?.items?.length}
        </TableCell>
        <TableCell>
            {asCurrency(sum(props.order?.data?.items?.map(item => lineItemCost(props.pricedProducts, item))))}
        </TableCell>
        <TableCell>
            {props.order?.data.status <= OrderStatus.DRAFT ? <>
                    <IconButton disabled={!isEditable} onClick={() => addLineItem(props.order)}>
                        <Tooltip title={`Add Line Item`}>
                            <AddIcon color={isEditable ? "primary" : "disabled"}/>
                        </Tooltip>
                    </IconButton>
                    <IconButton disabled={!isCancellable} onClick={() => saveOrder(props.order)}>
                        <Tooltip title={`Save changes to order`}>
                            <SaveIcon color={isEditable ? "primary" : "disabled"}/>
                        </Tooltip>
                    </IconButton>
                    <IconButton disabled={!isEditable} onClick={() => undoOrderChanges(props.order)}>
                        <Tooltip title={`Undo changes to order`}>
                            <UndoIcon color={isEditable ? "primary" : "disabled"}/></Tooltip>
                    </IconButton>
                    <IconButton disabled={!isCancellable} onClick={() => cancelOrder(props.order)}>
                        <Tooltip title={`Cancel order`}>
                            <CancelIcon color={isCancellable ? "secondary" : "disabled"}/>
                        </Tooltip>
                    </IconButton>
                    <IconButton disabled={!isDeletable} onClick={() => deleteOrder(props.order)}>
                        <Tooltip title={`Delete order`}>
                            <DeleteIcon color={isDeletable ? "secondary" : "disabled"}/>
                        </Tooltip>
                    </IconButton>
                </> :
                currentUserRoles.data.backOffice ? <IconButton onClick={() => revertOrder(props.order)}>
                    <Tooltip title={`Revert order to Draft`}>
                        <UndoIcon color={"primary"}/>
                    </Tooltip>
                </IconButton> : null}
        </TableCell>
    </TableRow>;
}
