import { WithUid } from "../models/common-models";
import { find, firebaseFirestore } from "../data-services/firebase-services";
import { log } from "../util/logging-config";
import { Order } from "../models/order-models";
import { companyId } from "../mappings/company-mappings";

export const collection = "orders";
export default function useOrders() {

    async function findOrdersForCompany(companyId: string): Promise<WithUid<Order>[]> {
        const firestore = firebaseFirestore();
        const collectionDocuments: WithUid<Order>[] = await firestore.collection(collection).where("companyId", "==", companyId).get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((documentSnapshot) => {
                    return ({
                        uid: documentSnapshot.id, data: documentSnapshot.data() as Order
                    });
                });
            });
        log.info("For companyId:", companyId, "found", collectionDocuments.length, `${collection}:`, collectionDocuments);
        return collectionDocuments;
    }

    async function findOrder(orderId: string): Promise<WithUid<Order>> {
        return find<Order>(collection, orderId);
    }

    return {findOrdersForCompany, findOrder};

}
