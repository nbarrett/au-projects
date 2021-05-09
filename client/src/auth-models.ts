export interface SignupWithEmailProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserData {
  uid?: string | undefined;
  firstName: string;
  lastName: string;
}
