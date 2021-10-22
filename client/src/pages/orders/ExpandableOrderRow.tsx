import { WithUid } from "../../models/common-models";
import { Order } from "../../models/order-models";
import React, { useEffect, useState } from "react";
import { Company } from "../../models/company-models";
import usePricedProducts from "../../hooks/use-priced-products";
import { log } from "../../util/logging-config";
import { OrderRow } from "./OrderRow";
import { CompanyData } from "../../hooks/use-company-data";
import { UseSingleOrder } from "../../hooks/use-single-order";
import { OrderLineItems } from "./OrderLineItems";
import { UseOrders } from "../../hooks/use-orders";

export function ExpandableOrderRow(props: { orders: UseOrders, order: WithUid<Order>, companies: CompanyData, singleOrder: UseSingleOrder }) {
    const [open, setOpen] = useState(props.order?.data?.orderNumber === props.singleOrder.document.data.orderNumber);
    const company: WithUid<Company> = props.companies.companyForUid(props.order?.data?.companyId);
    const pricedProducts = usePricedProducts(company);
    const toggleOpen = () => setOpen(!open);
    useEffect(() => {
        log.debug("ExpandableOrderRow:initial render:open", open);
    }, []);

    return (
        <>
            <OrderRow useOrders={props.orders} open={open} order={props.order} company={company}
                      pricedProducts={pricedProducts}
                      toggleOpen={toggleOpen} singleOrder={props.singleOrder}/>
            <OrderLineItems open={open} order={props.order} company={company} pricedProducts={pricedProducts}
                            singleOrder={props.singleOrder}/>
        </>
    );
}
