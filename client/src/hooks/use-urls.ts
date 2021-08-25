import { booleanOf, stringify } from "../util/strings";
import { log } from "../util/logging-config";
import map from "lodash/map";
import last from "lodash/last";
import { useLocation } from "react-router-dom";
import { SearchParamsBuilder } from "../util/SearchParamsBuilder";

export function useUrls() {

    const location = useLocation();

    function searchParams(): URLSearchParams {
        return new URLSearchParams(location.search);
    }

    function urlFrom(href?: string): URL {
        const defaultHref = href || window.location.href;
        const fullUrl = defaultHref.startsWith("http") ? defaultHref : "file://" + defaultHref;
        return new URL(fullUrl);
    }

    function lastSegmentOf(href?: string): string {
        return last(urlFrom(href).pathname.split("/").filter(item => item));
    }

    function hostFrom(href?: string): string {
        return urlFrom(href).origin;
    }

    function baseUrl(href?: string): string {
        return urlFrom(href).pathname;
    }

    function baseUrlAndSearch(href?: string): string {
        const url = urlFrom(href);
        return url.pathname + url.search;
    }

    function updateQueryStringParameters(object: Record<string, unknown>): URLSearchParams {
        const params = searchParams();
        map(object, (value, key) => {
            params.set(key, stringify(value));
        });
        return params;
    }

    function updateQueryStringParameter(key: string, value: string | number): URLSearchParams {
        log.debug("updateQueryStringParameter:key", key, "value:", value, "search:", location.search);
        const params = searchParams();
        params.set(key, stringify(value));
        log.debug("updateQueryStringParameter:returning params", params.toString());
        return params;
    }

    function deleteQueryStringParameter(key: string) {
        const params = searchParams();
        params.delete(key);
        return params;
    }

    function queryStringParameter(parameter: string) {
        const value = searchParams().get(parameter);
        log.debug("location.search:", location.search, "parameter", parameter, "is", value);
        return value;
    }

    function booleanQueryStringParameter(parameter: string): boolean {
        return booleanOf(queryStringParameter(parameter));
    }

    function relativeUrl(url) {
        const href = window.location.href;
        return href + (href.substr(href.length - 1) === "/" ? "" : "/") + url;
    }

    function initialStateAsArrayFor(parameter: string, defaultValue?: string[]): string[] {
        const strings = initialStateFor(parameter, "").split(",").filter(data => data?.trim().length > 0);
        log.debug("initialStateAsArrayFor:", strings, "defaultValue:", defaultValue);
        return strings.length === 0 ? (defaultValue || []) : strings;
    }

    function initialStateFor(parameter: string, defaultValue?: any): string {
        const param = queryStringParameter(parameter);
        const localStorageParameter = localStorage.getItem(parameter);
        log.debug("initialStateFor:", parameter, "1:param:", param, "2:localStorage:", localStorageParameter, "of type:", typeof localStorageParameter, "3:defaultValue:", defaultValue);
        return param || localStorageParameter || defaultValue;
    }

    function initialBooleanStateFor(parameter: string, defaultValue?: any): boolean {
        return booleanOf(initialStateFor(parameter, defaultValue));
    }

    function searchParamsBuilder() {
        return SearchParamsBuilder.create(searchParams());
    }

    return {
        initialBooleanStateFor, initialStateFor, initialStateAsArrayFor, relativeUrl,
        booleanQueryStringParameter, queryStringParameter, deleteQueryStringParameter, updateQueryStringParameter,
        baseUrlAndSearch, baseUrl, hostFrom, lastSegmentOf, urlFrom, searchParams, searchParamsBuilder
    };
}

