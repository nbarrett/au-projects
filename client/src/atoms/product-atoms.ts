import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";

export const productsInEditModeState = atom<string[]>({
  key: StoredValue.PRODUCTS_IN_EDIT_MODE,
  default: []
});

