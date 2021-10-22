import { WithUid } from "../../models/common-models";
import { Company } from "../../models/company-models";
import { Order, OrderItem } from "../../models/order-models";
import React, { useEffect, useState } from "react";
import { editable, totalPerLine } from "../../mappings/order-mappings";
import { log } from "../../util/logging-config";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    ClickAwayListener,
    IconButton,
    ListItemIcon,
    ListItemText,
    Stack,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import { asCurrency, asKg } from "../../mappings/product-mappings";
import { NumericInput } from "./NumericInput";
import { PricedProduct, Product } from "../../models/product-models";
import { UseSingleOrder } from "../../hooks/use-single-order";
import useProductCoding from "../../hooks/use-product-coding";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import range from "lodash/range";
import { ShoppingBag as ShoppingBagIcon } from "react-feather";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import max from "lodash/max";
import { CallOffs } from "./CallOffs";

export function OrderLineItem(props: { singleOrder: UseSingleOrder, company: WithUid<Company>, orderItem: OrderItem, index: number, order: WithUid<Order>, pricedProducts: any }) {
    const singleOrder = props.singleOrder;
    const productCodings = useProductCoding(false);
    const [showProductLookup, setShowProductLookup] = useState<boolean>(false);
    const {kgPerRoll, pricePerKg, pricePerRoll, product} = props.pricedProducts.lineItemPricing(props.orderItem);
    const isEditable = editable(props.order?.data?.status);

    function toggleProductLookup() {
        setShowProductLookup(!showProductLookup);
    }

    useEffect(() => {
        log.debug("initial render");
    }, []);

    function ProductLookup(props: { order: WithUid<Order>, options: WithUid<PricedProduct>[], index: number, value: WithUid<Product>, company: WithUid<Company>, toggleProductLookup: () => void }) {

        function onDismiss(reason: string) {
            log.debug("onDismiss:", reason, "product", props.value);
            if (props.value) {
                props.toggleProductLookup();
            }
        }

        return <ClickAwayListener onClickAway={() => onDismiss("click away")}>
            <Autocomplete
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                sx={{minWidth: 200}}
                open={showProductLookup}
                onClose={() => onDismiss("onClose")}
                size={"small"}
                value={props.value}
                isOptionEqualToValue={(option: WithUid<Product>, value: WithUid<Product>) => {
                    log.debug("isOptionEqualToValue:option:", option, "value:", value);
                    return option.uid === value.uid;
                }}
                onChange={(event, value: WithUid<PricedProduct>) => {
                    log.debug("Autocomplete changed:", value);
                    singleOrder.changeOrderItemField(props.order, props.index, "productId", value?.uid);
                }}
                getOptionLabel={(product: WithUid<PricedProduct>) => {
                    const label = productCodings.productCode(product?.data);
                    log.debug("getOptionLabel:", label);
                    return label;
                }}
                renderOption={(props, product: WithUid<PricedProduct>, {selected}) => {
                    const showSecondary = false;
                    return <li{...props} key={product?.uid}><ListItemText
                        primary={productCodings.productCode(product?.data)}
                        secondary={showSecondary ? productCodings.productDescription(product?.data) + ", Specific Gravity: " + product.data.specificGravity : null}/>
                    </li>;
                }}
                options={props.options}
                renderInput={(params: AutocompleteRenderInputParams) =>
                    <TextField  {...params} inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                    }}
                                type={"string"}
                                onChange={(event: any) => {
                                    log.debug("input changed:", event.target.value);
                                }}
                                value={props.value}
                                name={"productId"}
                                label={"Select Product"}
                                variant={"outlined"}/>}
            /></ClickAwayListener>;
    }

    function DeleteButton(props: { orderItem: OrderItem, isEditable: boolean, order: WithUid<Order> }) {
        return <IconButton disabled={!props.isEditable}
                           onClick={() => {
                               singleOrder.deleteOrderItem(props.order, props.orderItem);
                           }}>
            <Tooltip title={`Delete line item`}><DeleteIcon
                color={props.isEditable ? "secondary" : "disabled"}/></Tooltip>
        </IconButton>;
    }

    function CallOffButton(props: { orderItem: OrderItem, isEditable: boolean, order: WithUid<Order> }) {
        return <IconButton disabled={!props.isEditable}
                           onClick={() => {
                               singleOrder.createCallOff(props.order, props.orderItem);
                           }}>
            <Tooltip title={`Call off quantity of line item`}><CallSplitIcon
                color={props.isEditable ? "action" : "disabled"}/></Tooltip>
        </IconButton>;
    }


    function NumericSelect(props: { value: number; index: number, field: string, values: number[], units: string, disabled: boolean, order: WithUid<Order> }) {
        return <TextField
            select
            disabled={props.disabled}
            size={"small"}
            fullWidth
            value={props.value || ""}
            onChange={(event) => singleOrder.changeOrderItemField(props.order, props.index, props.field, +event.target.value)}>
            {props.values.map((option, index) => (
                <MenuItem key={`${option}-${index}`} value={option}>
                    {option} {props.units}
                </MenuItem>
            ))}
        </TextField>;
    }

    function CallOff(props: { value: number, index: number, disabled: boolean, order: WithUid<Order> }) {
        return <NumericSelect order={props.order}
                              disabled={props.disabled}
                              value={props.value}
                              field={"calloff"}
                              values={[3, 4, 5, 6, 8, 9, 10, 12]}
                              units={"mm"}
                              index={props.index}/>;
    }

    function Thickness(props: { value: number, index: number, disabled: boolean, order: WithUid<Order> }) {
        return <NumericSelect order={props.order}
                              disabled={props.disabled}
                              value={props.value}
                              field={"thickness"}
                              values={[3, 4, 5, 6, 8, 9, 10, 12]}
                              units={"mm"}
                              index={props.index}/>;
    }

    function Widths(props: { value: number, index: number, disabled: boolean, order: WithUid<Order> }) {
        return <NumericSelect order={props.order}
                              disabled={props.disabled}
                              value={props.value}
                              field={"width"}
                              values={range(600, 1550, 50).concat(1570)}
                              units={"mm"}
                              index={props.index}/>;
    }

    function Lengths(props: { value: number, index: number, disabled: boolean, order: WithUid<Order> }) {
        return <NumericSelect order={props.order}
                              disabled={props.disabled}
                              value={props.value}
                              field={"length"}
                              values={range(6, 15, 0.5)}
                              units={"m"}
                              index={props.index}/>;
    }

    function onChange(value: number) {
        log.debug("input changed:", value);
        singleOrder.changeOrderItemField(props.order, props.index, "quantity", max([value, 0]));
    }

    return (
        <>
            <TableRow key={props.index}>
                <TableCell>{props.index + 1}</TableCell>
                {isEditable && showProductLookup
                    ? <TableCell>
                        <ProductLookup options={props.pricedProducts.documents()} order={props.order}
                                       index={props.index}
                                       value={product}
                                       toggleProductLookup={toggleProductLookup}
                                       company={props.company}/>
                    </TableCell>
                    : <>
                        <TableCell sx={{cursor: "pointer"}} onClick={toggleProductLookup}>
                            {props.orderItem.productId ? <ListItemText sx={{minWidth: 300}} key={product?.uid}
                                                                       primary={productCodings.productCode(product?.data)}
                                                                       secondary={productCodings.productDescription(product?.data)}/> :
                                <Stack direction="row"
                                       justifyContent="flex-start"
                                       alignItems={"center"}
                                       spacing={1}>
                                    <ListItemIcon sx={{minWidth: 0}}><ShoppingBagIcon/></ListItemIcon>
                                    <ListItemText secondary={"Select Product"}/>
                                </Stack>}
                        </TableCell>
                    </>}
                <TableCell align="right">{product?.data?.specificGravity}</TableCell>
                <TableCell align="right">
                    <Thickness order={props.order} value={props.orderItem.thickness} disabled={!isEditable}
                               index={props.index}/>
                </TableCell>
                <TableCell align="right">
                    <Widths order={props.order} value={props.orderItem.width} disabled={!isEditable}
                            index={props.index}/>
                </TableCell>
                <TableCell align="right">
                    <Lengths order={props.order} value={props.orderItem.length} disabled={!isEditable}
                             index={props.index}/>
                </TableCell>
                <TableCell align="right"><Typography noWrap>{asKg(kgPerRoll)}</Typography></TableCell>
                <TableCell align="right"><Typography noWrap>{asCurrency(pricePerKg)}</Typography></TableCell>
                <TableCell align="right">
                    <NumericInput value={props.orderItem.quantity || 1} onChange={onChange} disabled={!isEditable}/>
                </TableCell>
                <TableCell align="right">
                    <Typography noWrap>{asCurrency(pricePerRoll)}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography noWrap>{asCurrency(totalPerLine(props.orderItem.quantity, pricePerRoll))}</Typography>
                </TableCell>
                <TableCell>
                    <Stack direction={"row"}>
                        <CallOffButton order={props.order} orderItem={props.orderItem} isEditable={isEditable}/>
                        <DeleteButton order={props.order} orderItem={props.orderItem} isEditable={isEditable}/>
                    </Stack>
                </TableCell>
            </TableRow>
            <CallOffs singleOrder={singleOrder} order={props.order} orderItem={props.orderItem}/>
        </>
    );
}
