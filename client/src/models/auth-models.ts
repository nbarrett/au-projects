export interface SignupWithEmailProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserData {
  uid?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  phone?: string;
}

export interface FirebaseUser {
  email?: string;
  uid?: string;
  emailVerified?: boolean;
}

export interface UseSigninWithEmailProps {
  email: string;
  password: string;
  rememberMe?: boolean;
}
