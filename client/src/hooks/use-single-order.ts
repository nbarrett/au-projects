import { WithUid } from "../models/common-models";
import { find, findAll, remove, save } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Order, OrderItem, OrderStatus, OrderStatusDescriptions } from "../models/order-models";
import { orderState } from "../atoms/order-atoms";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import set from "lodash/set";
import isUndefined from "lodash/isUndefined";
import { nowAsValue } from "../util/dates";
import { collection } from "./use-orders";
import { newDocument } from "../mappings/document-mappings";
import useCurrentUser from "./use-current-user";

export default function useSingleOrder() {
    const currentUser = useCurrentUser();
    const [document, setDocument] = useRecoilState<WithUid<Order>>(orderState);
    const reset = useResetRecoilState(orderState);

    useEffect(() => {
        log.debug("Order change:", document);
    }, [document]);

    function saveOrder(order: WithUid<Order>, orderStatus?: OrderStatus): Promise<any> {
        if (isUndefined(orderStatus)) {
            log.debug("saving order with existing status", OrderStatusDescriptions[order.data.status]);
            return save<Order>(collection, order);
        } else {
            log.debug("saving order and changing status to", OrderStatusDescriptions[orderStatus]);
            const document = mutableOrder(order);
            document.data.status = orderStatus;
            return save<Order>(collection, document);
        }
    }

    function deleteOrder(order: WithUid<Order>): Promise<any> {
        log.debug("deleting order with existing status", OrderStatusDescriptions[order.data.status]);
        return remove<Order>(collection, order.uid);
    }

    async function newOrderNumber(): Promise<number> {
        const all = await findAll<Order>(collection);
        return (max<number>(all.map(item => item.data.orderNumber)) || 0) + 1;
    }

    function findOrder(uid: string): void {
        find<Order>(collection, uid).then((response) => {
            log.debug("response was:", response);
            setDocument(response);
        });
    }

    function mutableOrder(order?: WithUid<Order>): WithUid<Order> {
        return cloneDeep(order || document);
    }

    function changeField(order: WithUid<Order>, field: string, value: any) {
        log.debug("change:field:", field, "value:", value, "typeof:", typeof value);
        const mutable = mutableOrder(order);
        set(mutable, field, value);
        setDocument(mutable);
    }

    function changeOrderItemField(order: WithUid<Order>, index: number, field: string, value: any) {
        log.debug("changeOrderItemField:index", index, "field:", field, "value:", value, "typeof:", typeof value);
        const mutable: WithUid<Order> = mutableOrder(order);
        mutable.data.items[index][field] = value;
        setDocument(mutable);
    }

    function deleteOrderItem(order: WithUid<Order>, index: number) {
        log.debug("deleteOrderItem:index:", index);
        const mutable: WithUid<Order> = mutableOrder(order);
        mutable.data.items = mutable.data.items.filter((item, itemIndex) => {
            log.debug("deleteOrderItem:itemIndex:", itemIndex, "index", index);
            return itemIndex !== index;
        });
        setDocument(mutable);
    }

    async function addOrder(status?: OrderStatus) {
        const order = mutableOrder(newDocument<Order>());
        order.data.orderNumber = await newOrderNumber();
        order.data.companyId = currentUser.document.data.companyId;
        order.data.createdBy = currentUser.document.uid;
        order.data.createdAt = nowAsValue();
        order.data.status = status || OrderStatus.NEW;
        order.data.items = [];
        addLineItem(order);
    }

    function resetAndMarkForDelete() {
        reset();
        const order = mutableOrder();
        order.markedForDelete = true;
        setDocument(order)
    }

    function addLineItem(order: WithUid<Order>) {
        const orderItem: OrderItem = {};
        const mutable = mutableOrder(order);
        orderItem.createdAt = nowAsValue();
        orderItem.createdBy = currentUser.document.uid;
        orderItem.quantity = 1;
        mutable.data.updatedAt = nowAsValue();
        mutable.data.updatedBy = currentUser.document.uid;
        mutable.data.updatedBy = currentUser.document.uid;
        mutable.data.items.push(orderItem);
        log.debug("addLineItem:mutable:", mutable);
        setDocument(mutable);
    }

    return {
        reset,
        resetAndMarkForDelete,
        addLineItem,
        addOrder,
        findOrder,
        saveOrder,
        deleteOrder,
        document,
        setDocument,
        changeField,
        changeOrderItemField,
        deleteOrderItem
    };

}
