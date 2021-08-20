import { HasAuditTimestamps, HasAuditUsers } from "./common-models";

export interface Order extends HasAuditTimestamps, HasAuditUsers {
    orderNumber: number;
    status: OrderStatus;
    companyId: string;
    items: OrderItem[]
}

export enum OrderStatus {
    NEW = -1,
    DRAFT,
    CANCELLED,
    SUBMITTED,
    MANUFACTURING,
    DELIVERING,
    COMPLETE
}

export interface OrderStatusDescription {
    [key: number]: string
}

export const OrderStatusDescriptions: OrderStatusDescription = {
    [OrderStatus.NEW]: "New",
    [OrderStatus.DRAFT]: "Draft",
    [OrderStatus.CANCELLED]: "Cancelled",
    [OrderStatus.SUBMITTED]: "Submitted",
    [OrderStatus.MANUFACTURING]: "Manufacturing",
    [OrderStatus.DELIVERING]: "Delivering",
    [OrderStatus.COMPLETE]: "Complete",
};

export interface OrderItem extends HasAuditTimestamps, HasAuditUsers {
    productId?: string;
    thickness?: number;
    width?: number;
    length?: number
    quantity?: number
}

