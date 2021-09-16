import firebase from "firebase";
import { useSnackbarNotification } from "../snackbarNotification";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { log } from "../util/logging-config";
import { useFirebaseUser } from "../hooks/use-firebase-user";
import { AppRoute } from "../models/route-models";
import { toAppRoute } from "../mappings/route-mappings";

export const useLogout = () => {
    const notification = useSnackbarNotification();
    const navigate = useNavigate();
    const {user, debugCurrentUser} = useFirebaseUser();
    const location = useLocation();

    function logout(from: string): Promise<void> {
        if (user?.email) {
            log.info("logout:logging out user", debugCurrentUser(), "from:", from);
            return firebase
                .auth()
                .signOut()
                .then(() => {
                    localStorage.removeItem("account_ids");
                    log.info("location.pathname", location.pathname);
                    if (location.pathname !== toAppRoute(AppRoute.LOGIN)) {
                        navigate(toAppRoute(AppRoute.LOGIN), {replace: true});
                    }
                })
                .catch(() => {
                    notification.error(
                        "Error signing out. Refresh the page and try again."
                    );
                });
        } else {
            log.info("logout:not performing as user:", debugCurrentUser(), "from:", from);
            return Promise.resolve();
        }
    }

    return logout;
};
