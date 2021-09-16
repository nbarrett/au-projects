import DashboardLayout from "../../admin/components/DashboardLayout";
import Account from "../account/Account";
import Login from "../login/Login";
import Products from "../products/Products";
import Register from "../login/Register";
import EmailVerification from "../email-verification/EmailVerification";
import Companies from "../companies/Companies";
import CompanyEdit from "../company/CompanyEdit";
import ExampleDashboard from "../example-dashboard/ExampleDashboard";
import Prices from "../prices/Prices";
import { PricingSetup } from "../price-setup/PricingSetup";
import { ProductCodings } from "../products/ProductCodings";
import { ProductCodingType } from "../../models/product-models";
import { productRoute } from "../../mappings/product-mappings";
import { Orders } from "../orders/Orders";
import ProductsDataGrid from "../products/ProductsDataGrid";
import { UserAdmin } from "../users/UserAdmin";
import { Navigate, RouteObject } from "react-router";
import React, { ReactNode, useEffect } from "react";
import LoadingDiv from "../../components/LoadingDiv";
import { log } from "../../util/logging-config";
import { Home } from "../home/Home";
import EmptyContainer from "../../admin/components/EmptyContainer";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import useUserRoles from "../../hooks/use-user-roles";
import { toAppRoute, toFullScreenRoute } from "../../mappings/route-mappings";
import { AppRoute, PUBLIC_PATH, ROOT } from "../../models/route-models";
import isEmpty from "lodash/isEmpty";

export default function AppRoutes() {
  const location = useLocation();
  const {user, loading, debugCurrentUser} = useFirebaseUser();
  const currentUserRoles = useUserRoles().forCurrentUser();
  const systemAccessAndEmailVerified = currentUserRoles?.data?.systemAccess && user?.emailVerified;
  const navigate = useNavigate();

  const ORDERS: RouteObject[] = currentUserRoles?.data?.orders ? [{path: AppRoute.ORDERS, element: <Orders/>}] : [];

  const USER_ADMIN: RouteObject[] = currentUserRoles?.data?.userAdmin ? [{
    path: AppRoute.USER_ADMIN,
    element: <UserAdmin/>
  }] : [];

  const ACCOUNT_SETTINGS: RouteObject[] = currentUserRoles?.data?.accountSettings ? [{
    path: AppRoute.ACCOUNT_SETTINGS,
    element: <Account/>
  }] : [];

  const BACK_OFFICE: RouteObject[] = currentUserRoles?.data?.backOffice ? [
    {path: AppRoute.COMPANIES, element: <Companies/>},
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

  const HOME = currentUserRoles?.data?.systemAccess ? [{path: AppRoute.HOME, element: <Home/>}] : [];

  const PUBLIC_ROUTES: RouteObject[] = [
    {path: AppRoute.EMAIL_VERIFICATION, element: <EmailVerification/>},
    {path: AppRoute.LOGIN, element: <Login/>},
    {path: AppRoute.REGISTER, element: <Register/>}
  ];

  const REDIRECT_CHILDREN = [
    {element: protectedRoute(<Navigate to={toAppRoute(AppRoute.HOME)}/>, <Navigate to={toAppRoute(AppRoute.LOGIN)}/>)}];

  const APP_ROUTES: RouteObject = {
    path: ROOT,
    element: protectedRoute(<DashboardLayout/>, <EmptyContainer/>),
    children: ORDERS
        .concat(USER_ADMIN)
        .concat(ACCOUNT_SETTINGS)
        .concat(BACK_OFFICE)
        .concat(HOME)
        .concat(PUBLIC_ROUTES)
  };

  const FULL_SCREEN_ROUTES = currentUserRoles?.data?.backOffice ? {
    path: toFullScreenRoute(AppRoute.PRODUCTS),
    element: <ProductsDataGrid/>,
  } : {};

  const REDIRECT_ROUTES: RouteObject = {
    path: PUBLIC_PATH,
    element: protectedRoute(<DashboardLayout/>, <EmptyContainer/>),
    children: REDIRECT_CHILDREN,
  };

  const ROUTES: RouteObject[] = [
    APP_ROUTES,
    FULL_SCREEN_ROUTES,
  ].filter(route => !isEmpty(route));

  useEffect(() => {
    const validRoutes = ROUTES.map(item => item?.children?.map(item => toAppRoute(item.path as AppRoute))).flat(2);
    log.debug("AppRoutes:useEffect user:", debugCurrentUser(), "currentUserRoles:", currentUserRoles, "validRoutes:", validRoutes, "validRoutes", validRoutes);
    if (!loading && !user && location.pathname !== toAppRoute(AppRoute.LOGIN)) {
      log.debug("AppRoutes - redirecting non-logged in user at path", location.pathname, "to", toAppRoute(AppRoute.LOGIN));
      navigate(toAppRoute(AppRoute.LOGIN));
    } else if (user && !isEmpty(currentUserRoles.data) && !validRoutes.includes(location.pathname)) {
      log.debug("AppRoutes - location.pathname", location.pathname, "is not valid");
      navigate(toAppRoute(AppRoute.HOME));
    }
  }, [user, loading, currentUserRoles]);

  function protectedRoute(loggedInComponent: ReactNode, notLoggedInComponent: ReactNode) {
    log.debug("protectedRoute:user:", debugCurrentUser(), "loading:", loading, "systemAccess:", currentUserRoles?.data?.systemAccess, "systemAccessAndEmailVerified", systemAccessAndEmailVerified);
    return loading ?
        <LoadingDiv/> : systemAccessAndEmailVerified ? loggedInComponent : notLoggedInComponent;
  }

  return useRoutes(ROUTES);
}
