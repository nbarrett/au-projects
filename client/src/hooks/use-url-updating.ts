import isNaN from "lodash/isNaN";
import map from "lodash/map";
import isArray from "lodash/isArray";
import { useNavigate } from "react-router-dom";
import { NamedParameter, UrlChange } from "../models/common-models";
import { log } from "../util/logging-config";
import { stringify } from "../util/strings";
import { useUrls } from "./use-urls";

export function useUpdateUrl(): (UrlChange) => void {
    const navigate = useNavigate();
    const urls = useUrls();

    function updateUrl(urlChange: UrlChange): string {
        log.debug("updateUrl:urlChange:", urlChange);
        const parameterChanges = neededParameterChanges(urlChange);
        const currentUrl = urls.baseUrlAndSearch();
        if ((urlChange?.path || parameterChanges.length > 0)) {
            const searchParamsBuilder = urls.searchParamsBuilder().saveToLocalStorage(urlChange.save);
            parameterChanges.forEach(parameter => {
                log.debug("setting name:", parameter.name, "value:", parameter.value);
                searchParamsBuilder.set(parameter.name, parameter.value?.toString());
            });
            const newUrl = `${urlChange.path || urls.baseUrl()}?${searchParamsBuilder.searchParams.toString()}`;

            log.debug("currentUrl:", currentUrl, (urlChange.push ? "push" : "replace"), "to:", newUrl);
            if (currentUrl === newUrl) {
                log.debug("not navigating - already at:", currentUrl);
            } else if (urlChange.push) {
                navigate(newUrl);
            } else {
                navigate(newUrl, {replace: true});
            }
            return newUrl;
        } else {
            log.debug("no action", "name", urlChange.name, "value", urlChange.value, urlChange.push ? "push" : "replace", "path:", urlChange.path);
            return currentUrl;
        }
    }

    function toNamedParameters(parameters: any): NamedParameter[] {
        log.debug("toNamedParameters:parameters:", parameters);
        return isArray(parameters) ? parameters : (parameters ? map(parameters, (value, key) => ({
            name: key,
            value: stringify(value)
        })) : []);
    }

    function neededParameterChanges(urlChange: UrlChange): NamedParameter[] {
        return (toNamedParameters(urlChange?.parameters)).concat([{name: urlChange.name, value: urlChange.value}])
            .filter(parameterChangeNeeded);
    }

    function parameterChangeNeeded(namedParameter: NamedParameter): boolean {
        const currentValue = urls.queryStringParameter(namedParameter.name);
        const needed: boolean = !!(namedParameter.name && currentValue !== namedParameter?.value?.toString() && !isNaN(namedParameter.value) && namedParameter.value !== "NaN");
        log.debug("parameterChangeNeeded:name:", namedParameter.name, "currentValue:", currentValue, "new value:", namedParameter.value, "needed:", needed);
        return needed;
    }

    return updateUrl;

}

