import { CellFormat, DataColumn, WithUid } from "../models/common-models";
import { isEqual } from "lodash";
import { log } from "../util/logging-config";
import { asMoney } from "../util/strings";
import { asNumber } from "../util/numbers";

export function newDocument<T>(): WithUid<T> {
    return {uid: "", data: {}} as WithUid<T>;
}

export function isNewDocument<T>(document: WithUid<T>): boolean {
    const equal = isEqual(document, newDocument<T>());
    log.debug("isNewDocument:", document, equal)
    return equal;
}

export function formatCell<T>(product: WithUid<T>, dataColumn: DataColumn) {
    const data = product.data[dataColumn.fieldName];
    switch (dataColumn.cellFormat) {
        case CellFormat.CURRENCY:
            return asMoney(data, 2, "R");
        case CellFormat.PERCENT:
            return asNumber(data, 0) + " %"
        case CellFormat.NUMERIC:
            return asNumber(data, 2)
        default:
            return data;
    }
}


