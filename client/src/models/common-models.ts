export function hasUid<T>(document: any): document is WithUid<T> {
    return (document as WithUid<T>).uid !== undefined;
}

export interface HasUid {
    uid?: string;
}

export interface WithUid<T> {
    uid?: string;
    data: T;
}

export interface HasAuditTimestamps {
    updatedAt?: number;
    createdAt?: number;
}
