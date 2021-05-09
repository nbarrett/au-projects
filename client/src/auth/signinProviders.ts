import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { SignupWithEmailProps, UserData } from "../auth-models";
import { log } from "../util/logging-config";

type UseSigninWithEmailProps = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export const useSigninWithEmail = () => {
  const notification = useSnackbarNotification();

  return async (
    { email, password, rememberMe }: UseSigninWithEmailProps,
    callback?: VoidFunction
  ) => {
    try {
      // local or session storage auth
      await firebase
        .auth()
        .setPersistence(
          rememberMe
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION
        );
      // Login user
      await firebase.auth().signInWithEmailAndPassword(email, password);
      callback?.();
    } catch (error) {
      // compute error message to user
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        notification.error("Email or password is incorrect");
      } else if (error.code === "auth/invalid-email") {
        notification.error("Please enter a valid email");
      } else if (error.code === "auth/too-many-requests") {
        notification.error(
          "Too many unsuccessful login attempts. Try again later or reset password now."
        );
      } else {
        notification.error(error.message);
      }
    }
  };
};

export function useSignupWithEmail() {
  const notification = useSnackbarNotification();

  return async function ({
    email,
    password,
    firstName,
    lastName,
  }: SignupWithEmailProps): Promise<UserData> {
    const emailNoSpaces = email.replace(/ /g, "");
    try {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      const userCredential: firebase.auth.UserCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(emailNoSpaces, password);
      const uid = userCredential.user?.uid;
      const user: UserData = { uid, firstName, lastName };
      const newUser = await firebase.firestore().collection("users").add(user);
      log.info("created new User:", newUser);
      return newUser;
    } catch (error) {
      let registrationError = "Error registering account";
      if (error.code === "auth/email-already-in-use") {
        registrationError =
          "There is already an account associated with this email address. Please login to continue.";
      }
      notification.error(registrationError);
    }
  };
}

export const signinWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};
