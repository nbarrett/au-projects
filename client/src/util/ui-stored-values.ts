import { log } from "./logging-config";
import { booleanOf } from "./strings";

export enum StoredValue {
  COMPANIES = "companies",
  COMPANIES_IN_EDIT_MODE = "companies-in-edit-mode",
  COMPANY = "company",
  CURRENT_USER = "current-user",
  CURRENT_USER_DATA = "current-user-data",
  FIREBASE_AUTH = "firebase-auth",
  FIREBASE_STORAGE = "firestore-storage",
  FIRESTORE = "firestore",
  MOBILE_OPEN = "mobile-open",
  NAVBAR_SEARCH = "navbar-search",
  ORDER = "order",
  ORDERS = "orders",
  PRICING_TIERS = "pricing-tiers",
  PRODUCT_CODING = "product-coding",
  PRODUCT_CODING_MAP = "product-coding-map",
  PRODUCTS = "products",
  PRODUCTS_IN_EDIT_MODE = "products-in-edit-mode",
  TAB = "tab",
  TOOLBAR_BUTTONS = "toolbar-buttons",
  USER = "user",
  USER_ROLES = "user-roles",
  USERS = "users",
}
export function initialValueFor(parameter: string, defaultValue?: any): string {
  const localStorageValue = localStorage.getItem(parameter);
  const value = localStorageValue || defaultValue;
  log.debug("initial value for:", parameter, "localStorage:", localStorageValue, "default:", defaultValue, "is:", value);
  return value;
}

export function initialBooleanValueFor(parameter: string, defaultValue?: any): boolean {
  return booleanOf(initialValueFor(parameter, defaultValue));
}

export function saveValueFor(parameter: string, value?: any) {
  if (parameter) {
    const storedValue: string = typeof value === "object" ? JSON.stringify(value) : value.toString();
    log.debug("saving value for:", parameter, "as:", storedValue);
    localStorage.setItem(parameter, storedValue);
  } else {
    log.error("saveValueFor:no parameter value supplied for value:", value);
  }
}

export function removeItemFor(parameter: string) {
  log.debug("removing value for:", parameter);
  localStorage.removeItem(parameter);
}
