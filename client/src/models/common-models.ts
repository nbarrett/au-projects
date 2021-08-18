import * as React from "react";

export function hasUid<T>(document: any): document is WithUid<T> {
    return (document as WithUid<T>).uid !== undefined;
}

export function hasUidWithValue<T>(document: any): document is WithUid<T> {
    return hasUid(document) && (document as WithUid<T>)?.uid?.length > 0;
}

export interface HasUid {
    uid?: string;
}

export interface WithUid<T> {
    uid: string;
    data: T;
    markedForDelete?: boolean
}

export interface HasAuditTimestamps {
    updatedAt?: number;
    createdAt?: number;
}

export interface HasAuditUsers {
    updatedBy?: string;
    createdBy?: string;
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export interface Property {
    name: string;
    value: string | number;
}

export interface CellAddress {
    field: string;
    rowIndex: number;
    numeric?: boolean;
}

export interface UniqueValues {
    [fieldName: string]: any[]
}

export interface GridColumnVisibilityChangeParams {
    /**
     * The field of the column which visibility changed.
     */
    field: string;
    /**
     * The column of the current header component.
     */
    colDef: any;
    /**
     * API ref that let you manipulate the grid.
     */
    api: any;
    /**
     * The visibility state of the column.
     */
    isVisible: boolean;
}
