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
import AddchartIcon from "@material-ui/icons/Addchart";
import SaveIcon from "@material-ui/icons/Save";
import useSingleOrder from "../../hooks/use-single-order";
import { log } from "../../util/logging-config";
import useCompanyData from "../../hooks/use-company-data";
import { fullNameForUser } from "../../util/strings";
import useAllUsers from "../../hooks/use-all-users";
import useOrders from "../../hooks/use-orders";
import { useRecoilValue } from "recoil";
import { UserData } from "../../models/user-models";
import { currentUserDataState } from "../../atoms/user-atoms";
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
import { editable, totalPerLine } from "../../mappings/order-mappings";
import { orderTabState } from "../../atoms/order-atoms";
import TableContainer from "@material-ui/core/TableContainer";
import CancelIcon from "@material-ui/icons/Cancel";

export function Orders(props) {
    const allUsers = useAllUsers();
    const order = useSingleOrder();
    const orders = useOrders();
    const [orderHistory, setOrderHistory] = useState<WithUid<Order>[]>([]);
    const [allOrderHistory, setAllOrderHistory] = useState<WithUid<Order>[]>([]);
    const companies = useCompanyData();
    const userData = useRecoilValue<UserData>(currentUserDataState);
    const productCodings = useProductCoding(false);
    const company: WithUid<Company> = companies.companyForUid(order.document?.data?.companyId);
    const pricedProducts = usePricedProducts(company);
    const notification = useSnackbarNotification();
    const orderTabValue = useRecoilValue<OrderStatus>(orderTabState);

    useEffect(() => {
        if (userData.companyId) {
            orders.findOrdersForCompany(userData.companyId).then(setAllOrderHistory);
        }
    }, [userData.companyId]);

    useEffect(() => {
        log.info("document:", order.document, "orderTabValue", orderTabValue);
        if (orderTabValue === OrderStatus.NEW) {
            log.info("setting order history to single document:", order.document);
            setOrderHistory([order.document]);
        } else {
            const history = allOrderHistory.filter(order => order.data.status === orderTabValue);
            log.info("setting order history to all", OrderStatusDescriptions[orderTabValue], "orders:", history);
            setOrderHistory(history);
        }

    }, [order.document, allOrderHistory]);

    function DeleteButton(props: { index: number }) {
        const isEditable = editable(order.document?.data?.status);
        return <IconButton disabled={!isEditable}
                           onClick={() => {
                               order.deleteOrderItem(props.index);
                           }}>
            <Tooltip title={`Delete line item`}><DeleteIcon
                color={isEditable ? "secondary" : "disabled"}/></Tooltip>
        </IconButton>;
    }

    function lineItemCost(orderItem: OrderItem) {
        return pricedProducts.lineItemPricing(orderItem).lineItemTotal;
    }

    function OrderRow(props: { company: WithUid<Company>, order: WithUid<Order>, open: boolean, toggleOpen: () => void }) {
        return <TableRow sx={{"& > *": {borderBottom: "unset"}}} onClick={() => {
            log.debug("clicked order:", props.order, "persisted order:", order.document);
            if (order.document.data.orderNumber !== props.order.data.orderNumber) {
                log.debug("selecting order:", props.order, "persisted order:", order.document);
                order.setDocument(props.order);
            } else {
                log.debug("already selected order:", props.order, "persisted order:", order.document);
            }
        }}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={props.toggleOpen}
                >
                    {props.open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
            </TableCell>
            <TableCell>{props.order.data.orderNumber}</TableCell>
            <TableCell>
                {asDateTime(props.order.data.createdAt).toFormat("dd-MMM-yyyy")}
            </TableCell>
            <TableCell>
                {props.order.data.updatedAt ? asDateTime(props.order.data.updatedAt).toFormat("dd-MMM-yyyy") : null}
            </TableCell>
            <TableCell>{props.company?.data?.name || ""}</TableCell>
            <TableCell>{fullNameForUser(allUsers.userForUid(props.order.data?.createdBy))}</TableCell>
            <TableCell>
                <Chip color="primary" label={OrderStatusDescriptions[props.order.data.status]} size="small"/>
            </TableCell>
            <TableCell>
                {props.order?.data?.items?.length}
            </TableCell>
            <TableCell>
                {asCurrency(sum(props.order?.data?.items?.map(item => lineItemCost(item))))}
            </TableCell>
            <TableCell>
                <IconButton onClick={() => {
                    const orderNumber = order.document.data.orderNumber;
                    order.saveOrder(OrderStatus.DRAFT).then(() => notification.success(`Saved Order ${orderNumber}`));
                }}>
                    <Tooltip title={`Save changes to order`}>
                        <SaveIcon color="primary"/>
                    </Tooltip>
                </IconButton>
                <IconButton onClick={() => {
                    order.saveOrder(OrderStatus.CANCELLED).then(() => notification.success(`Cancelled Order ${order.document.data.orderNumber}`));
                }}>
                    <Tooltip title={`Cancel order`}>
                        <CancelIcon color="secondary"/>
                    </Tooltip>
                </IconButton>
            </TableCell>
        </TableRow>;
    }

    function ProductLookup(props: { index: number, value: WithUid<Product>, company: WithUid<Company>, toggleProductLookup: () => void }) {

        const [open, setOpen] = useState(true);

        function onDismiss(reason: string) {
            log.info("onDismiss:", reason, "product", props.value);
            if (props.value) {
                // setOpen(false);
                props.toggleProductLookup();
            }
        }

        return <ClickAwayListener onClickAway={() => onDismiss("click away")}>
            <Autocomplete
                fullWidth
                open={true}
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
                    order.changeOrderItemField(props.index, "productId", value.uid);
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
                options={pricedProducts.documents() || []}
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

    function OrderLineItems(props: { company: WithUid<Company>, order: WithUid<Order>, open: boolean }) {
        log.debug("company", props.company);
        return <TableRow>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={12}>
                <Collapse in={props.open} timeout="auto" unmountOnExit>
                    <Box sx={{margin: 1}}>
                        <Typography variant="h4" gutterBottom component="div">
                            Order {props.order?.data?.orderNumber} Details {<IconButton
                            onClick={() => order.addLineItem()}>
                            <Tooltip title={`Add Line Item`}>
                                <AddchartIcon color="action"/>
                            </Tooltip>
                        </IconButton>}
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
                                    key={index}
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

    function NumericSelect(props: { value: number; index: number, field: string, values: number[], units: string }) {
        return <TextField
            select
            size={"small"}
            fullWidth
            value={props.value || ""}
            onChange={(event) => order.changeOrderItemField(props.index, props.field, +event.target.value)}>
            {props.values.map((option) => (
                <MenuItem key={option} value={option}>
                    {option} {props.units}
                </MenuItem>
            ))}
        </TextField>;
    }

    function Thickness(props: { value: number, index: number }) {
        return <NumericSelect value={props.value}
                              field={"thickness"}
                              values={[3, 4, 5, 6, 8, 9, 10, 12]}
                              units={"mm"}
                              index={props.index}/>;
    }

    function Widths(props: { value: number, index: number }) {
        return <NumericSelect value={props.value}
                              field={"width"}
                              values={range(600, 1550, 50).concat(1570)}
                              units={"mm"}
                              index={props.index}/>;
    }

    function Lengths(props: { value: number, index: number }) {
        return <NumericSelect value={props.value}
                              field={"length"}
                              values={range(6, 15, 0.5)}
                              units={"m"}
                              index={props.index}/>;
    }

    function OrderLineItem(props: { company: WithUid<Company>, orderItem: OrderItem, index: number }) {
        const [showProductLookup, setShowProductLookup] = useState<boolean>(!props.orderItem.productId);
        const {kgPerRoll, pricePerKg, pricePerRoll, product} = pricedProducts.lineItemPricing(props.orderItem);

        function toggleProductLookup() {
            setShowProductLookup(!showProductLookup);
        }

        return (
            <TableRow key={props.index}>
                <TableCell>{props.index + 1}</TableCell>
                {showProductLookup ? <TableCell colSpan={2}><ProductLookup index={props.index}
                                                                           value={product}
                                                                           toggleProductLookup={toggleProductLookup}
                                                                           company={props.company}/></TableCell> : <>
                    <TableCell sx={{cursor: "pointer"}} onClick={toggleProductLookup}>
                        <ListItemText sx={{minWidth: 270}} key={product?.uid}
                                      primary={productCodings.productCode(product?.data)}
                                      secondary={productCodings.productDescription(product?.data)}/>
                    </TableCell>
                    <TableCell sx={{cursor: "pointer"}} onClick={toggleProductLookup}
                               align="right">{product?.data?.specificGravity}</TableCell>
                </>}
                <TableCell align="right">
                    <Thickness value={props.orderItem.thickness} index={props.index}/>
                </TableCell>
                <TableCell align="right">
                    <Widths value={props.orderItem.width} index={props.index}/>
                </TableCell>
                <TableCell align="right">
                    <Lengths value={props.orderItem.length} index={props.index}/>
                </TableCell>
                <TableCell align="right"><Typography noWrap>{asKg(kgPerRoll)}</Typography></TableCell>
                <TableCell align="right"><Typography noWrap>{asCurrency(pricePerKg)}</Typography></TableCell>
                <TableCell align="right">
                    <TextField sx={{width: 70}} size={"small"}
                               type={"number"}
                               onChange={(event: any) => {
                                   log.debug("input changed:", event.target.value);
                                   order.changeOrderItemField(props.index, "quantity", max([+event.target.value, 1]));
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
                    <DeleteButton index={props.index}/>
                </TableCell>
            </TableRow>
        );
    }

  function ExpandableOrderRow(props: { order: WithUid<Order> }) {
      const [open, setOpen] = useState(props.order?.data?.orderNumber === order.document.data.orderNumber);
      const toggleOpen = () => setOpen(!open);
      useEffect(() => {
          log.debug("ExpandableOrderRow:initial render:open", open);
      }, []);

      return (
          <>
              <OrderRow open={open} order={props.order} company={company} toggleOpen={toggleOpen}/>
              <OrderLineItems open={open} order={props.order} company={company}/>
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
                                      <TableCell>Order Number</TableCell>
                                      <TableCell sortDirection="desc">
                                          <Tooltip enterDelay={300} title="Sort">
                                              <TableSortLabel active direction="desc">
                                                  Created
                                              </TableSortLabel>
                                          </Tooltip>
                                      </TableCell>
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
                                  {orderHistory.map((order: WithUid<Order>, index) => {
                                      const orderKey = `order-${index}-${order.data.orderNumber}`;
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

