import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { useNavigate } from "react-router-dom";
import { SIGNIN_ROUTE } from "../constants";

export const useLogout = () => {
  const notification = useSnackbarNotification();
  const navigate = useNavigate();
  return () =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("account_ids");
        notification.success("Successfully signed out");
        navigate(SIGNIN_ROUTE, { replace: true });
      })
      .catch(() => {
        notification.error(
          "Error signing out. Refresh the page and try again."
        );
      });
};
