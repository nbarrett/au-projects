import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../data-services/user-services";
import { PublicRoute } from "../constants";
import { useLocation } from "react-router";
import { log } from "../util/logging-config";

export const useLogout = () => {
    const notification = useSnackbarNotification();
    const navigate = useNavigate();
    const location = useLocation();
    return () => {
        if (currentUser()?.email)
            firebase
                .auth()
                .signOut()
                .then(() => {
                    localStorage.removeItem("account_ids");
                    log.info?.("location.pathname", location.pathname)
                    if (!location.pathname.includes(PublicRoute.LOGIN)) {
                        navigate(`/${PublicRoute.LOGIN}`, {replace: true});
                    }
                })
                .catch(() => {
                    notification.error(
                        "Error signing out. Refresh the page and try again."
                    );
                });
    };
};
