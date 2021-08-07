import firebase from "firebase";
import { useSession } from "./useSession";
import { useEffect, useState } from "react";
import { log } from "../util/logging-config";
import { UserData } from "../models/user-models";

export function useCurrentUserData() {
  const { user } = useSession();
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    if (!user?.uid) {
      console.info("AccountProfile:cant query user as not logged in");
    } else {
      console.info("AccountProfile:user:", user?.uid);
      const collection = firebase.firestore().collection("users");
      collection
        .doc(user?.uid)
        .get()
        .then((userData) => {
          if (userData.exists) {
            const data = userData.data();
            log.debug("userData found:", data);
            setUserData(data as UserData);
          } else {
            log.debug("userData doesnt exist");
          }
        });
    }
  }, [user?.uid]);

  return [userData, setUserData];
}
