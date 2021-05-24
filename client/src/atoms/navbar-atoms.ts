import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { ToolbarButton } from '../models/toolbar-models';

export const navbarSearchState = atom<string>({
  key: StoredValue.NAVBAR_SEARCH,
  default: ""
});

export const toolbarButtonState = atom<ToolbarButton[]>({
  key: StoredValue.TOOLBAR_BUTTONS,
  default: []
});
