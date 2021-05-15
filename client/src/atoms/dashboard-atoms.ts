import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";

export const mobileNavOpenState = atom<boolean>({
  key: StoredValue.MOBILE_OPEN,
  default: false
});
