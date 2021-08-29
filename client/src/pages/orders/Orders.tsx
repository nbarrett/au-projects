import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    Card,
    CardHeader,
    Chip,
    ClickAwayListener,
    Collapse,
    Grid,
    IconButton,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { asDateTime } from "../../util/dates";
import React, { useEffect, useState } from "react";
import { WithUid } from "../../models/common-models";
import { Order, OrderItem, OrderStatus, OrderStatusDescriptions } from "../../models/order-models";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import useSingleOrder from "../../hooks/use-single-order";
import { log } from "../../util/logging-config";
import useCompanyData from "../../hooks/use-company-data";
import { fullNameForUser } from "../../util/strings";
import useUsers from "../../hooks/use-users";
import useOrders from "../../hooks/use-orders";
import { useRecoilValue } from "recoil";
import sum from "lodash/sum";
import max from "lodash/max";
import range from "lodash/range";
import { asCurrency, asKg } from "../../mappings/product-mappings";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import useProductCoding from "../../hooks/use-product-coding";
import { PricedProduct, Product } from "../../models/product-models";
import { Company } from "../../models/company-models";
import usePricedProducts from "../../hooks/use-priced-products";
import { Helmet } from "react-helmet";
import { contentContainer } from "../../admin/components/GlobalStyles";
import { useSnackbarNotification } from "../../snackbarNotification";
import MenuItem from "@material-ui/core/MenuItem";
import OrderTabs from "./OrderTabs";
import DeleteIcon from "@material-ui/icons/Delete";
import {
    applyDocumentToOrderHistory,
    cancellable,
    deletable,
    documentExistsIn,
    editable,
    totalPerLine
} from "../../mappings/order-mappings";
import { orderTabState } from "../../atoms/order-atoms";
import TableContainer from "@material-ui/core/TableContainer";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import UndoIcon from "@material-ui/icons/Undo";
import { sortBy } from "../../util/arrays";
import useCurrentUser from "../../hooks/use-current-user";

