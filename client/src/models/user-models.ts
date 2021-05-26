import { HasUid } from "./common-models";

export interface UserData extends HasUid {
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    phone?: string;
}
