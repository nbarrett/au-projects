import { OrderItem, OrderStatus } from "../models/order-models";
import { Product } from "../models/product-models";

export function kgPerRoll(orderItem: OrderItem, product: Product): number {
    return orderItem && orderItem?.thickness && orderItem?.width && orderItem?.length ? (orderItem?.thickness * (orderItem?.width / 1000) * orderItem?.length) * product?.specificGravity : null;
}

export function pricePerRoll(kgPerRoll: number, pricePerKg: number): number {
    return kgPerRoll && pricePerKg ? kgPerRoll * pricePerKg : null;
}

export function totalPerLine(quantity: number, pricePerRoll: number): number {
    return quantity && pricePerRoll ? quantity * pricePerRoll : null;
}

export function editable (orderStatus: OrderStatus):boolean {
    const orderStatuses = [OrderStatus.NEW, OrderStatus.DRAFT];
    return orderStatuses.includes(orderStatus);
}
