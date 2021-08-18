import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Card,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  MenuItem,
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
import { Order, OrderItem, OrderStatusDescriptions } from "../../models/order-models";
import AddchartIcon from "@material-ui/icons/Addchart";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
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
import { kgPerRoll, lineItemCost, pricePerRoll, totalPerLine } from "../../mappings/order-mappings";
import sum from "lodash/sum";
import range from "lodash/range";
import { asCurrency, pricePerKg } from "../../mappings/product-mappings";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import useProductCoding from "../../hooks/use-product-coding";
import useProducts from "../../hooks/use-products";
import { PricedProduct, Product } from "../../models/product-models";
import { Company } from "../../models/company-models";
import usePricedProducts from "../../hooks/use-priced-products";
import { Helmet } from "react-helmet";
import { contentContainer } from "../../admin/components/GlobalStyles";
import Button from "@material-ui/core/Button";
import { useSnackbarNotification } from "../../snackbarNotification";

export function Orders(props) {
  const allUsers = useAllUsers();
  const order = useSingleOrder();
  const orders = useOrders();
  const products = useProducts();
  const [orderHistory, setOrderHistory] = useState<WithUid<Order>[]>([]);
  const companies = useCompanyData();
  const userData = useRecoilValue<UserData>(currentUserDataState);
  const productCodings = useProductCoding(false);
  const company: WithUid<Company> = companies.companyForUid(order.document?.data?.companyId);
  const pricedProducts = usePricedProducts(company);
  const notification = useSnackbarNotification();

  useEffect(() => {
    if (userData.companyId) {
      orders.findOrdersForCompany(userData.companyId).then(setOrderHistory);
    }
  }, []);

  useEffect(() => {
    log.info("document:", order.document);
    if (order.document?.data?.orderNumber) {
      if (!orderHistory.map(item => item.data.orderNumber).includes(order.document.data.orderNumber)) {
        setOrderHistory([order.document].concat(orderHistory));
      } else {
        setOrderHistory(orderHistory.map(item => item.data.orderNumber === order.document?.data?.orderNumber ? order.document : item));
      }
    }
  }, [order.document]);

  const orderButtons =
      <>
        <IconButton onClick={() => order.addOrder()}>
          <Tooltip title={`New Order`}>
            <AddchartIcon color="action"/>
          </Tooltip>
        </IconButton>
        <IconButton onClick={() => {
          order.saveOrder().then(() => notification.success(`Saved Order`));
        }}>
          <Tooltip title={`Save all changes`}>
            <SaveIcon color="primary"/>
          </Tooltip>
        </IconButton>
      </>;


  function OrderRow(props: { company: WithUid<Company>, order: WithUid<Order>, open: boolean, toggleOpen: () => void }) {
    return <TableRow sx={{"& > *": {borderBottom: "unset"}}} onClick={() => {
      log.info("clicked order:", props.order, "persisted order:", order.document);
      if (order.document.data.orderNumber !== props.order.data.orderNumber) {
        log.info("selecting order:", props.order, "persisted order:", order.document);
        order.setDocument(props.order);
      } else {
        log.info("already selected order:", props.order, "persisted order:", order.document);
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
      <TableCell>
        {asDateTime(props.order.data.createdAt).toFormat("dd-MMM-yyyy")}
      </TableCell>
      <TableCell>{props.order.data.orderNumber}</TableCell>
      <TableCell>
        {props.order.data.updatedAt ? asDateTime(props.order.data.updatedAt).toFormat("dd-MMM-yyyy") : null}
      </TableCell>
      <TableCell>{props.company?.data?.name || ""}</TableCell>
      <TableCell>{fullNameForUser(allUsers.userForUid(props.order.data?.createdBy))}</TableCell>
      <TableCell>
        <Chip color="primary" label={OrderStatusDescriptions[props.order.data.status]} size="small"/>
      </TableCell>
      <TableCell>
        {props.order.data.items.length}
      </TableCell>
      <TableCell>
        {asCurrency(sum(props.order.data.items.map(item => lineItemCost(item))))}
      </TableCell>
    </TableRow>;
  }

  function ProductLookup(props: { index: number, value: string, company: WithUid<Company> }) {
    return <Autocomplete
        fullWidth
        disableClearable
        size={"small"}
        value={props.value}
        getOptionLabel={(product: WithUid<PricedProduct>) => {
          return productCodings.productCode(product?.data);
        }}
        onChange={(event, value: WithUid<PricedProduct>) => {
          log.info("Autocomplete changed:", value);
          order.changeOrderItemField(props.index, "productId", value.uid);
        }}
        options={pricedProducts.documents() || []}
        renderInput={(params: AutocompleteRenderInputParams) =>
            <TextField  {...params}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password",
                        }}
                        fullWidth
                        type={"string"}
                        onChange={(event: any) => {
                          log.info("input changed:", event.target.value);
                        }}
                        value={props.value}
                        name={"product"}
                        label={"Select Product"}
                        variant={"outlined"}/>}/>;
  }

  function OrderLineItems(props: { company: WithUid<Company>, order: WithUid<Order>, open: boolean }) {
    log.info("company", props.company);
    return <TableRow>
      <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={9}>
        <Collapse in={props.open} timeout="auto" unmountOnExit>
          <Box sx={{margin: 1}}>
            <Typography variant="h4" gutterBottom component="div">
              Order {props.order.data.orderNumber} Details {<IconButton onClick={() => order.addLineItem()}>
              <Tooltip title={`Add Line Item`}>
                <AddchartIcon color="action"/>
              </Tooltip>
            </IconButton>}
            </Typography>
            <Table size="small" aria-label="order details">
              <TableHead>
                <TableRow>
                  <TableCell>Line Number</TableCell>
                  <TableCell>Product Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Specific Gravity</TableCell>
                  <TableCell align="right">Thickness (mm)</TableCell>
                  <TableCell align="right">Width (mm)</TableCell>
                  <TableCell align="right">Length (m)</TableCell>
                  <TableCell align="right">Kg Per Roll</TableCell>
                  <TableCell align="right">Price Per Kg</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price Per Roll</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.order.data.items.map((orderItem: OrderItem, index) => <OrderLineItem key={index}
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
    const product: WithUid<Product> = products.findProduct(props.orderItem.productId);
    const perRollKg = kgPerRoll(props.orderItem, product?.data);
    const perKg = pricePerKg(product);
    const perRollPrice = pricePerRoll(perRollKg, perKg);
    return (
        <TableRow key={props.index}>
          <TableCell>{props.index + 1}</TableCell>
          {product ?
              <>
                <TableCell width={150}>{productCodings.productCode(product?.data)}</TableCell>
                <TableCell width={300}>{productCodings.productDescription(product?.data)}</TableCell>
                <TableCell width={150} align="right">{product?.data?.specificGravity}</TableCell>
                <TableCell width={150} align="right">
                  <Thickness value={props.orderItem.thickness} index={props.index}/>
                </TableCell>
                <TableCell width={150} align="right">
                  <Widths value={props.orderItem.width} index={props.index}/>
                </TableCell>
                <TableCell width={150} align="right">
                  <Lengths value={props.orderItem.length} index={props.index}/>
                </TableCell>
                <TableCell width={150} align="right">{asCurrency(perRollKg)}</TableCell>
                <TableCell width={150} align="right">{asCurrency(perKg)}</TableCell>
                <TableCell width={150} align="right">
                  <TextField fullWidth size={"small"}
                             type={"number"}
                             onChange={(event: any) => {
                               log.info("input changed:", event.target.value);
                               order.changeOrderItemField(props.index, "quantity", +event.target.value);
                             }}
                             value={props.orderItem.quantity || ""}
                             name={"quantity"}
                             variant={"outlined"}/>
                </TableCell>
                <TableCell width={150} align="right">
                  {asCurrency(perRollPrice)}
                </TableCell>
                <TableCell width={150} align="right">
                  {asCurrency(totalPerLine(props.orderItem.quantity, perRollPrice))}
                </TableCell>
              </> :
              <TableCell colSpan={11}><ProductLookup index={props.index}
                                                     value={props.orderItem.productId}
                                                     company={props.company}/></TableCell>}
        </TableRow>
    );
  }

  function ExpandableOrderRow(props: { order: WithUid<Order> }) {
    const [open, setOpen] = useState(props.order.data.orderNumber === order.document.data.orderNumber);
    const toggleOpen = () => setOpen(!open);
    useEffect(() => {
      log.info("ExpandableOrderRow:initial render:open", open);
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

          </Grid>
          <Grid item xs={12}>
            <Card {...props}>
              <CardHeader
                  title={<Typography color="textSecondary" variant="h2">Orders
                    ({orderHistory.length})</Typography>}/>
              <Divider/>
              <Box sx={{width: "100%"}}>
                <Table size={"small"}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{orderButtons}</TableCell>
                      <TableCell sortDirection="desc">
                        <Tooltip enterDelay={300} title="Sort">
                          <TableSortLabel active direction="desc">
                            Created
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell>Order Number</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Line Items</TableCell>
                      <TableCell>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderHistory.map((order: WithUid<Order>, index) => {
                      const orderKey = `order-${index}-${order.data.orderNumber}`;
                      log.info("orderKey:", orderKey);
                      return <ExpandableOrderRow
                          key={orderKey} order={order}/>;
                    })}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}>
                <Button color="primary"
                        endIcon={<ArrowRightIcon/>}
                        size="small"
                        variant="text">View all</Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </>
  );
}

