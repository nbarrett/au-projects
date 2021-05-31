import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { SignupWithEmailProps, UseSigninWithEmailProps, } from "../models/authentication-models";
import { log } from "../util/logging-config";
import { UserData } from "../models/user-models";

export const useSigninWithEmail = () => {
  const notification = useSnackbarNotification();

  return async function signinWithEmail({
    email,
    password,
    rememberMe,
  }: UseSigninWithEmailProps): Promise<any> {
    log.info("about to login:setPersistence");
    await firebase
        .auth()
        .setPersistence(
            rememberMe
                ? firebase.auth.Auth.Persistence.LOCAL
                : firebase.auth.Auth.Persistence.SESSION
        );
    log.info("about to login:signInWithEmailAndPassword");
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
      log.error("error happened during login:", error);
      if (error.code === "auth/wrong-password") {
        return Promise.reject(notification.error("The password you entered was not recognised"));
      } else if (error.code === "auth/user-not-found") {
        return Promise.reject(notification.error("The email address you entered was not recognised"));
      } else if (error.code === "auth/invalid-email") {
        return Promise.reject(notification.error("The email address you entered was not in the right format"));
      } else if (error.code === "auth/too-many-requests") {
        return Promise.reject(notification.error("Too many unsuccessful login attempts. Try again later or reset password now."));
      } else {
        return Promise.reject(notification.error(error.message));
      }
    });
  };
};

export function useSignupWithEmail() {
  const notification = useSnackbarNotification();

  return async function signupWithEmail({
    email,
    password,
    firstName,
    lastName,
  }: SignupWithEmailProps): Promise<any> {
    const emailNoSpaces = email.replace(/ /g, "");
    try {
      log.info("SignupWithEmail:email", emailNoSpaces, "password:", password);
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      const userCredential: firebase.auth.UserCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(emailNoSpaces, password);
      const uid = userCredential.user?.uid;
      const user: UserData = { firstName, lastName };
      const newUser = await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .set(user);
      log.info("created new user with email:", emailNoSpaces, "uid:", newUser);
      const verificationResult = await userCredential.user
        ?.sendEmailVerification()
        .catch(function (error) {
          log.error("sendEmailVerification failed with error:", error);
          return Promise.reject(notification.error(error));
        });
      log.info("sendEmailVerification result:", verificationResult);
      return newUser;
    } catch (error) {
      let registrationError = "Error registering account";
      if (error.code === "auth/email-already-in-use") {
        registrationError =
          "There is already an account associated with this email address. Please login to continue.";
      }
      return Promise.reject(notification.error(registrationError));
    }
  };
}

export const signinWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};
