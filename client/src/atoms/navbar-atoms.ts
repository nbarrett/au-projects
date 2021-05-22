import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";

export const navbarSearchState = atom<string>({
  key: StoredValue.NAVBAR_SEARCH,
  default: ""
});

export const toolbarButtonState = atom<string[]>({
  key: StoredValue.TOOLBAR_BUTTONS,
  default: []
});
