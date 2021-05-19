import { FirebaseUser } from "../models/authentication-models";
import { log } from "../util/logging-config";
import firebase from "firebase/app";
import { UserData } from "../models/user-models";
import { auth } from 'firebase-admin/lib/auth';
import admin from "firebase-admin";

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

export function allUsers(): Promise<auth.UserRecord[]> {
    return admin.auth().listUsers().then((userRecords) => {
        return userRecords.users;
    });
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
