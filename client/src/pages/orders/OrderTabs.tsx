import * as React from "react";
import { useEffect } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { WithUid } from "../../models/common-models";
import Badge from "@mui/material/Badge";
import { ShoppingCart } from "react-feather";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { log } from "../../util/logging-config";
import useSingleOrder from "../../hooks/use-single-order";
import { ordersState, orderTabState } from "../../atoms/order-atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import max from "lodash/max";
import { useUpdateUrl } from "../../hooks/use-url-updating";
import { StoredValue } from "../../util/ui-stored-values";
import { useUrls } from "../../hooks/use-urls";
import { Order, OrderStatus, OrderStatusDescriptions, reportedStatus } from "../../models/order-models";

export default function OrderTabs() {
    const orderHistory = useRecoilValue<WithUid<Order>[]>(ordersState);
    const order = useSingleOrder();
    const updateUrl = useUpdateUrl();
    const urls = useUrls();
    const tabValues = reportedStatus();
    const [orderTabValue, setOrderTabValue] = useRecoilState<OrderStatus>(orderTabState);
    const classes = makeStyles((theme: Theme) => ({
        tabHeading: {
            textTransform: "none",
        },
        badge: {
            marginLeft: 15
        },
    }))({});

    useEffect(() => {
        const initialValue: number = +urls.initialStateFor(StoredValue.TAB);
        log.debug("initialValue:", initialValue);
        if (!Number.isNaN(initialValue)) {
            setOrderTabValue(initialValue);
        }
    }, []);

    useEffect(() => {
        updateUrl({value: orderTabValue, name: StoredValue.TAB});
    }, [orderTabValue]);

    function changeTabToStatus(newValue: number) {
        log.debug("tab selected:", newValue);
        setOrderTabValue(newValue);
    }

    function tabIndex(): number {
        return max([tabValues.indexOf(orderTabValue), 0]);
    }

    function BadgeHeading(props: { selected: boolean, title: string, count: number }) {
        return <Typography className={classes.tabHeading}>{props.title}<Badge className={classes.badge}
                                                                              component={"span"}
                                                                              badgeContent={props.count}
                                                                              color="secondary">
            {props.selected ? <ShoppingCart/> : null}
        </Badge>
        </Typography>;
    }

    function NewOrderTab() {
        const count = orderHistory.filter(item => item.data.status === OrderStatus.NEW).length;
        const selected = orderTabValue === OrderStatus.NEW;
        return <Tab value={count}
                    onClick={() => {
                        changeTabToStatus(OrderStatus.NEW);
                        order.addOrder(OrderStatus.NEW);
                    }}
                    className={classes.tabHeading}
                    label={<BadgeHeading selected={selected} title={"Create New Order"}
                                         count={count}/>}/>;
    }

    function BadgedTab(props: { orderHistory: WithUid<Order>[], status: OrderStatus }) {
        const count = props.orderHistory.filter(item => item.data.status === props.status).length;
        return <Tab disabled={count === 0}
                    onClick={() => changeTabToStatus(props.status)}
                    value={props.status}
                    className={classes.tabHeading}
                    label={<BadgeHeading selected={orderTabValue === props.status}
                                         title={OrderStatusDescriptions[props.status]}
                                         count={count}/>}/>;
    }

    return (
        <Tabs value={tabIndex()} indicatorColor="secondary" variant="fullWidth">
            {reportedStatus().map(status => status === OrderStatus.NEW ? <NewOrderTab key={status}/> :
                <BadgedTab key={status} orderHistory={orderHistory} status={status}/>)}
        </Tabs>
    );
}
