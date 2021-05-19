import { log } from "../util/logging-config";
import firebase from "firebase/app";

export async function document<T>(document: string, uid: string): Promise<T> {
    const firestore = firebase.app().firestore()
    const userDoc = await firestore.doc(`${document}/${uid}`).get()
    const userData = userDoc.data() as T;
    log.info(`${document}:${uid}`, userData);
    return userData;
}

export async function queryCollection<T>(collection: string): Promise<T[]> {
    const firestore = firebase.app().firestore()
    const collectionSnapshot = await firestore.collection(collection).get();
    const collectionDocuments = [...collectionSnapshot.docs].map((documentSnapshot) => {
        return documentSnapshot.data() as T;
    });
    log.info("found", collectionDocuments.length, "documents from", `${collection}:`, collectionDocuments);
    return collectionDocuments;
}
