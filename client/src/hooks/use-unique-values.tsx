import get from "lodash/get";
import { UniqueValues, WithUid } from "../models/common-models";
import { log } from "../util/logging-config";

export default function useUniqueValues<T>(allDocuments: WithUid<T>[]) {

    const topLevelValues: UniqueValues = {}
    const nestedValues: { [fieldName: string]: UniqueValues } = {}
    processDocuments(allDocuments.map(item => item.data), topLevelValues);

    Object.entries(topLevelValues).forEach((fieldValue: [string, any[]]) => {
        const field = fieldValue[0];
        if (typeof fieldValue[1][0] === "object") {
            log.debug("adding nested field", field, "with:", fieldValue[1])
            nestedValues[field] = {}
            processDocuments(fieldValue[1], nestedValues[field])
        }
    })

    function processDocuments(allDocuments: any[], values: UniqueValues) {
        allDocuments.forEach((document: WithUid<T>) => {
            Object.entries(document).forEach((fieldValue: [string, string]) => {
                const field = fieldValue[0];
                const value: any = typeof fieldValue[1] === "string" ? fieldValue[1].trim() : fieldValue[1];
                log.debug("field:", field, "value:", value, typeof value);
                if (value) {
                    if (!values[field]) {
                        values[field] = [value]
                    } else if (!values[field].includes(value)) {
                        values[field] = values[field].concat(value).sort()
                    }
                }
            })
        })
        log.debug("useUniqueValues:from", allDocuments.length, "documents - generated", values)
    }

    const values = {...topLevelValues, ...nestedValues};
    log.debug("topLevelValues:", topLevelValues, "nestedValues:", nestedValues, "allValues:", values);

    function field(path: string): any[] {
        return (get(values, path) || []) as any[];
    }

    return {values, field}

}
