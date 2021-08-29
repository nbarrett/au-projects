import firebase from "firebase/app";
import { HasAuditTimestamps } from "./common-models";

export interface UserData extends HasAuditTimestamps {
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    phone?: string;
    companyId?: string;
}

export interface UserRoles extends HasAuditTimestamps {
    systemAccess?: boolean;
    userAdmin?: boolean;
    backOffice?: boolean;
    orders?: boolean;
    accountSettings?: boolean;
}

export interface Session {
    user?: firebase.User;
    loading: boolean;
}

