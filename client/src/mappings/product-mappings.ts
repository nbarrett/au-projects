import { WithUid } from "../models/common-models";
import { PricedProduct, PricingTier, Product, ProductCodingType } from "../models/product-models";
import { asNumber } from "../util/numbers";
import { log } from "../util/logging-config";
import { GridValueGetterParams } from "@material-ui/data-grid";
import { AppRoute } from "../constants";
import kebabCase from "lodash/kebabCase";

export function productRoute(type: ProductCodingType): string {
    return `${AppRoute.PRODUCTS}/${kebabCase(type)}`;
}

export function pricePerKgFromRow(params: GridValueGetterParams): string {
    const product = params.row as Product;
    const number = pricePerKgFunction(product.costPerKg, product.markup);
    return number ? "R " + number.toFixed(2) : undefined;
}

export function asCurrency(params: GridValueGetterParams): string {
    log.debug("asCurrency:", params.value);
    return params.value ? "R " + asNumber(params.value).toFixed(2) : undefined;
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
    return pricePerKgFunction(product?.data?.costPerKg, product?.data?.markup);
}

export function salePricePerKg(product: WithUid<Product>, pricingTier: PricingTier): number {
    return asNumber(asNumber(pricePerKg(product)) * (pricingTier?.pricingFactor / 100), 2);
}

export function priceWithLosses(product: WithUid<Product>, percentLosses: number) {
    const costPerKg = product?.data?.costPerKg || 0;
    return costPerKg + (costPerKg * percentLosses / 100);
}

export function thicknessPrice(product: WithUid<Product>, thickness: number, percentLosses: number) {
    return priceWithLosses(product, percentLosses) * product.data.specificGravity * thickness;
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

