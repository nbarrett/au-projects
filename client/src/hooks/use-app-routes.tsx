import { useLocation, useNavigate } from "react-router-dom";
import { AppRoute } from "../models/route-models";
import { toAppRoute } from "../mappings/route-mappings";
import { log } from "../util/logging-config";

export function useNavbarSearch() {
    const location = useLocation();
    const navigate = useNavigate();

    function navigateIfRequiredTo(appRoute: AppRoute) {
        const route = toAppRoute(appRoute);
        if (location.pathname !== route) {
            log.debug("navigating from", location.pathname, "to", route);
            navigate(route);
        }
    }

    return {navigateIfRequiredTo};
}
