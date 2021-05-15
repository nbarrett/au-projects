import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../constants";
import { currentUser } from '../atoms/user-data-services';

export const useLogout = () => {
    const notification = useSnackbarNotification();
    const navigate = useNavigate();
    return () => {
        if (currentUser()?.email)
            firebase
                .auth()
                .signOut()
                .then(() => {
                    localStorage.removeItem("account_ids");
                    notification.success("Successfully signed out");
                    navigate(LOGIN_ROUTE, {replace: true});
                })
                .catch(() => {
                    notification.error(
                        "Error signing out. Refresh the page and try again."
                    );
                });
    };
};
