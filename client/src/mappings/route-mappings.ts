import { AppRoute, FULL_SCREEN } from "../models/route-models";

export function toAppRoute(appRoute: AppRoute) {
    return `/${appRoute}`;
}

export function toFullScreenRoute(appRoute: AppRoute) {
    return `/${FULL_SCREEN}/${appRoute}`;
}
