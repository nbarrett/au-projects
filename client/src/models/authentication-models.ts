import { UserData } from "./user-models";
import { HasUid } from "./common-models";

export interface SignupWithEmailProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface FirebaseUser extends HasUid {
  email?: string;
  emailVerified?: boolean;
}

export interface AuthenticatedUserData extends UserData, FirebaseAdminUser {
}

export interface FirebaseAdminUser extends HasUid {
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  disabled: boolean;
  metadata: {
    lastSignInTime: string;
    creationTime: string
  };
}

export interface UseLoginWithEmailProps {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}
