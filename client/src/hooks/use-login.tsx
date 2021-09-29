import firebase from "firebase";
import useSnackbar from "./use-snackbar";
import { SignupWithEmailProps, UseLoginWithEmailProps, } from "../models/authentication-models";
import { log } from "../util/logging-config";
import useCurrentUser from "./use-current-user";
import { useLogout } from "./use-logout";
import useNotificationMessages from "./use-notification-messages";

export const useLoginWithEmail = () => {

  const snackbar = useSnackbar();
  return async function signInWithEmail({
                                          email,
                                          password,
                                          rememberMe,
                                        }: UseLoginWithEmailProps): Promise<any> {
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
        return Promise.reject(snackbar.error("The password you entered was not recognised"));
      } else if (error.code === "auth/user-not-found") {
        return Promise.reject(snackbar.error("The email address you entered was not recognised"));
      } else if (error.code === "auth/invalid-email") {
        return Promise.reject(snackbar.error("The email address you entered was not in the right format"));
      } else if (error.code === "auth/too-many-requests") {
        return Promise.reject(snackbar.error("Too many unsuccessful login attempts. Try again later or reset password now."));
      } else {
        return Promise.reject(snackbar.error(error.message));
      }
    });
  };
};

export function useSignupWithEmail() {
  const logout = useLogout();
  const currentUser = useCurrentUser();
  const notificationMessages = useNotificationMessages();

  return async function signupWithEmail({
                                          email,
                                          password,
                                          firstName,
                                          lastName
                                        }: SignupWithEmailProps): Promise<any> {
      const verificationResult = await currentUser.signup(email, password, firstName, lastName)
          .catch((error) => errorHandler(error));
      log.debug("sendEmailVerification result:", verificationResult);
      if (verificationResult.additionalUserInfo.isNewUser) {
        notificationMessages.showNewUserRegistered(verificationResult.user, () => logout("newUserRegistered"));
      }
      return verificationResult;
  };

  function errorHandler(error) {
      log.error("errorHandler:", error);
      return Promise.reject(notificationMessages.showRegistrationError(error));
  }

}

export const loginWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};
