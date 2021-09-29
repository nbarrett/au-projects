import { WithUid } from "../models/common-models";
import { find, firebaseFirestore } from "../data-services/firebase-services";
import { log } from "../util/logging-config";
import { Order } from "../models/order-models";
import { companyId } from "../mappings/company-mappings";
import { UserRoles } from "../models/user-models";
import useCurrentUser from "./use-current-user";
import useUserRoles from "./use-user-roles";
import { useSetRecoilState } from "recoil";
import { ordersState } from "../atoms/order-atoms";

export const collection = "orders";
export default function useOrders() {

    const currentUser = useCurrentUser();
    const currentUserRoles: WithUid<UserRoles> = useUserRoles().forCurrentUser();
    const setAllOrderHistory = useSetRecoilState<WithUid<Order>[]>(ordersState);

    function refreshOrders(): Promise<void> {
        if (currentUser.document.data?.companyId) {
            log.debug("refreshing order view");
            return findOrdersForCompany(currentUserRoles, currentUser.document.data?.companyId).then(setAllOrderHistory);
        } else {
            return Promise.resolve();
        }
    }

    async function findOrdersForCompany(currentUserRoles: WithUid<UserRoles>, companyId: string): Promise<WithUid<Order>[]> {
        const firestore = firebaseFirestore();
        const query = currentUserRoles?.data?.backOffice ? firestore.collection(collection) : firestore.collection(collection).where("companyId", "==", companyId);
        const collectionDocuments: WithUid<Order>[] = await query.get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((documentSnapshot) => {
                    return ({
                        uid: documentSnapshot.id, data: documentSnapshot.data() as Order
                    });
                });
            });
        log.debug("For companyId:", companyId, "found", collectionDocuments.length, `${collection}:`, collectionDocuments);
        return collectionDocuments;
    }

    async function findOrder(orderId: string): Promise<WithUid<Order>> {
        return find<Order>(collection, orderId);
    }

    return {findOrdersForCompany, findOrder, refreshOrders, setAllOrderHistory};

}
