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
    numeric: boolean;
}

export enum CellFormat {PERCENT, NUMERIC, CURRENCY, STRING}

export enum CellComponent {TEXTFIELD, AUTOCOMPLETE}


export interface DataColumn {
    fieldName: string;
    cellFormat: CellFormat;
    component?: CellComponent;
    disablePadding: boolean;
    disabled?: boolean;
    noWrap: boolean;
    label: string;
}

export interface UniqueValues {
    [fieldName: string]: any[]
}
