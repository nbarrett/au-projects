import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { WithUid } from "../models/common-models";
import { PricingTier, Product } from "../models/product-models";

export const productsInEditModeState = atom<string[]>({
  key: StoredValue.PRODUCTS_IN_EDIT_MODE,
  default: []
});

export const productsState = atom<WithUid<Product>[]>({
  key: StoredValue.PRODUCTS,
  default: []
});

export const pricingTierState = atom<WithUid<PricingTier>[]>({
  key: StoredValue.PRICING_TIERS,
  default: []
});

