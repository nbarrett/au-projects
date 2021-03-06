import { WithUid } from "../models/common-models";
import { PricedProduct, PricingTier, Product, ProductCodingType } from "../models/product-models";
import { asNumber } from "../util/numbers";
import { log } from "../util/logging-config";
import { GridValueGetterParams } from "@mui/x-data-grid";
import kebabCase from "lodash/kebabCase";
import { stringifyObject } from "../util/strings";
import { omit } from "lodash";
import { AppRoute } from "../models/route-models";

export function productRoute(type: ProductCodingType): string {
    return `${AppRoute.PRODUCTS}/${kebabCase(type)}`;
}

export function productDetails(product: WithUid<Product>): string {
    return stringifyObject(omit(product.data, ["title", "updatedAt", "media"]), null, true);
}

export function pricePerKgFromGrid(params: GridValueGetterParams): string {
    const product = params.row as Product;
    const number = pricePerKgFunction(product?.costPerKg, product?.markup);
    return number ? "R " + number.toFixed(2) : undefined;
}

export function asCurrency(value: any) {
    log.debug("asCurrency:", value);
    return value ? "R " + asNumber(value).toFixed(2) : undefined;
}

export function asKg(value: any) {
    log.debug("asKg:", value);
    return value ? asNumber(value).toFixed(0) +" Kg" : undefined;
}

export function asCurrencyFromGrid(params: GridValueGetterParams): string {
    return asCurrency(params.value);
}

export function asPercent(params: GridValueGetterParams): string {
    return params.value ? (params.value + " %") : "";
}

function pricePerKgFunction(costPerKg: number, markup: number): number {
    const price = asNumber(costPerKg * (markup / 100), 2);
    log.debug("pricePerKg:costPerKg:", costPerKg, "markup:", markup, "price:", price);
    return price;
}

export function pricePerKg(product: WithUid<Product>): number {
    return product ? pricePerKgFunction(product?.data?.costPerKg, product?.data?.markup) : null;
}

export function salePricePerKg(product: WithUid<Product>, pricingTier: PricingTier): number {
    return product ? asNumber(asNumber(pricePerKg(product)) * (pricingTier?.pricingFactor / 100), 2) : null;
}

export function priceWithLosses(product: WithUid<Product>, percentLosses: number) {
    const costPerKg = product?.data?.costPerKg || 0;
    return costPerKg + (costPerKg * percentLosses / 100);
}

export function toPricedProduct(product: WithUid<Product>, pricingTier: PricingTier): WithUid<PricedProduct> {
    return {
        uid: product.uid,
        data: {
            ...product.data,
            ...({
                pricePerKg: pricePerKg(product),
                salePricePerKg: salePricePerKg(product, pricingTier),
                pricingFactor: pricingTier?.pricingFactor,
                pricingTierName: pricingTier?.name
            })
        }
    };
}

