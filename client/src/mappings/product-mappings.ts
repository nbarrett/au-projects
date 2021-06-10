import { WithUid } from "../models/common-models";
import { Product } from '../models/product-models';
import { stringifyObject } from '../util/strings';
import { omit } from 'lodash';
import { asNumber } from '../util/numbers';

export const DEFAULT_THICKNESSES = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 35, 40, 45];

export function productDetails(product: WithUid<Product>): string {
    return stringifyObject(omit(product.data, ["title", "updatedAt", "media"]), null, true);
}

export function productMarkup(product: WithUid<Product>): number {
    return asNumber(asNumber(product?.data.costPerKg) * (product?.data.markup / 100), 2);
}
