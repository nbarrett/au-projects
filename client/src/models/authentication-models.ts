export interface SignupWithEmailProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface FirebaseUser {
  email?: string;
  uid?: string;
  emailVerified?: boolean;
}

export interface FirebaseAdminUser {
  uid?: string;
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

export interface UseSigninWithEmailProps {
  email: string;
  password: string;
  rememberMe?: boolean;
}
