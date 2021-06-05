import { WithUid } from "../models/common-models";
import { Product } from '../models/product-models';
import { stringifyObject } from '../util/strings';
import { omit } from 'lodash';

export function productDetails(product: WithUid<Product>): string {
    return stringifyObject(omit(product.data, ["title", "updatedAt", "media"]), null, true);
}
