import { WithUid } from "../models/common-models";
import { find, findAll, save } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Order, OrderItem, OrderStatus } from "../models/order-models";
import { orderState } from "../atoms/order-atoms";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import max from "lodash/max";
import { UserData } from "../models/user-models";
import { currentUserDataState, currentUserState } from "../atoms/user-atoms";
import { nowAsValue } from "../util/dates";
import { FirebaseUser } from "../models/authentication-models";
import { collection } from "./use-orders";

export default function useSingleOrder() {
    const [document, setDocument] = useRecoilState<WithUid<Order>>(orderState);
    const newDocument = useResetRecoilState(orderState);
    const userData = useRecoilValue<UserData>(currentUserDataState);
    const user = useRecoilValue<FirebaseUser>(currentUserState);

    useEffect(() => {
        log.debug("Order change:", document);
    }, [document]);


    function saveOrder(orderStatus?: OrderStatus): Promise<any> {
        if (orderStatus) {
            const document = mutableOrder();
            document.data.status = orderStatus;
            return save<Order>(collection, document);
        } else {
            return save<Order>(collection, document);
        }

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

    function mutableOrder(): WithUid<Order> {
        return cloneDeep(document);
    }

    function changeField(field: string, value: any) {
        log.info("change:field:", field, "value:", value, "typeof:", typeof value);
        const mutable = mutableOrder();
        set(mutable, field, value);
        setDocument(mutable);
    }

    function changeOrderItemField(index: number, field: string, value: any) {
        log.info("change:field:", field, "value:", value, "typeof:", typeof value);
        const mutable: WithUid<Order> = mutableOrder();
        mutable.data.items[index][field] = value;
        setDocument(mutable);
    }

    function deleteOrderItem(index: number) {
        log.info("deleteOrderItem:index:", index);
        const mutable: WithUid<Order> = mutableOrder();
        mutable.data.items = mutable.data.items.filter((item, itemIndex) => {
            log.info("deleteOrderItem:itemIndex:", itemIndex, "index", index);
            return itemIndex !== index;
        });
        setDocument(mutable);
    }

    function change(event?: any) {
        const field = event.target.name;
        const value = event.target.value;
        changeField(field, value);
    }

    async function addOrder() {
        newDocument();
        const mutable = mutableOrder();
        mutable.data.orderNumber = await newOrderNumber();
        mutable.data.companyId = userData.companyId;
        mutable.data.createdAt = nowAsValue();
        mutable.data.createdBy = user.uid;
        mutable.data.status = OrderStatus.NEW;
        mutable.data.items = [];
        addLineItem(mutable);
        setDocument(mutable);
    }

    function addLineItem(existingOrder?: WithUid<Order>) {
        const orderItem: OrderItem = {};
        const order = existingOrder || mutableOrder();
        orderItem.createdAt = nowAsValue();
        orderItem.createdBy = user.uid;
        orderItem.quantity = 1;
        order.data.updatedAt = nowAsValue();
        order.data.updatedBy = user.uid;
        order.data.updatedBy = user.uid;
        order.data.items.push(orderItem);
        log.info("addLineItem:order:", order);
        setDocument(order);
    }

    return {
        addLineItem,
        addOrder,
        findOrder,
        saveOrder,
        document,
        setDocument,
        change,
        changeField,
        changeOrderItemField,
        deleteOrderItem
    };

}
