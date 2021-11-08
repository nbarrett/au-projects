import { FieldValue, WithUid } from "../models/common-models";
import { find, findAll, remove, save } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { LineItemStatus, Order, OrderItem, OrderStatus, OrderStatusDescriptions } from "../models/order-models";
import { orderState } from "../atoms/order-atoms";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import isUndefined from "lodash/isUndefined";
import { nowAsValue } from "../util/dates";
import useOrders, { collection } from "./use-orders";
import { newDocument } from "../mappings/document-mappings";
import useCurrentUser from "./use-current-user";
import useCompanyData from "./use-company-data";
import { Company } from "../models/company-models";

export default function useSingleOrder(): UseSingleOrder {
    const currentUser = useCurrentUser();
    const [document, setDocument] = useRecoilState<WithUid<Order>>(orderState);
    const reset = useResetRecoilState(orderState);
    const companyData = useCompanyData();
    const orders = useOrders();

    useEffect(() => {
        log.debug("Order change:", document);
    }, [document]);

    function saveOrder(order: WithUid<Order>, orderStatus?: OrderStatus): Promise<any> {
        if (isUndefined(orderStatus)) {
            log.debug("saving order with existing status", OrderStatusDescriptions[order.data.status]);
            return save<Order>(collection, order).then(() => orders.refreshOrders());
        } else {
            log.debug("saving order and changing status to", OrderStatusDescriptions[orderStatus]);
            const document = orderForUpdate(order);
            document.data.status = orderStatus;
            return save<Order>(collection, document).then(() => orders.refreshOrders());
        }
    }

    function deleteOrder(order: WithUid<Order>): Promise<any> {
        log.debug("deleting order with existing status", OrderStatusDescriptions[order.data.status]);
        return remove<Order>(collection, order.uid).then(() => orders.refreshOrders());
    }

    async function newOrderNumber(): Promise<string> {
        const all = await findAll<Order>(collection);
        const company: WithUid<Company> = companyData.companyForUid(currentUser.document.data?.companyId);
        const orderCount: number = all.filter(order => order.data.companyId === currentUser.document.data?.companyId)?.length || 0;
        return company.data.code + (orderCount + 1).toString().padStart(6, "0");
    }

    function findOrder(uid: string): void {
        find<Order>(collection, uid).then((response) => {
            log.debug("response was:", response);
            setDocument(response);
        });
    }

    function orderForUpdate(order?: WithUid<Order>): WithUid<Order> {
        return cloneDeep(order || document);
    }

    function changeField(order: WithUid<Order>, field: string, value: any) {
        log.debug("change:field:", field, "value:", value, "typeof:", typeof value);
        const mutable = orderForUpdate(order);
        set(mutable, field, value);
        setDocument(mutable);
    }

    function changeOrderItemField(order: WithUid<Order>, orderItemIndex: number, field: string, value: any) {
        log.debug("changeOrderItemField:orderItemIndex", orderItemIndex, "field:", field, "value:", value, "typeof:", typeof value);
        const mutable: WithUid<Order> = orderForUpdate(order);
        mutable.data.items[orderItemIndex][field] = value;
        setDocument(mutable);
    }

    function findOrderItem(order: WithUid<Order>, orderItem: OrderItem) {
        const mutableOrder: WithUid<Order> = orderForUpdate(order);
        const mutableOrderItem = mutableOrder.data.items.find(item => item.createdAt === orderItem.createdAt);
        log.debug("findOrderItem:mutableOrder", mutableOrder, "mutableOrderItem:", mutableOrderItem);
        return {mutableOrder, mutableOrderItem};
    }

    function changeCallOffField(order: WithUid<Order>, orderItem: OrderItem, callOffItemIndex: number, ...fieldValues: FieldValue[]) {
        log.debug("changeCallOffField:orderItem", orderItem, "callOffItemIndex:", callOffItemIndex, "fieldValues:", fieldValues);
        const {mutableOrder, mutableOrderItem} = findOrderItem(order, orderItem);
        fieldValues.forEach(fieldValue => {
            mutableOrderItem.callOffs[callOffItemIndex][fieldValue.field] = fieldValue.value;
        });

        setDocument(mutableOrder);
    }

    function createCallOffEvent(order: WithUid<Order>, orderItem: OrderItem, callOffItemIndex: number, lineItemStatus: LineItemStatus) {
        log.debug("createCallOffEvent:orderItem", orderItem, "callOffItemIndex:", callOffItemIndex, "status:", lineItemStatus);
        const {mutableOrder, mutableOrderItem} = findOrderItem(order, orderItem);
        mutableOrderItem.callOffs[callOffItemIndex].events.push({timestamp: nowAsValue(), status: lineItemStatus});
        setDocument(mutableOrder);
    }

    function deleteOrderItem(order: WithUid<Order>, orderItem: OrderItem) {
        log.debug("deleteOrderItem:orderItem", orderItem);
        const {mutableOrder, mutableOrderItem} = findOrderItem(order, orderItem);
        mutableOrder.data.items = mutableOrder.data.items.filter((item) => mutableOrderItem !== item);
        setDocument(mutableOrder);
    }

    function createCallOff(order: WithUid<Order>, orderItem: OrderItem) {
        log.debug("createCallOff:orderItem:", orderItem);
        const {mutableOrder, mutableOrderItem} = findOrderItem(order, orderItem);
        if (!mutableOrderItem.callOffs) {
            mutableOrderItem.callOffs = [];
        }
        const callOff = {quantityRemaining: orderItem.quantity, quantity: 0, events: []};
        mutableOrderItem.callOffs.push(callOff);
        log.debug("createCallOff:orderItem:", orderItem, callOff, "orderItem:", orderItem);
        setDocument(mutableOrder);
    }

    function deleteCallOff(order: WithUid<Order>, orderItem: OrderItem, callOffItemIndex: number) {
        log.debug("deleteCallOff:orderItem:", orderItem, "callOffItemIndex:", callOffItemIndex);
        const {mutableOrder, mutableOrderItem} = findOrderItem(order, orderItem);
        mutableOrderItem.callOffs = (mutableOrderItem?.callOffs || []).filter((item, index) => index !== callOffItemIndex);
        setDocument(mutableOrder);
    }

    async function addOrder(status?: OrderStatus) {
        const order = orderForUpdate(newDocument<Order>());
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
        const order = orderForUpdate();
        order.markedForDelete = true;
        setDocument(order)
    }

    function addLineItem(order: WithUid<Order>) {
        const orderItem: OrderItem = {};
        const mutable = orderForUpdate(order);
        orderItem.createdAt = nowAsValue();
        orderItem.createdBy = currentUser.document.uid;
        orderItem.quantity = 1;
        orderItem.callOffs = [];
        mutable.data.updatedAt = nowAsValue();
        mutable.data.updatedBy = currentUser.document.uid;
        mutable.data.updatedBy = currentUser.document.uid;
        mutable.data.items.push(orderItem);
        log.debug("addLineItem:mutable:", mutable);
        setDocument(mutable);
    }

    function submit(order: WithUid<Order>): Promise<any> {
        return saveOrder(order, OrderStatus.SUBMITTED);
    }

    return {
        addLineItem,
        addOrder,
        changeCallOffField,
        changeField,
        changeOrderItemField,
        createCallOff,
        deleteCallOff,
        createCallOffEvent,
        deleteOrder,
        deleteOrderItem,
        document,
        findOrder,
        reset,
        resetAndMarkForDelete,
        saveOrder,
        setDocument,
        submit
    };

}

