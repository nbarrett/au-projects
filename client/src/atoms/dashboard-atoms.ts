import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";

export const mobileNavOpenState = atom<boolean>({
  key: StoredValue.MOBILE_OPEN,
  default: false
});

export const toolbarButtonState = atom<string[]>({
  key: StoredValue.TOOLBAR_BUTTONS,
  default: []
});
