import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { Company } from "../models/company-models";
import { WithUid } from "../models/common-models";
import { newDocument } from '../mappings/document-mappings';

export const companiesInEditModeState = atom<string[]>({
  key: StoredValue.COMPANIES_IN_EDIT_MODE,
  default: []
});

export const companiesState = atom<WithUid<Company>[]>({
  key: StoredValue.COMPANIES,
  default: []
});

export const companyState = atom<WithUid<Company>>({
  key: StoredValue.COMPANY,
  default: newDocument<Company>()
});

