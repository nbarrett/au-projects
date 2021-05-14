import firebase from "firebase";
import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";

export const firestoreState = atom({
  key: StoredValue.FIRESTORE,
  default: firebase.app().firestore()
});

export const firebaseAuth = atom({
  key: StoredValue.FIREBASE_AUTH,
  default: firebase.auth(),
});

export const firestoreStorageState = atom({
  key: StoredValue.FIREBASE_STORAGE,
  default: firebase.storage()
});
