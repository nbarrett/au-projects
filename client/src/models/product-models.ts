import { HasAuditTimestamps } from "./common-models";
import { GridColDef } from "@material-ui/data-grid";

export interface Product extends HasAuditTimestamps {
    title: string;
    description?: string;
    specificGravity: number;
    compoundOwner?: string;
    type?: string;
    costPerKg?: number;
    colour?: string;
    hardness?: string;
    curingMethod?: string;
    grade?: string;
    media?: any;
    markup: number;
}

export interface PricingTier extends HasAuditTimestamps {
    name: string;
    pricingFactor: number;
}

export interface ProductCoding extends HasAuditTimestamps {
    productCodingType: ProductCodingType,
    name: string;
    code: string;
}

export enum ProductCodingType {
    COMPOUND = "COMPOUND",
    COLOUR = "COLOUR",
    CURING_METHOD = "CURING_METHOD",
    GRADE = "GRADE",
    HARDNESS = "HARDNESS"
}

export interface PricedProduct extends Product {
    pricePerKg: number;
    salePricePerKg: number;
    pricingFactor: number;
    pricingTierName: string;
}

export interface ProductConfiguration {
    lossesAllowance: number;
    thicknesses: number[]
}

export const productCodingColumns: GridColDef[] = [
    {
        field: "code",
        headerName: "Code",
        editable: true,
        flex: 1,
        minWidth: 180,
        type: "string"
    }, {
        field: "name",
        headerName: "Name",
        editable: true,
        flex: 1,
        minWidth: 180,
        type: "string"
    }];
