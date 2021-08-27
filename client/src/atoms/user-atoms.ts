import { atom, DefaultValue } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { FirebaseUser } from "../models/authentication-models";
import firebase from "firebase/app";
import { currentUser, currentUserData } from "../data-services/user-services";
import { log } from "../util/logging-config";
import { UserData, UserRoles } from "../models/user-models";
import { WithUid } from "../models/common-models";
import { newDocument } from "../mappings/document-mappings";

export const currentUserState = atom<FirebaseUser>({
  key: StoredValue.CURRENT_USER,
  default: {},
  effects_UNSTABLE: [
    ({setSelf, onSet}) => {
      const data = currentUser()
      log.debug("currentUserState:setSelf:", data)
      if (data) {
        setSelf(data);
      }
      onSet(newValue => {
        if (newValue instanceof DefaultValue) {
          log.debug("currentUserState:onSet default value - not saving:", newValue)
        } else {
          log.debug("currentUserState:onSet:", newValue)
          const user = newValue as FirebaseUser;
          const currentUser = firebase.auth().currentUser;
          if (currentUser && user.email != null) {
            currentUser.updateEmail(user.email);
            currentUser.sendEmailVerification();
          } else {
            log.debug("currentUserState:onSet:cant update as user:", user, "currentUser:", currentUser);
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
        log.debug("currentUserDataState:setSelf:", data)
        if (data) {
          setSelf(data);
        }
      })
      onSet(newValue => {
        if (newValue instanceof DefaultValue) {
          log.debug("currentUserDataState:onSet default value - not saving:", newValue)
        } else {
          log.debug("currentUserDataState:onSet:", newValue)
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

export const userRolesState = atom<WithUid<UserRoles>[]>({
  key: StoredValue.USER_ROLES,
  default: []
});

export const usersState = atom<WithUid<UserData>[]>({
  key: StoredValue.USERS,
  default: []
});

export const userState = atom<WithUid<UserData>>({
  key: StoredValue.USER,
  default: newDocument<UserData>()
});
