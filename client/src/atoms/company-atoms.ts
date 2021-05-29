import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { Company } from "../models/company-models";
import { WithUid } from '../models/common-models';

export const companiesInEditModeState = atom<string[]>({
  key: StoredValue.COMPANIES_IN_EDIT_MODE,
  default: []
});

export const companiesState = atom<WithUid<Company>[]>({
  key: StoredValue.COMPANIES,
  default: []
});

