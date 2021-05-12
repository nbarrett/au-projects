import { DefaultValue, selector } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { FirebaseUser, UserData } from "../models/auth-models";
import { firebaseAuth, firestoreState } from "./firestore";
import { log } from "../util/logging-config";
import firebase from "firebase/app";

export const currentUserState = selector<FirebaseUser>({
  key: StoredValue.CURRENT_USER,
  get: async ({ get }) => {
    const currentUser = get(firebaseAuth).currentUser as firebase.User;
    log.info("currentUser:", currentUser);
    return {
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
      uid: currentUser.uid,
    } as FirebaseUser;
  },
});

export const currentUserDataState = selector<UserData>({
  key: StoredValue.CURRENT_USER_DATA,
  get: ({ get }) => {
    const firestore = get(firestoreState);
    const user = get(currentUserState);
    return firestore
      .doc(`users/${user.uid}`)
      .get()
      .then((data) => {
        const userData = data.data() as UserData;
        log.info("get:", userData);
        return userData;
      });
  },
  set: ({ set }, newValue: DefaultValue | UserData) => {
    log.info("set:", newValue);
  },
});

// export const UserDataState: RecoilState<UserData> = atom({
//   key: StoredValue.CURRENT_USER_DATA,
//   default: {UserData: []},
//   effects_UNSTABLE: [
//     ({setSelf, onSet}) => {
//       const firestore = get(firestoreState);
//       const user = get(currentUserState);
//       const data = await firestore.doc(`users/${user.uid}`).get();
//       const userData=data.data() as UserData;
//         setSelf(userData);
//       });
//       onSet(UserData => {
//         if (UserData instanceof DefaultValue) {
//           log.debug("UserData default value - not saving:", UserData)
//         } else {
//           log.debug("UserData:onSet:", UserData)
//           saveUserData(UserData);
//         }
//       });
//     },
//   ]
// });
