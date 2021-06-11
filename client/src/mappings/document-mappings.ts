import { WithUid } from '../models/common-models';
import { isEqual } from 'lodash';
import { log } from '../util/logging-config';

export function newDocument<T>(): WithUid<T> {
    return {uid: "", data: {}} as WithUid<T>;
}

export function isNewDocument<T>(document: WithUid<T>): boolean {
    const equal = isEqual(document, newDocument<T>());
    log.debug("isNewDocument:", document, equal)
    return equal;
}
