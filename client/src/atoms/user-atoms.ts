import { atom, DefaultValue } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { FirebaseUser } from "../models/authentication-models";
import firebase from "firebase/app";
import { currentUser, currentUserData } from "./user-data-services";
import { log } from "../util/logging-config";
import { UserData } from '../models/user-models';

export const currentUserState = atom<FirebaseUser>({
  key: StoredValue.CURRENT_USER,
  default: {},
  effects_UNSTABLE: [
    ({setSelf, onSet}) => {
      const data = currentUser()
      log.info("currentUserState:setSelf:", data)
      if (data) {
        setSelf(data);
      }
      onSet(newValue => {
        if (newValue instanceof DefaultValue) {
          log.info("currentUserState:onSet default value - not saving:", newValue)
        } else {
          log.info("currentUserState:onSet:", newValue)
          const user = newValue as FirebaseUser;
          const currentUser = firebase.auth().currentUser;
          if (currentUser && user.email != null) {
            currentUser.updateEmail(user.email);
            currentUser.sendEmailVerification();
          } else {
            log.info("currentUserState:onSet:cant update as user:", user, "currentUser:", currentUser);
          }
        }
      });
    },
  ]
});

export const currentUserDataState = atom<UserData>({
  key: StoredValue.CURRENT_USER_DATA,
  default: {} as UserData,
  effects_UNSTABLE: [
    ({setSelf, onSet}) => {
      currentUserData().then(data => {
        log.info("currentUserDataState:setSelf:", data)
        if (data) {
          setSelf(data);
        }
      })
      onSet(newValue => {
        if (newValue instanceof DefaultValue) {
          log.info("currentUserDataState:onSet default value - not saving:", newValue)
        } else {
          log.info("currentUserDataState:onSet:", newValue)
          const firestore = firebase.app().firestore()
          const user = currentUser();
          if (user) {
            firestore.doc(`users/${user.uid}`).update(newValue);
          }
        }
      });
    },
  ]
});
