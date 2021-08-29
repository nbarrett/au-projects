import { atom } from "recoil";
import { StoredValue } from "../util/ui-stored-values";
import { UserData, UserRoles } from "../models/user-models";
import { WithUid } from "../models/common-models";
import { newDocument } from "../mappings/document-mappings";

export const userRolesState = atom<WithUid<UserRoles>[]>({
  key: StoredValue.USER_ROLES,
  default: []
});

export const usersState = atom<WithUid<UserData>[]>({
  key: StoredValue.USERS,
  default: []
});

export const userState = atom<WithUid<UserData>>({
  key: StoredValue.USER,
  default: newDocument<UserData>()
});
