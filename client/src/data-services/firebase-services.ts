import { HasAuditTimestamps, hasUidWithValue, WithUid } from "../models/common-models";
import { log } from "../util/logging-config";
import firebase from "firebase/app";
import { nowAsValue } from "../util/dates";
import { cloneDeep } from "lodash";
import { asNumber } from '../util/numbers';

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
    log.debug(`${document}:${uid}`, userData);
    return userData;
}

export async function renameField<T>(collection: string, fromName: string, toName: string, deleteOld: boolean, convertToNumber: boolean): Promise<any> {
    const firestore = firebaseFirestore();
    const documents = await findAll<T>(collection);
    return documents.map(document => {
        const documentReference = firestore.collection(collection).doc(document.uid);
        const currentValue = document.data[fromName];
        log.debug(`${collection}:${document.uid}:updating from:${toName} to:${currentValue}`);
        return documentReference.update({
            [toName]: convertToNumber ? asNumber(currentValue) : currentValue
        }).then(() => {
            if (deleteOld) {
                const removeReference: Promise<void> = documentReference.update({[fromName]: firebase.firestore.FieldValue.delete()});
                log.debug(`${document.uid}:renaming from:${fromName} to:${toName} - remove reference${removeReference}`);
                return removeReference;
            } else {
                log.debug(`${document.uid}:not deleting ${fromName} field`);
                return null;
            }
        })
    })
}

export async function save<T>(collection: string, document: WithUid<T>, batch?: firebase.firestore.WriteBatch): Promise<any> {
    if (hasUidWithValue<T>(document)) {
        if (document.markedForDelete) {
            return remove<T>(collection, document.uid, batch);
        } else {
            return update<T>(collection, document, batch);
        }
    } else {
        return create<T>(collection, document, batch);
    }
}

export async function saveAll<T>(collection: string, documents: WithUid<T>[]): Promise<any> {
    const batch: firebase.firestore.WriteBatch = firebaseFirestore().batch();
    return Promise.all(documents.map(document => save<T>(collection, document, batch))).then(()=> batch.commit());
}

export async function saveAllWithId<T>(collection: string, documents: WithUid<T>[]): Promise<any[]> {
    const batch: firebase.firestore.WriteBatch = firebaseFirestore().batch();
    return Promise.all(documents.map(document => createWithId<T>(collection, document, batch)));
}

export async function update<T>(collection: string, document: WithUid<T>, batch?: firebase.firestore.WriteBatch): Promise<boolean> {
    const mutableData: WithUid<T> = cloneDeep(document);
    if (hasAuditTimestamps(mutableData.data)) {
        mutableData.data.updatedAt = nowAsValue();
    }
    const documentPath = `${collection}/${mutableData.uid}`;
    const documentRef = firebaseFirestore().doc(documentPath);
    if (batch) {
        await batch.update(documentRef, mutableData.data as firebase.firestore.UpdateData);
    } else {
        await documentRef.update(mutableData.data as firebase.firestore.UpdateData)
    }
    log.debug("updated:", documentPath);
    return true;
}

export async function remove<T>(collection: string, uid: string, batch?: firebase.firestore.WriteBatch): Promise<string> {
    const documentPath = `${collection}/${uid}`;
    const documentReference = firebaseFirestore().doc(documentPath);
    if (batch) {
        await batch.delete(documentReference);
    } else {
        await documentReference.delete()
    }
    log.debug("removed:", documentPath);
    return uid;
}

export async function create<T>(collection: string, document: WithUid<T>, batch?: firebase.firestore.WriteBatch): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    const mutableData: WithUid<T> = cloneDeep(document);
    if (hasAuditTimestamps(mutableData.data)) {
        mutableData.data.createdAt = nowAsValue();
    }
    const documentReference = firebaseFirestore().collection(collection).doc();
    let userDoc;
    if (batch) {
        userDoc = await batch.set(documentReference, mutableData.data);
    } else {
        userDoc = await documentReference.set(mutableData.data);
    }
    log.debug("created:", collection, "document:", document, "returned:", userDoc);
    return userDoc;
}

export async function createWithId<T>(collection: string, document: WithUid<T>, batch?: firebase.firestore.WriteBatch): Promise<void> {
    const mutableData: WithUid<T> = cloneDeep(document);
    if (hasAuditTimestamps(mutableData.data)) {
        mutableData.data.createdAt = nowAsValue();
    }
    const documentReference = firebaseFirestore().collection(collection).doc(mutableData.uid);

    let userDoc;
    if (batch) {
        userDoc = await batch.set(documentReference, mutableData.data);
    } else {
        userDoc = await documentReference.set(mutableData.data);
    }

    log.debug("created:", collection, "document:", document, "with supplied uid:", mutableData.uid, "returned:", userDoc);
    return userDoc;
}

export async function findAll<T>(collection: string): Promise<WithUid<T>[]> {
    const collectionSnapshot = await firebaseFirestore().collection(collection).get();
    const collectionDocuments = [...collectionSnapshot.docs]
        .map((documentSnapshot) => {
            return ({uid: documentSnapshot.id, data: documentSnapshot.data() as T});
        });
    log.debug("found", collectionDocuments.length, `${collection}:`, collectionDocuments);
    return collectionDocuments;
}

export async function find<T>(collection: string, uid: string): Promise<WithUid<T>> {
    const documentPath = `${collection}/${uid}`;
    const documentSnapshot = await firebaseFirestore().doc(documentPath).get();
    const document = {uid: documentSnapshot.id, data: documentSnapshot.data() as T};
    log.debug("found", document, "from", documentPath);
    return document;
}

export function subscribe<T>(collection: string, onSnapshot: (data: WithUid<T>[]) => any) {
    const query = firebaseFirestore().collection(collection);
    return query.onSnapshot(querySnapshot => {
        const documents: { uid: string; data: T }[] = querySnapshot.docs.map((documentSnapshot) => ({
            uid: documentSnapshot.id,
            data: documentSnapshot.data() as T
        }));
        log.debug(`Received ${collection} query snapshot of size ${querySnapshot.size}`, documents);
        onSnapshot(documents);
    });
}
