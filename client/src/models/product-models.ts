import { HasAuditTimestamps } from "./common-models";

export interface Product extends HasAuditTimestamps {
    title: string;
    description?: string;
    specificGravity: number;
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