export function Orders(props) {
    const users = useUsers();
    const currentUser = useCurrentUser();
    const order = useSingleOrder();
    const orders = useOrders();
    const [filteredOrderHistory, setFilteredOrderHistory] = useState<WithUid<Order>[]>([]);
    const [allOrderHistory, setAllOrderHistory] = useState<WithUid<Order>[]>([]);
    const companies = useCompanyData();
    const productCodings = useProductCoding(false);
    const notification = useSnackbarNotification();
    const orderTabValue = useRecoilValue<OrderStatus>(orderTabState);
    const sortByColumn = "-data.orderNumber";
    const classes = makeStyles((theme: Theme) => ({
        orderItemsHeading: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "1.5",
        },
    }))({});

    function refreshOrderView(): Promise<void> {
        if (currentUser.document.data?.companyId) {
            log.debug("refreshing order view");
            return orders.findOrdersForCompany(currentUser.document.data?.companyId).then(setAllOrderHistory);
        } else {
            return Promise.resolve();
        }
    }

    useEffect(() => {
        refreshOrderView();
    }, [currentUser.document.data?.companyId]);

    useEffect(() => {
        const filtered = applyDocumentToOrderHistory(allOrderHistory, order.document).filter(order => order.data.status === orderTabValue);
        log.debug("setting order history to all", OrderStatusDescriptions[orderTabValue], "orders:", filtered.length, "of", allOrderHistory.length, "shown");
        setFilteredOrderHistory(filtered.sort(sortBy(sortByColumn)));
        if ((order.document.data.status === OrderStatus.NEW && !documentExistsIn(allOrderHistory, order.document)) || order.document.markedForDelete) {
            setAllOrderHistory(applyDocumentToOrderHistory(allOrderHistory, order.document).sort(sortBy(sortByColumn)));
            if (order.document.markedForDelete) {
                order.reset();
            }
        }
    }, [order.document, allOrderHistory, orderTabValue]);

    function DeleteButton(props: { index: number, isEditable: boolean, order: WithUid<Order> }) {
        return <IconButton disabled={!props.isEditable}
                           onClick={() => {
                               order.deleteOrderItem(props.order, props.index);
                           }}>
            <Tooltip title={`Delete line item`}><DeleteIcon
                color={props.isEditable ? "secondary" : "disabled"}/></Tooltip>
        </IconButton>;
    }

    function lineItemCost(pricedProducts, orderItem: OrderItem) {
        return pricedProducts.lineItemPricing(orderItem).lineItemTotal;
    }

    function saveOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        order.saveOrder(currentOrder, OrderStatus.DRAFT).then(refreshOrderView).then(() => notification.success(`Order ${orderNumber} was saved`));
    }

    function undoOrderChanges(currentOrder: WithUid<Order>) {
        if (currentOrder.uid) {
            order.findOrder(currentOrder.uid);
        } else {
            order.resetAndMarkForDelete();
        }
    }

    function cancelOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        order.saveOrder(currentOrder, OrderStatus.CANCELLED).then(refreshOrderView).then(() => notification.success(`Order ${orderNumber} was cancelled`));
    }

    function deleteOrder(currentOrder: WithUid<Order>) {
        const orderNumber = currentOrder.data.orderNumber;
        order.deleteOrder(currentOrder).then(refreshOrderView).then(() => notification.success(`Order ${orderNumber} was deleted`));
    }

    function addLineItem(currentOrder: WithUid<Order>) {
        order.addLineItem(currentOrder);
    }

    function OrderRow(props: { company: WithUid<Company>, order: WithUid<Order>, open: boolean, toggleOpen: () => void, pricedProducts:any }) {
        const isEditable = editable(props.order?.data?.status);
        const isCancellable = cancellable(props.order?.data?.status);
        const isDeletable = deletable(props.order?.data?.status);

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
                <Chip color="primary" label={OrderStatusDescriptions[props.order.data.status]} size="small"/>
            </TableCell>
            <TableCell>
                {props.order?.data?.items?.length}
            </TableCell>
            <TableCell>
                {asCurrency(sum(props.order?.data?.items?.map(item => lineItemCost(props.pricedProducts, item))))}
            </TableCell>
            <TableCell>
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
            </TableCell>
        </TableRow>;
    }

    function ProductLookup(props: { order: WithUid<Order>, options: WithUid<PricedProduct>[], index: number, value: WithUid<Product>, company: WithUid<Company>, toggleProductLookup: () => void }) {

        function onDismiss(reason: string) {
            log.debug("onDismiss:", reason, "product", props.value);
            if (props.value) {
                // setOpen(false);
                props.toggleProductLookup();
            }
        }

        return <ClickAwayListener onClickAway={() => onDismiss("click away")}>
            <Autocomplete
                fullWidth
                open
                disableClearable
                onClose={() => onDismiss("onClose")}
                size={"small"}
                value={props.value}
                isOptionEqualToValue={(option: WithUid<Product>, value: WithUid<Product>) => {
                    log.debug("isOptionEqualToValue:option:", option, "value:", value);
                    return option.uid === value.uid;
                }}
                onChange={(event, value: WithUid<PricedProduct>) => {
                    log.debug("Autocomplete changed:", value);
                    order.changeOrderItemField(props.order, props.index, "productId", value.uid);
                }}
                getOptionLabel={(product: WithUid<PricedProduct>) => {
                    const label = productCodings.productCode(product?.data);
                    log.debug("getOptionLabel:", label);
                    return label;
                }}
                renderOption={(props, product: WithUid<PricedProduct>, {selected}) => {
                    return <li {...props}><ListItemText key={product?.uid}
                                                        primary={productCodings.productCode(product?.data)}
                                                        secondary={productCodings.productDescription(product?.data) + ", Specific Gravity: " + product.data.specificGravity}/>
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

    function OrderLineItems(props: { company: WithUid<Company>, order: WithUid<Order>, open: boolean, pricedProducts:any }) {
        log.debug("company", props.company);
        return <TableRow sx={{"& > *": {borderTop: "none"}}}>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={12}>
                <Collapse in={props.open} timeout="auto" unmountOnExit>
                    <Box sx={{marginTop: 2, marginBottom: 8}}>
                        <Typography variant="h5" className={classes.orderItemsHeading} gutterBottom component="div">
                            Order {props.order?.data?.orderNumber} Line Items
                        </Typography>
                        <Table size="small" aria-label="order details">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Line</TableCell>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Specific Gravity</TableCell>
                                    <TableCell align="right">Thickness (mm)</TableCell>
                                    <TableCell align="right">Width (mm)</TableCell>
                                    <TableCell align="right">Length (m)</TableCell>
                                    <TableCell align="right">Kg Per Roll</TableCell>
                                    <TableCell align="right">Price Per Kg</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Price Per Roll</TableCell>
                                    <TableCell align="right">Total Price</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.order?.data?.items?.map((orderItem: OrderItem, index) => <OrderLineItem
                                    pricedProducts={props.pricedProducts}
                                    key={index}
                                    order={props.order}
                                    company={props.company}
                                    orderItem={orderItem}
                                    index={index}/>)}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>;
    }

    function NumericSelect(props: { value: number; index: number, field: string, values: number[], units: string, disabled: boolean, order: WithUid<Order> }) {
        return <TextField
            select
            disabled={props.disabled}
            size={"small"}
            fullWidth
            value={props.value || ""}
            onChange={(event) => order.changeOrderItemField(props.order, props.index, props.field, +event.target.value)}>
            {props.values.map((option) => (
                <MenuItem key={option} value={option}>
                    {option} {props.units}
                </MenuItem>
            ))}
        </TextField>;
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

    function OrderLineItem(props: { company: WithUid<Company>, orderItem: OrderItem, index: number, order: WithUid<Order>, pricedProducts: any }) {
        const [showProductLookup, setShowProductLookup] = useState<boolean>(!props.orderItem.productId);
        const {kgPerRoll, pricePerKg, pricePerRoll, product} = props.pricedProducts.lineItemPricing(props.orderItem);
        const isEditable = editable(props.order?.data?.status);

        function toggleProductLookup() {
            setShowProductLookup(!showProductLookup);
        }

        return (
            <TableRow key={props.index}>
                <TableCell>{props.index + 1}</TableCell>
                {isEditable && showProductLookup ?
                    <TableCell sx={{minWidth: 300}} colSpan={2}><ProductLookup options={props.pricedProducts.documents()} order={props.order}
                                                          index={props.index}
                                                          value={product}
                                                          toggleProductLookup={toggleProductLookup}
                                                          company={props.company}/></TableCell> : <>
                        <TableCell sx={{cursor: "pointer"}} onClick={toggleProductLookup}>
                            <ListItemText sx={{minWidth: 300}} key={product?.uid}
                                          primary={productCodings.productCode(product?.data)}
                                          secondary={productCodings.productDescription(product?.data)}/>
                        </TableCell>
                        <TableCell sx={{cursor: "pointer"}} onClick={toggleProductLookup}
                                   align="right">{product?.data?.specificGravity}</TableCell>
                    </>}
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
                    <TextField disabled={!isEditable} sx={{width: 70}} size={"small"}
                               type={"number"}
                               onChange={(event: any) => {
                                   log.debug("input changed:", event.target.value);
                                   order.changeOrderItemField(props.order, props.index, "quantity", max([+event.target.value, 1]));
                               }}
                               value={props.orderItem.quantity || ""}
                               name={"quantity"}
                               variant={"outlined"}/>
                </TableCell>
                <TableCell align="right">
                    <Typography noWrap>{asCurrency(pricePerRoll)}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography noWrap>{asCurrency(totalPerLine(props.orderItem.quantity, pricePerRoll))}</Typography>
                </TableCell>
                <TableCell>
                    <DeleteButton order={props.order} index={props.index} isEditable={isEditable}/>
                </TableCell>
            </TableRow>
        );
    }

  function ExpandableOrderRow(props: { order: WithUid<Order> }) {
      const [open, setOpen] = useState(props.order?.data?.orderNumber === order.document.data.orderNumber);
      const company: WithUid<Company> = companies.companyForUid(props.order?.data?.companyId);
      const pricedProducts = usePricedProducts(company);
      const toggleOpen = () => setOpen(!open);
      useEffect(() => {
          log.debug("ExpandableOrderRow:initial render:open", open);
      }, []);

      return (
          <>
              <OrderRow open={open} order={props.order} company={company} pricedProducts={pricedProducts}
                        toggleOpen={toggleOpen}/>
              <OrderLineItems open={open} order={props.order} company={company} pricedProducts={pricedProducts}/>
          </>
      );
  }

  return (
      <>
          <Helmet>
              <title>Orders | AU Projects</title>
          </Helmet>
          <Grid sx={contentContainer} container spacing={3}>
              <Grid item xs={12}>
                  <Card {...props}>
                      <CardHeader title={
                          <OrderTabs orderHistory={allOrderHistory}/>}/>
                      <TableContainer>
                          <Table size={"small"}>
                              <TableHead>
                                  <TableRow>
                                      <TableCell/>
                                      <TableCell><Tooltip enterDelay={300} title="Sort">
                                          <TableSortLabel active direction="desc">
                                              Order Number
                                          </TableSortLabel>
                                      </Tooltip></TableCell>
                                      <TableCell>Created</TableCell>
                                      <TableCell>Updated</TableCell>
                                      <TableCell>Company</TableCell>
                                      <TableCell>Created By</TableCell>
                                      <TableCell>Status</TableCell>
                                      <TableCell>Line Items</TableCell>
                                      <TableCell>Cost</TableCell>
                                      <TableCell>Actions</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {filteredOrderHistory.map((order: WithUid<Order>, index) => {
                                      const orderKey = `index-${index}-order-${order.data.orderNumber}`;
                                      log.debug("orderKey:", orderKey);
                                      return <ExpandableOrderRow
                                          key={orderKey} order={order}/>;
                                  })}
                              </TableBody>
                          </Table>
                      </TableContainer>
                  </Card>
              </Grid>
          </Grid>
      </>
  );
}

