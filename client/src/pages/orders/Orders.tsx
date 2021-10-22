import {
    Card,
    CardHeader,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { WithUid } from "../../models/common-models";
import { Order, OrderStatus, OrderStatusDescriptions } from "../../models/order-models";
import useSingleOrder, { UseSingleOrder } from "../../hooks/use-single-order";
import { log } from "../../util/logging-config";
import useCompanyData, { CompanyData } from "../../hooks/use-company-data";
import useOrders, { UseOrders } from "../../hooks/use-orders";
import { useRecoilValue } from "recoil";
import { Helmet } from "react-helmet";
import { contentContainer } from "../../admin/components/GlobalStyles";
import OrderTabs from "./OrderTabs";
import { applyDocumentToOrderHistory, documentExistsIn } from "../../mappings/order-mappings";
import { orderTabState } from "../../atoms/order-atoms";
import TableContainer from "@mui/material/TableContainer";
import { sortBy } from "../../util/arrays";
import useCurrentUser from "../../hooks/use-current-user";
import { ExpandableOrderRow } from "./ExpandableOrderRow";

export function Orders() {
    const currentUser = useCurrentUser();
    const singleOrder: UseSingleOrder = useSingleOrder();
    const orders: UseOrders = useOrders();
    const [filteredOrderHistory, setFilteredOrderHistory] = useState<WithUid<Order>[]>([]);
    const companies: CompanyData = useCompanyData();
    const orderTabValue = useRecoilValue<OrderStatus>(orderTabState);
    const sortByColumn = "-data.orderNumber";

    useEffect(() => {
        orders.refreshOrders();
    }, [currentUser.document.data?.companyId]);

    useEffect(() => {
        const filtered = applyDocumentToOrderHistory(orders.allOrderHistory, singleOrder.document).filter(order => order.data.status === orderTabValue);
        log.debug("setting singleOrder history to all", OrderStatusDescriptions[orderTabValue], "orders:", filtered.length, "of", orders.allOrderHistory.length, "shown");
        setFilteredOrderHistory(filtered.sort(sortBy(sortByColumn)));
        if ((singleOrder.document.data.status === OrderStatus.NEW && !documentExistsIn(orders.allOrderHistory, singleOrder.document)) || singleOrder.document.markedForDelete) {
            orders.setAllOrderHistory(applyDocumentToOrderHistory(orders.allOrderHistory, singleOrder.document).sort(sortBy(sortByColumn)));
            if (singleOrder.document.markedForDelete) {
                singleOrder.reset();
            }
        }
    }, [singleOrder.document, orders.allOrderHistory, orderTabValue]);


    return (
        <>
            <Helmet>
                <title>Orders | AU Projects</title>
            </Helmet>
            <Grid sx={contentContainer} container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={
                            <OrderTabs/>}/>
                        <TableContainer>
                            <Table size={"small"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell sx={{width: 20}}>Company Order Number</TableCell>
                                        <TableCell sx={{width: 20}}>
                                            <Tooltip enterDelay={300} title="Sort">
                                                <TableSortLabel active direction="desc">
                                                    AU Order Number
                                                </TableSortLabel>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Updated</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Created By</TableCell>
                                        <TableCell sx={{width: 20}}>Call off Summary</TableCell>
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
                                            singleOrder={singleOrder} companies={companies}
                                            key={orderKey} order={order} orders={orders}/>;
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

