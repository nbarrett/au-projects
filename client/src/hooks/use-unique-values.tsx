import { UniqueValues, WithUid } from "../models/common-models";
import { log } from "../util/logging-config";

export default function useUniqueValues<T>(allDocuments: WithUid<T>[]) {

    const values: UniqueValues = {}

    allDocuments.forEach((document: WithUid<T>) => {
        Object.entries(document.data).forEach((fieldValue: [string, string]) => {
            const field = fieldValue[0];
            const value: any = typeof fieldValue[1] === "string" ? fieldValue[1].trim() : fieldValue[1];
            if (value) {
                if (!values[field]) {
                    values[field] = [value]
                } else if (!values[field].includes(value)) {
                    values[field] = values[field].concat(value).sort()
                }
            }
        })
    })

    log.info("useUniqueValues:from", allDocuments.length, "documents - generated", values)

    return {values}

}
