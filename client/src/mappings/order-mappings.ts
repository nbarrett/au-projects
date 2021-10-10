import { Order, OrderItem, OrderStatus } from "../models/order-models";
import { Product } from "../models/product-models";
import { log } from "../util/logging-config";
import { WithUid } from "../models/common-models";

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

