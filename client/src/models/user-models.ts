import { FirebaseAdminUser } from './authentication-models';

export interface AuthenticatedUserData extends UserData, FirebaseAdminUser {
}

export interface UserData {
    uid?: string;
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    phone?: string;
}
