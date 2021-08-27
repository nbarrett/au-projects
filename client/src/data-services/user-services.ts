import { FirebaseUser } from "../models/authentication-models";
import { log } from "../util/logging-config";
import firebase from "firebase/app";
import { UserData } from "../models/user-models";

// import admin from "firebase-admin";

export function currentUser(): FirebaseUser | undefined {
    const currentUser = firebase.auth().currentUser as firebase.User;
    log.debug("currentUser:", currentUser?.email);
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

// export function users(): Promise<auth.UserRecord[]> {
//     return admin.auth().listUsers().then((userRecords) => {
//         return userRecords.users;
//     });
// }

export async function currentUserData(): Promise<UserData | undefined> {
    const firestore = firebase.app().firestore()
    const user = currentUser();
    if (user) {
        const userDoc = await firestore.doc(`users/${user.uid}`).get()
        const userData = userDoc.data() as UserData;
        log.debug("currentUserData:", userData);
        return userData;
    } else {
        return undefined
    }
}
