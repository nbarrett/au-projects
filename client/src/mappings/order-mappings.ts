import { LineItemStatus, Order, OrderItem, OrderStatus, OrderStatusDescriptions } from "../models/order-models";
import { Product } from "../models/product-models";
import { log } from "../util/logging-config";
import { WithUid } from "../models/common-models";
import sum from "lodash/sum";

export function kgPerRoll(orderItem: OrderItem, product: Product): number {
    return orderItem && orderItem?.thickness && orderItem?.width && orderItem?.length ? (orderItem?.thickness * (orderItem?.width / 1000) * orderItem?.length) * product?.specificGravity : null;
}

export function pricePerRoll(kgPerRoll: number, pricePerKg: number): number {
    return kgPerRoll && pricePerKg ? kgPerRoll * pricePerKg : null;
}

export function totalPerLine(quantity: number, pricePerRoll: number): number {
    return quantity && pricePerRoll ? quantity * pricePerRoll : null;
}

export function editable(orderStatus: OrderStatus): boolean {
    const orderStatuses = [OrderStatus.NEW, OrderStatus.DRAFT];
    return orderStatuses.includes(orderStatus);
}

export function cancellable(orderStatus: OrderStatus): boolean {
    return orderStatus < OrderStatus.CANCELLED;
}

export function deletable(orderStatus: OrderStatus): boolean {
    return orderStatus === OrderStatus.CANCELLED;
}

export function documentExistsIn(allOrderHistory: WithUid<Order>[], document: WithUid<Order>) {
    return allOrderHistory.map(item => item.data?.orderNumber).includes(document.data?.orderNumber);
}

export function applyDocumentToOrderHistory(allOrderHistory: WithUid<Order>[], document: WithUid<Order>): WithUid<Order>[] {
    const replace = documentExistsIn(allOrderHistory, document);
    if (document.data?.orderNumber) {
        if (document.markedForDelete) {
            return allOrderHistory.filter(existingOrder => existingOrder.data?.orderNumber !== document.data?.orderNumber);
        } else if (replace) {
            log.debug("applying latest version of document:", document, "to order history", allOrderHistory);
            return allOrderHistory.map(existingOrder => existingOrder.data?.orderNumber === document.data?.orderNumber ? document : existingOrder);
        } else {
            log.debug("adding latest version of document:", document, "to order history", allOrderHistory);
            return allOrderHistory.concat(document);
        }
    } else {
        log.debug("not adding document:", document, "to order history", allOrderHistory);
        return allOrderHistory;
    }
}

function sumCalledOffQuantities(document: WithUid<Order>): number {
    return sum(calledOffItems(document).map(item => sumOfCallOffQuantities(item)));
}

function sumNonCalledOffQuantities(document: WithUid<Order>): number {
    return sum(nonCalledOffItems(document).map(item => item.quantity));
}

export function callOffOrderStatusDescription(document: WithUid<Order>): string {
    const calledOffQuantities = sumCalledOffQuantities(document);
    const orderedQuantities = sumOrderedQuantities(document);
    return OrderStatusDescriptions[calledOffQuantities > 0 && calledOffQuantities !== orderedQuantities && document.data.status === OrderStatus.SUBMITTED ? OrderStatus.PARTIALLY_SUBMITTED : document.data.status];
}

export function calledOffItems(document: WithUid<Order>): OrderItem[] {
    return document.data.items.filter(item => item?.callOffs?.length > 0);
}

export function nonCalledOffItems(document: WithUid<Order>): OrderItem[] {
    return document.data.items.filter(item => !item?.callOffs || item?.callOffs?.length === 0);
}

export function callOffSummary(document: WithUid<Order>) {
    const calledOffQuantities = sumCalledOffQuantities(document);
    const nonCalledOffQuantities = sumNonCalledOffQuantities(document);
    const orderedQuantities = sumOrderedQuantities(document);
    log.debug("order", document.data.orderNumber, "orderedQuantities:", orderedQuantities, "calledOffQuantities:", calledOffQuantities, "nonCalledOffQuantities:", nonCalledOffQuantities);
    if ((nonCalledOffQuantities + calledOffQuantities) === orderedQuantities) {
        if (orderedQuantities > 1) {
            return `all ${orderedQuantities}`;
        } else {
            return orderedQuantities;
        }
    } else {
        return `${nonCalledOffQuantities + calledOffQuantities} of ${orderedQuantities}`;
    }
}

export function sumOrderedQuantities(document: WithUid<Order>) {
    return sum(document.data.items.map(item => item.quantity));
}

export function sumOfCallOffQuantities(orderItem: OrderItem) {
    return sum(orderItem.callOffs
        .filter(item => item.events.filter(callOff => callOff.status !== LineItemStatus.CANCELLED))
        .map(item => item.quantity));
}

export function sumOfOtherCallOffQuantities(orderItem: OrderItem, callOffItemIndex: number) {
    return sum(orderItem.callOffs
        .filter((callOff, index) => callOffItemIndex !== index && callOff.events.filter(callOff => callOff.status !== LineItemStatus.CANCELLED))
        .map(item => item.quantity));
}

export function callOffMaxQuantityReached(orderItem: OrderItem): boolean {
    return sumOfCallOffQuantities(orderItem) >= orderItem.quantity;
}
