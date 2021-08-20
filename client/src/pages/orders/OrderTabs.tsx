import * as React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { WithUid } from "../../models/common-models";
import { Order, OrderStatus, OrderStatusDescriptions } from "../../models/order-models";
import Badge from "@material-ui/core/Badge";
import { ShoppingCart } from "react-feather";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import { log } from "../../util/logging-config";
import useSingleOrder from "../../hooks/use-single-order";
import { orderTabState } from "../../atoms/order-atoms";
import { useRecoilState } from "recoil";
import max from "lodash/max";

export default function OrderTabs(props: { orderHistory: WithUid<Order>[] }) {
    const order = useSingleOrder();
    const tabValues = [OrderStatus.NEW, OrderStatus.DRAFT, OrderStatus.SUBMITTED, OrderStatus.COMPLETE];
    const [orderTabValue, setOrderTabValue] = useRecoilState<OrderStatus>(orderTabState);
    const classes = makeStyles((theme: Theme) => ({
        tabHeading: {
            textTransform: "none",
        },
        badge: {
            marginLeft: 15
        },
    }))({});

    function changeTabToStatus(newValue: number) {
        log.info("tab selected:", newValue);
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
        return <Tab value={0}
                    onClick={() => {
                        changeTabToStatus(-1);
                        order.addOrder();
                    }}
                    className={classes.tabHeading}
                    label={<BadgeHeading selected={tabIndex() === 0} title={"Create New Order"}
                                         count={0}/>}/>;
    }

    function BadgedTab(props: { orderHistory: WithUid<Order>[], status: OrderStatus }) {
        const count = props.orderHistory.filter(item => item.data.status === props.status).length;
        const tabValue = tabValues.indexOf(props.status);
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
            <NewOrderTab/>
            <BadgedTab orderHistory={props.orderHistory} status={OrderStatus.DRAFT}/>
            <BadgedTab orderHistory={props.orderHistory} status={OrderStatus.SUBMITTED}/>
            <BadgedTab orderHistory={props.orderHistory} status={OrderStatus.CANCELLED}/>
            <BadgedTab orderHistory={props.orderHistory} status={OrderStatus.COMPLETE}/>
        </Tabs>
    );
}
