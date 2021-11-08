import { AppRoute, FULL_SCREEN } from "../models/route-models";

export function toAppRoute(appRoute: AppRoute, ...paths: string[]) {
    const prefix = appRoute.startsWith("/") ? "" : "/";
    return `${prefix}${appRoute}${paths.length > 0 ? "/" : ""}${paths.join("/")}`;
}

export function toFullScreenRoute(appRoute: AppRoute) {
    return `/${FULL_SCREEN}/${appRoute}`;
}
