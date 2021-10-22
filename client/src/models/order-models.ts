import { HasAuditTimestamps, HasAuditUsers } from "./common-models";

export interface Order extends HasAuditTimestamps, HasAuditUsers {
    orderNumber: string;
    companyOrderNumber?: string;
    status: OrderStatus;
    companyId: string;
    items: OrderItem[]
}

export interface OrderStatusDescription {
    [key: number]: string
}

export interface LineItemStatusDescription {
    [key: number]: string
}

export enum OrderStatus {
    NEW = -1,
    DRAFT,
    CANCELLED,
    PARTIALLY_SUBMITTED,
    SUBMITTED,
    MANUFACTURING,
    DELIVERING,
    COMPLETE
}

export const OrderStatusDescriptions: OrderStatusDescription = {
    [OrderStatus.NEW]: "New",
    [OrderStatus.DRAFT]: "Draft",
    [OrderStatus.CANCELLED]: "Cancelled",
    [OrderStatus.PARTIALLY_SUBMITTED]: "Partially Submitted",
    [OrderStatus.SUBMITTED]: "Submitted",
    [OrderStatus.MANUFACTURING]: "Manufacturing",
    [OrderStatus.DELIVERING]: "Delivering",
    [OrderStatus.COMPLETE]: "Complete",
};

export enum LineItemStatus {
    SUBMITTED,
    PRODUCTION_IN_PROGRESS,
    PRODUCTION_COMPLETE,
    CANCELLED
}

export const LineItemStatusDescriptions: LineItemStatusDescription = {
    [LineItemStatus.SUBMITTED]: "Submitted",
    [LineItemStatus.PRODUCTION_IN_PROGRESS]: "In Progress",
    [LineItemStatus.PRODUCTION_COMPLETE]: "Complete",
    [LineItemStatus.CANCELLED]: "Cancelled",
};

export interface CallOff {
    quantity: number
    quantityRemaining: number
    events: CallOffEvent[]
}

export interface CallOffEvent {
    timestamp: number;
    status: LineItemStatus;
}

export interface OrderItem extends HasAuditTimestamps, HasAuditUsers {
    productId?: string;
    thickness?: number;
    width?: number;
    length?: number
    quantity?: number
    callOffs?: CallOff[]
}

export function reportedStatus(): OrderStatus[] {
    return [OrderStatus.NEW, OrderStatus.DRAFT, OrderStatus.SUBMITTED, OrderStatus.CANCELLED, OrderStatus.MANUFACTURING, OrderStatus.DELIVERING, OrderStatus.COMPLETE];
}
