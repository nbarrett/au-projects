import { log } from "../../util/logging-config";
import { useLocation } from "react-router";

export function DebugRouter({children}: { children: any }) {
    const location = useLocation();
    if (process.env.NODE_ENV === "development") {
        log.debug(`Route: ${location.pathname}${location.search}, Location: ${JSON.stringify(location)}`);
    }
    return children;
}
