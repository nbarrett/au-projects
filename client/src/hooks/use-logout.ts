import firebase from "firebase";
import { useLocation } from "react-router";
import { log } from "../util/logging-config";
import { useFirebaseUser } from "./use-firebase-user";
import useSnackbar from "./use-snackbar";
import { useNavbarSearch } from "./use-app-routes";
import { AppRoute } from "../models/route-models";

export function useLogout() {
    const notification = useSnackbar();
    const {user, debugCurrentUser} = useFirebaseUser();
    const location = useLocation();
    const {navigateIfRequiredTo} = useNavbarSearch();

    function logout(from: string, refreshWindowAfter?: boolean): Promise<void> {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                log.debug("after logout from", from, "user:", debugCurrentUser(), "route:", location.pathname);
                if (refreshWindowAfter) {
                    log.debug("refreshing window to ensure user is cleared from browser session")
                    window.location.reload(false);
                }
                navigateIfRequiredTo(AppRoute.LOGIN);
            })
            .catch((error) => {
                notification.error("Error signing out. Refresh the page and try again." + error.toString());
            });
    }

    return logout;
}
