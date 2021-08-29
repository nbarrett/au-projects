import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import MainLayout from "./components/MainLayout";
import Account from "../pages/account/Account";
import Login from "../pages/login/Login";
import NotFound from "../pages/NotFound";
import Products from "../pages/products/Products";
import Register from "../pages/login/Register";
import EmailVerification from "../pages/email-verification/EmailVerification";
import { APP_PATH, AppRoute, FULL_SCREEN, PUBLIC_PATH, PublicRoute } from "../constants";
import Companies from "../pages/companies/Companies";
import CompanyEdit from "../pages/company/CompanyEdit";
import ExampleDashboard from "../pages/example-dashboard/ExampleDashboard";
import Prices from "../pages/prices/Prices";
import { PricingSetup } from "../pages/price-setup/PricingSetup";
import { ProductCodings } from "../pages/products/ProductCodings";
import { ProductCodingType } from "../models/product-models";
import { productRoute } from "../mappings/product-mappings";
import { Orders } from "../pages/orders/Orders";
import ProductsDataGrid from "../pages/products/ProductsDataGrid";
import { UserAdmin } from "../pages/users/UserAdmin";
import firebase from "firebase";
import { PartialRouteObject } from "react-router";
import React, { ReactNode } from "react";
import LoadingDiv from "../components/LoadingDiv";
import { log } from "../util/logging-config";
import { WithUid } from "../models/common-models";
import { UserRoles } from "../models/user-models";
import { Home } from "../pages/home/Home";

export function toAppRoute(appRoute: AppRoute) {
  return `/${APP_PATH}/${appRoute}`;
}

export function toFullScreenRoute(appRoute: AppRoute) {
  return `/${FULL_SCREEN}/${appRoute}`;
}

export default function routes(user: firebase.User, loading: boolean, userRoles: WithUid<UserRoles>): PartialRouteObject[] {

  function protectedRoute(loggedInComponent: ReactNode, notLoggedInComponent: ReactNode) {
    log.debug("protectedRoute:loading", loading, "emailVerified", user?.emailVerified);
    return loading || !userRoles?.data?.systemAccess ?
        <LoadingDiv/> : user?.emailVerified ? loggedInComponent : notLoggedInComponent;
  }

  const ORDERS: PartialRouteObject[] = userRoles?.data?.orders ? [{path: AppRoute.ORDERS, element: <Orders/>}] : [];
  const USER_ADMIN: PartialRouteObject[] = userRoles?.data?.userAdmin ? [{
    path: AppRoute.USER_ADMIN,
    element: <UserAdmin/>
  }] : [];
  const ACCOUNT_SETTINGS: PartialRouteObject[] = userRoles?.data?.accountSettings ? [{
    path: AppRoute.ACCOUNT_SETTINGS,
    element: <Account/>
  }] : [];
  const BACK_OFFICE: PartialRouteObject[] = userRoles?.data?.accountSettings ? [{
    path: AppRoute.COMPANIES,
    element: <Companies/>
  },
    {path: AppRoute.COMPANIES_EDIT, element: <CompanyEdit/>},
    {path: AppRoute.EXAMPLE_DASHBOARD, element: <ExampleDashboard/>},
    {path: AppRoute.PRICES, element: <Prices/>},
    {path: AppRoute.PRICING_SETUP, element: <PricingSetup/>},
    {path: AppRoute.PRODUCTS, element: <Products/>},
    {
      path: productRoute(ProductCodingType.CURING_METHOD),
      element: <ProductCodings productCodingType={ProductCodingType.CURING_METHOD}/>
    },
    {
      path: productRoute(ProductCodingType.HARDNESS),
      element: <ProductCodings productCodingType={ProductCodingType.HARDNESS}/>
    },
    {
      path: productRoute(ProductCodingType.COMPOUND),
      element: <ProductCodings productCodingType={ProductCodingType.COMPOUND}/>
    },
    {
      path: productRoute(ProductCodingType.TYPE),
      element: <ProductCodings productCodingType={ProductCodingType.TYPE}/>
    },
    {
      path: productRoute(ProductCodingType.GRADE),
      element: <ProductCodings productCodingType={ProductCodingType.GRADE}/>
    },
    {
      path: productRoute(ProductCodingType.COLOUR),
      element: <ProductCodings productCodingType={ProductCodingType.COLOUR}/>
    }] : [];

  const FULL_SCREEN_ROUTES = userRoles?.data?.backOffice ? {
    path: toFullScreenRoute(AppRoute.PRODUCTS),
    element: protectedRoute(<ProductsDataGrid/>, <MainLayout/>),
  } : {};

  const HOME = {path: AppRoute.HOME, element: <Home/>};

  const NOT_FOUND_ROUTE = [{path: PublicRoute.ASTERISK, element: <Navigate to="/404"/>}];

  const children: PartialRouteObject[] = [
    ORDERS,
    USER_ADMIN,
    ACCOUNT_SETTINGS,
    BACK_OFFICE,
    HOME,
    NOT_FOUND_ROUTE,
  ].flat(2) as PartialRouteObject[];

  log.debug("user:", user, "userRoles:", userRoles?.data, "loading:", loading, "children:", children);
  return !userRoles?.data?.systemAccess ? [] : [
    {
      path: APP_PATH,
      element: protectedRoute(<DashboardLayout/>, <Navigate to={`/${AppRoute.LOGIN}`}/>),
      children,
    },
    FULL_SCREEN_ROUTES,
    {
      path: PUBLIC_PATH,
      element: protectedRoute(<Navigate to={toAppRoute(AppRoute.HOME)}/>, <MainLayout/>),
      children: [
        {path: PublicRoute.EMAIL_VERIFICATION, element: <EmailVerification/>},
        {path: PublicRoute.LOGIN, element: <Login/>},
        {path: PublicRoute.REGISTER, element: <Register/>},
        {path: PublicRoute.NOT_FOUND, element: <NotFound/>},
        {path: PublicRoute.ASTERISK, element: <Navigate to="/404"/>},
      ],
    },
  ];
}
