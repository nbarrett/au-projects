import { HasAuditTimestamps, hasUid, WithUid } from "../models/common-models";

import { log } from "../util/logging-config";
import firebase from "firebase/app";
import { nowAsValue } from "../util/dates";

export function firebaseFirestore() {
    return firebase.app().firestore();
}

function hasAuditTimestamps(data: any): data is HasAuditTimestamps {
    return typeof data.createdAt !== undefined;
}

export async function document<T>(document: string, uid: string): Promise<T> {
    const firestore = firebaseFirestore();
    const userDoc = await firestore.doc(`${document}/${uid}`).get()
    const userData = userDoc.data() as T;
    log.info(`${document}:${uid}`, userData);
    return userData;
}

export async function save<T>(collection: string, document: WithUid<T>): Promise<any> {
    if (hasUid<T>(document)) {
        return update<T>(collection, document);
    } else {
        return create<T>(collection, document);
    }
}

export async function saveAll<T>(collection: string, documents: WithUid<T>[]): Promise<any[]> {
    return Promise.all(documents.map(document => save<T>(collection, document)));
}

export async function update<T>(collection: string, document: WithUid<T>): Promise<boolean> {
    if (hasAuditTimestamps(document.data)) {
        document.data.updatedAt = nowAsValue();
    }
    const documentPath = `${collection}/${document.uid}`;
    const userDoc = await firebaseFirestore().doc(documentPath).update(document.data as firebase.firestore.UpdateData)
    log.info("updated:", documentPath, userDoc);
    return true;
}

export async function remove<T>(collection: string, uid: string): Promise<string> {
    const documentPath = `${collection}/${uid}`;
    const userDoc = await firebaseFirestore().doc(documentPath).delete()
    log.info("removed:", documentPath, userDoc);
    return uid;
}

export async function create<T>(collection: string, document: WithUid<T>): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    if (hasAuditTimestamps(document.data)) {
        document.data.createdAt = nowAsValue();
    }
    const userDoc = await firebaseFirestore().collection(collection).add(document);
    log.info("created:", collection, "document:", document, "returned:", userDoc);
    return userDoc;
}

export async function findAll<T>(collection: string): Promise<WithUid<T>[]> {
    const collectionSnapshot = await firebaseFirestore().collection(collection).get();
    const collectionDocuments = [...collectionSnapshot.docs]
        .map((documentSnapshot) => {
            return ({uid: documentSnapshot.id, data: documentSnapshot.data() as T});
        });
    log.info("found", collectionDocuments.length, `${collection}:`, collectionDocuments);
    return collectionDocuments;
}

export function subscribe<T>(collection: string, onSnapshot: (data: WithUid<T>[]) => any) {
    const query = firebaseFirestore().collection(collection);
    return query.onSnapshot(querySnapshot => {
        const documents: { uid: string; data: T }[] = querySnapshot.docs.map((documentSnapshot) => ({
            uid: documentSnapshot.id,
            data: documentSnapshot.data() as T
        }));
        log.info(`Received ${collection} query snapshot of size ${querySnapshot.size}`, documents);
        onSnapshot(documents);
    });
}