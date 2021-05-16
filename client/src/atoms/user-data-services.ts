import { FirebaseUser, UserData } from "../models/auth-models";
import { log } from "../util/logging-config";
import firebase from "firebase/app";

export function currentUser(): FirebaseUser | undefined {
    const currentUser = firebase.auth().currentUser as firebase.User;
    log.info("currentUser:get", currentUser?.email);
    if (currentUser) {
        return {
            email: currentUser?.email,
            emailVerified: currentUser?.emailVerified,
            uid: currentUser?.uid,
        } as FirebaseUser;
    } else {
        return undefined
    }
}

export async function currentUserData(): Promise<UserData | undefined> {
    const firestore = firebase.app().firestore()
    const user = currentUser();
    if (user) {
        const userDoc = await firestore.doc(`users/${user.uid}`).get()
        const userData = userDoc.data() as UserData;
        log.info("currentUserData:get:", userData);
        return userData;
    } else {
        return undefined
    }
}
