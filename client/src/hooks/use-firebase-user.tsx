import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { log } from "../util/logging-config";
import { FirebaseUser } from "../models/authentication-models";

export function useFirebaseUser() {

  const auth = firebase.auth();
  const [untypedUser, loading] = useAuthState(auth);
  const user: firebase.User = untypedUser as firebase.User;
  const [document, setDocument] = useState<FirebaseUser>({uid: user?.uid, email: user?.email});

  useEffect(() => {
    log.debug("user:", user, "loading:", loading);
  }, [user]);

  useEffect(() => {
    log.debug("document:", document);
  }, [document]);

  function changeField(field: string, value: any) {
    log.debug("change:field:", field, "value:", value, "typeof:", typeof value);
    setDocument({
      ...document,
      [field]: value,
    });
  }

  function debugCurrentUser() {
    return debugUser(user);
  }

  function debugUser(user:firebase.User) {
    return user ? `email:${user.email}, emailVerified:${user.emailVerified}, uid:${user.uid}` : "<none>";
  }

  function updateEmail(email: string): Promise<void> {
    log.debug("currentUserState:onSet:", user);
    if (user && email) {
      return user.updateEmail(email)
          .then(() => user.sendEmailVerification());
    } else {
      log.debug("setUser:cant update as user:", user, "email:", email);
      return Promise.resolve();
    }

  }

  function logoutAfterChange(): boolean {
    return document.email !== user.email;
  }

  function saveUser(): Promise<any> {
    if (logoutAfterChange()) {
      return updateEmail(document.email).then(() => {
        const message = `${document.email} will need to be verified before your next login, so please respond to an email in your inbox`;
        log.debug("showing message:", message);
        return message;
      });
    } else {
      log.debug("no change to user's email");
      return Promise.resolve();
    }
  }

  return {debugUser, debugCurrentUser, user, changeField, updateEmail, loading, saveUser, document, logoutAfterChange};
}
