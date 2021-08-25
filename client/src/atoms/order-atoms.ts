import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { WithUid } from "../models/common-models";
import { newDocument } from "../mappings/document-mappings";
import { Order, OrderStatus } from "../models/order-models";

export const orderTabState = atom<OrderStatus>({
  key: StoredValue.TAB,
  default: OrderStatus.DRAFT
});

export const orderState = atom<WithUid<Order>>({
  key: StoredValue.ORDER,
  default: newDocument<Order>()
});

export const companiesState = atom<WithUid<Order>[]>({
  key: StoredValue.ORDERS,
  default: []
});