export interface UseSingleOrder {
    addLineItem: (order: WithUid<Order>) => void;
    addOrder: (status?: OrderStatus) => Promise<void>;
    changeCallOffField: (order: WithUid<Order>, orderItem: OrderItem, callOffItemIndex: number, ...fieldValues: FieldValue[]) => void;
    changeField: (order: WithUid<Order>, field: string, value: any) => void;
    changeOrderItemField: (order: WithUid<Order>, orderItemIndex: number, field: string, value: any) => void;
    createCallOff: (order: WithUid<Order>, orderItem: OrderItem) => void;
    createCallOffEvent: (order: WithUid<Order>, orderItem: OrderItem, callOffItemIndex: number, status: LineItemStatus) => void;
    deleteCallOff: (order: WithUid<Order>, orderItem: OrderItem, callOffItemIndex: number) => void;
    deleteOrder: (order: WithUid<Order>) => Promise<any>;
    deleteOrderItem: (order: WithUid<Order>, orderItem: OrderItem) => void;
    document: WithUid<Order>;
    findOrder: (uid: string) => void;
    reset: () => void;
    resetAndMarkForDelete: () => void;
    saveOrder: (order: WithUid<Order>, orderStatus?: OrderStatus) => Promise<any>;
    setDocument: (valOrUpdater: (((currVal: WithUid<Order>) => WithUid<Order>) | WithUid<Order>)) => void;
    submit: (order: WithUid<Order>) => Promise<any>;
}

