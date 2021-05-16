export const APP_NAME = "AU Projects";

export enum AppRoute {
  LOGIN = "login",
  ACCOUNT = "account",
  USERS = "users",
  COMPANIES = "companies",
  DASHBOARD = "dashboard",
  PRODUCTS = "products",
  EXAMPLE_DASHBOARD = "example-dashboard",
  SETTINGS = "settings"
}

export enum PublicRoute {
  EMAIL_VERIFICATION = "email-verification",
  LOGIN = "login",
  REGISTER = "register",
  NOT_FOUND = "404",
  ASTERISK = "*",
}

export const APP_PATH = "app";
export const PUBLIC_PATH = "//*";
export const APP_DASHBOARD = `/${APP_PATH}/${AppRoute.EXAMPLE_DASHBOARD}`;

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAi_2ndipc1AOGbwc3j4xMTqicD2_y4RK4",
  authDomain: "au-projects-f9643.firebaseapp.com",
  projectId: "au-projects-f9643",
  storageBucket: "au-projects-f9643.appspot.com",
  messagingSenderId: "866932995375",
  appId: "1:866932995375:web:43307e7412f28d46051dda",
  measurementId: "G-P0X1XKCY49",
};
