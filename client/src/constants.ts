export const APP_NAME = "AU Projects";

export enum AppRoute {
  ACCOUNT_SETTINGS = "account-settings",
  COMPANIES = "companies",
  COMPANIES_EDIT = "companies/:uid",
  DASHBOARD = "dashboard",
  EXAMPLE_DASHBOARD = "example-dashboard",
  HOME = "home",
  LOGIN = "login",
  ORDERS = "orders",
  PRICES = "prices",
  PRICING_SETUP = "prices/pricing-setup",
  PRODUCTS = "products",
  SETTINGS = "settings",
  USER_ADMIN = "users/admin",
  USERS = "users",
  USERS_EDIT = "users/:uid",
}

export enum PublicRoute {
  EMAIL_VERIFICATION = "email-verification",
  LOGIN = "login",
  REGISTER = "register",
  NOT_FOUND = "404",
  ASTERISK = "*",
}

export const APP_PATH = "app";
export const FULL_SCREEN = "full-screen";
export const PUBLIC_PATH = "//*";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAi_2ndipc1AOGbwc3j4xMTqicD2_y4RK4",
  authDomain: "au-projects-f9643.firebaseapp.com",
  projectId: "au-projects-f9643",
  storageBucket: "au-projects-f9643.appspot.com",
  messagingSenderId: "866932995375",
  appId: "1:866932995375:web:43307e7412f28d46051dda",
  measurementId: "G-P0X1XKCY49",
};
