import firebase from "firebase";
import { atom } from "recoil";
import { FIREBASE_CONFIG } from "../constants";
import { log } from "../util/logging-config";
import { StoredValue } from "../util/ui-stored-values";

firebase.initializeApp(FIREBASE_CONFIG);

export const firestoreState = atom({
  key: StoredValue.FIRESTORE,
  default: firebase.app().firestore(), // default value (aka initial value)
});

export const firebaseAuth = atom({
  key: StoredValue.FIREBASE_AUTH,
  default: firebase.auth(),
});

export const firestoreStorageState = atom({
  key: "firestoreStorage",
  default: firebase.storage(),
});
