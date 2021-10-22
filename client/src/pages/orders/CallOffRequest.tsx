import { log } from "../../util/logging-config";
import max from "lodash/max";
import React, { Fragment, useEffect, useState } from "react";
import { FormControlLabel, IconButton, Radio, RadioGroup, TableCell, TableRow, Tooltip } from "@mui/material";
import { NumericInput } from "./NumericInput";
import Typography from "@mui/material/Typography";
import {
    CallOff,
    CallOffEvent,
    LineItemStatus,
    LineItemStatusDescriptions,
    Order,
    OrderItem
} from "../../models/order-models";
import { asDateTime } from "../../util/dates";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import DeleteIcon from "@mui/icons-material/Delete";
import sum from "lodash/sum";
import { WithUid } from "../../models/common-models";
import { UseSingleOrder } from "../../hooks/use-single-order";
import { pluralise, pluraliseWithCount } from "../../util/strings";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import { editable, sumOfOtherCallOffQuantities } from "../../mappings/order-mappings";

export function CallOffRequest(props: { callOff: CallOff, callOffItemIndex: number, order: WithUid<Order>, orderItem: OrderItem, singleOrder: UseSingleOrder }) {
    const {callOff, order, singleOrder, orderItem, callOffItemIndex} = props;
    const [editQuantity, setEditQuantity] = useState<boolean>(false);
    const [callOffAllRemaining, setCallOffAllRemaining] = useState<boolean>(callOff.quantityRemaining === 0);
    const maxRequestQuantity: number = orderItem.quantity - sum(orderItem?.callOffs.map((callOff, index) => index === callOffItemIndex ? 0 : callOff.quantity));
    const allLabel = `${callOffItemIndex === 0 ? "All" : "Remaining"} ${pluraliseWithCount(maxRequestQuantity, "roll")}`;
    const quantityEditable = (callOffItemIndex <= callOff.events.length) && editable(order.data.status) ;

    const sxSmallTextWithMargins = {
        ml: 1,
        mr: 2,
        fontSize: "0.7rem",
        verticalAlign: "center"
    };

    useEffect(() => {
        log.debug("order:", order.data.orderNumber, "editQuantity:", editQuantity, callOff);
    }, []);

    useEffect(() => {
        if (editQuantity) {
            setCallOffAllRemaining(callOff.quantityRemaining === 0);
        }
    }, [callOff.quantityRemaining]);

    function changeCallOffQuantityTo(quantity: number) {
        const quantityRemaining = props.orderItem.quantity - (sumOfOtherCallOffQuantities(orderItem, callOffItemIndex) + quantity);
        log.debug("quantity changed:", quantity, "quantityRemaining:", quantityRemaining);
        props.singleOrder.changeCallOffField(props.order, props.orderItem, callOffItemIndex, {
            field: "quantity",
            value: quantity
        }, {field: "quantityRemaining", value: quantityRemaining});
    }

    function onChangeQuantity(value: number) {
        changeCallOffQuantityTo(max([value, 0]));
    }

    function callOffAllRemainingTrue() {
        log.debug("callOffAllRemainingTrue");
        setCallOffAllRemaining(true);
        changeCallOffQuantityTo(maxRequestQuantity);
    }

    function callOffAllRemainingFalse() {
        log.debug("callOffAllRemainingFalse");
        setCallOffAllRemaining(false);
    }

    function eventsFor(events: CallOffEvent[]): JSX.Element {
        return <>{events.map(event => {
            return <Fragment key={event.timestamp}>
                {asDateTime(event.timestamp).toFormat("dd-MMM-yyyy")}
                <Typography variant="caption"
                            sx={sxSmallTextWithMargins}>{LineItemStatusDescriptions[event.status]}</Typography>
            </Fragment>;
        })}</>;
    }

    function CallOffButton(props: { callOffItemIndex: number, isEditable: boolean }) {
        return <IconButton disabled={!props.isEditable}
                           onClick={() => {
                               if (callOff.events.length === 0) {
                                   singleOrder.createCallOffEvent(order, orderItem, props.callOffItemIndex, LineItemStatus.SUBMITTED);
                               }
                               setEditQuantity(false);
                           }}>
            <Tooltip title={`Confirm call off quantity`}><CallSplitIcon
                color={props.isEditable ? "action" : "disabled"}/></Tooltip>
        </IconButton>;
    }

    function DeleteButton(props: { callOffItemIndex: number, isEditable: boolean }) {
        return <IconButton disabled={!props.isEditable}
                           onClick={() => {
                               singleOrder.deleteCallOff(order, orderItem, props.callOffItemIndex);
                           }}>
            <Tooltip title={`Delete call off`}>
                <DeleteIcon color={props.isEditable ? "secondary" : "disabled"}/>
            </Tooltip>
        </IconButton>;
    }

    function EditButton(props: { isEditable: boolean }) {
        return <IconButton disabled={!props.isEditable}
                           onClick={() => {
                               if (quantityEditable) {
                                   setEditQuantity(true);
                               }
                           }}>
            <Tooltip title={`Edit call off`}>
                <EditIcon color={quantityEditable ? "action" : "disabled"}/>
            </Tooltip>
        </IconButton>;
    }

    function QuantityDescription() {
        return <Box sx={{cursor: "pointer"}}
                    onClick={() => {
                        if (quantityEditable) {
                            setEditQuantity(true);
                        }
                    }}>{callOff.quantity} of {pluraliseWithCount(orderItem.quantity, "roll")}
        </Box>;
    }

    const partLabel = `${pluralise(maxRequestQuantity, "roll")} only`;
    return <TableRow key={`callOff-${callOffItemIndex}`}>
        <TableCell>
            {callOff.events.length === 0 || editQuantity ?
                <RadioGroup row name="callOffType" value={callOffAllRemaining}>
                    <FormControlLabel sx={{mr: 4}} value={true} onChange={callOffAllRemainingTrue}
                                      control={<Radio/>}
                                      label={allLabel}/>
                    <NumericInput onFocus={callOffAllRemainingFalse} value={callOff.quantity}
                                  onChange={onChangeQuantity}
                                  disabled={callOff.quantityRemaining < 0}
                                  incrementDisabled={callOff.quantityRemaining === 0}
                                  decrementDisabled={callOffAllRemaining || callOff.quantityRemaining < 0}
                    />
                    <FormControlLabel value={false} onChange={callOffAllRemainingFalse} label={partLabel}
                                      control={<Radio sx={{ml: 2}}/>}
                                      labelPlacement="end"/>
                    <CallOffButton callOffItemIndex={callOffItemIndex} isEditable/>
                </RadioGroup> : <QuantityDescription/>}
        </TableCell>
        <TableCell>
            <Typography>{callOff.quantityRemaining}</Typography>
        </TableCell>
        <TableCell>{eventsFor(callOff.events)}</TableCell>
        <TableCell>
            <DeleteButton callOffItemIndex={callOffItemIndex} isEditable={quantityEditable}/>
            <EditButton isEditable={quantityEditable && !editQuantity}/>
        </TableCell>
    </TableRow>;
}
