import { WithUid } from "../models/common-models";
import { find, findAll, remove, save } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Order, OrderItem, OrderStatus, OrderStatusDescriptions } from "../models/order-models";
import { orderState } from "../atoms/order-atoms";
import cloneDeep from "lodash/cloneDeep";
import max from "lodash/max";
import set from "lodash/set";
import isUndefined from "lodash/isUndefined";
import { UserData } from "../models/user-models";
import { currentUserDataState, currentUserState } from "../atoms/user-atoms";
import { nowAsValue } from "../util/dates";
import { FirebaseUser } from "../models/authentication-models";
import { collection } from "./use-orders";
import { newDocument } from "../mappings/document-mappings";

export default function useSingleOrder() {
    const [document, setDocument] = useRecoilState<WithUid<Order>>(orderState);
    const userData = useRecoilValue<UserData>(currentUserDataState);
    const user = useRecoilValue<FirebaseUser>(currentUserState);
    const reset = useResetRecoilState(orderState);

    useEffect(() => {
        log.debug("Order change:", document);
    }, [document]);


    function saveOrder(order: WithUid<Order>, orderStatus?: OrderStatus): Promise<any> {
        if (isUndefined(orderStatus)) {
            log.info("saving order with existing status", OrderStatusDescriptions[order.data.status]);
            return save<Order>(collection, order);
        } else {
            log.info("saving order and changing status to", OrderStatusDescriptions[orderStatus]);
            const document = mutableOrder(order);
            document.data.status = orderStatus;
            return save<Order>(collection, document);
        }
    }

    function deleteOrder(order: WithUid<Order>): Promise<any> {
        log.info("deleting order with existing status", OrderStatusDescriptions[order.data.status]);
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
        log.info("change:field:", field, "value:", value, "typeof:", typeof value);
        const mutable = mutableOrder(order);
        set(mutable, field, value);
        setDocument(mutable);
    }

    function changeOrderItemField(order: WithUid<Order>, index: number, field: string, value: any) {
        log.info("changeOrderItemField:index", index, "field:", field, "value:", value, "typeof:", typeof value);
        const mutable: WithUid<Order> = mutableOrder(order);
        mutable.data.items[index][field] = value;
        setDocument(mutable);
    }

    function deleteOrderItem(order: WithUid<Order>, index: number) {
        log.info("deleteOrderItem:index:", index);
        const mutable: WithUid<Order> = mutableOrder(order);
        mutable.data.items = mutable.data.items.filter((item, itemIndex) => {
            log.info("deleteOrderItem:itemIndex:", itemIndex, "index", index);
            return itemIndex !== index;
        });
        setDocument(mutable);
    }

    async function addOrder(status?: OrderStatus) {
        const order = mutableOrder(newDocument<Order>());
        order.data.orderNumber = await newOrderNumber();
        order.data.companyId = userData.companyId;
        order.data.createdAt = nowAsValue();
        order.data.createdBy = user.uid;
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
        orderItem.createdBy = user.uid;
        orderItem.quantity = 1;
        mutable.data.updatedAt = nowAsValue();
        mutable.data.updatedBy = user.uid;
        mutable.data.updatedBy = user.uid;
        mutable.data.items.push(orderItem);
        log.info("addLineItem:mutable:", mutable);
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
