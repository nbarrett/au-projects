import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { SignupWithEmailProps, UseSigninWithEmailProps, } from "../models/authentication-models";
import { log } from "../util/logging-config";
import useCurrentUser from "../hooks/use-current-user";

export const useSignInWithEmail = () => {

  const notification = useSnackbarNotification();

  return async function signInWithEmail({
    email,
    password,
    rememberMe,
  }: UseSigninWithEmailProps): Promise<any> {
    log.debug("about to login:setPersistence");
    await firebase
        .auth()
        .setPersistence(
            rememberMe
                ? firebase.auth.Auth.Persistence.LOCAL
                : firebase.auth.Auth.Persistence.SESSION
        );
    log.debug("about to login:signInWithEmailAndPassword");
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
  const currentUser = useCurrentUser();
  return async function signupWithEmail({
                                          email,
                                          password,
                                          firstName,
                                          lastName
                                        }: SignupWithEmailProps): Promise<any> {
    try {
      const verificationResult = currentUser.signup(email, password, firstName, lastName)
          .catch((error) => errorHandler(error));
      log.debug("sendEmailVerification result:", verificationResult);
      return verificationResult;
    } catch (error) {
      return errorHandler(error);
    }
  };

  function errorHandler(error) {
    let registrationError = "Error registering account";
    if (error.code === "auth/email-already-in-use") {
      registrationError =
          "There is already an account associated with this email address. Please login to continue.";
    }
    return Promise.reject(notification.error(registrationError));
  }

}

export const signinWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};
