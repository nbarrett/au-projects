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
import { RouteObject } from "react-router";
import React, { ReactNode, useEffect } from "react";
import LoadingDiv from "../../components/LoadingDiv";
import { log } from "../../util/logging-config";
import { Home } from "../home/Home";
import EmptyContainer from "../../admin/components/EmptyContainer";
import { useLocation, useRoutes } from "react-router-dom";
import { useFirebaseUser } from "../../hooks/use-firebase-user";
import useUserRoles from "../../hooks/use-user-roles";
import { toAppRoute, toFullScreenRoute } from "../../mappings/route-mappings";
import { AppRoute, ROOT } from "../../models/route-models";
import isEmpty from "lodash/isEmpty";
import useNotificationMessages from "../../hooks/use-notification-messages";
import { useLogout } from "../../hooks/use-logout";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginSubmittedCountState, showVerifyEmailState } from "../../atoms/snackbar-atoms";
import { useNavbarSearch } from "../../hooks/use-app-routes";

export default function AppRoutes() {
  const location = useLocation();
  const {user, loading, debugCurrentUser} = useFirebaseUser();
  const {navigateIfRequiredTo} = useNavbarSearch();
  const userRoles = useUserRoles();
  const currentUserRoles = userRoles.forCurrentUser();
  const systemAccessAndEmailVerified = currentUserRoles?.data?.systemAccess && user?.emailVerified;
  const notificationMessages = useNotificationMessages();
  const logout = useLogout();
  const [showVerifyEmail, setShowVerifyEmail] = useRecoilState<boolean>(showVerifyEmailState);
  const submittedCount = useRecoilValue<number>(loginSubmittedCountState);

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

  const PUBLIC_ROUTES: RouteObject[] = user?.emailVerified ? [] : [
    {path: AppRoute.EMAIL_VERIFICATION, element: <EmailVerification/>},
    {path: AppRoute.LOGIN, element: <Login/>},
    {path: AppRoute.REGISTER, element: <Register/>}
  ];

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

  const FULL_SCREEN_ROUTES: RouteObject = currentUserRoles?.data?.backOffice ? {
    path: toFullScreenRoute(AppRoute.PRODUCTS),
    element: <ProductsDataGrid/>,
  } : {};

  const ROUTES: RouteObject[] = [
    APP_ROUTES,
    FULL_SCREEN_ROUTES,
  ].filter(route => !isEmpty(route));

  const validRoutes = ROUTES.map((item: RouteObject) => [toAppRoute(item.path as AppRoute)].concat(item?.children?.map(item => toAppRoute(item.path as AppRoute)))).flat(2);

  function routeNotValid(): boolean {
    return !validRoutes.find(route => {
      const valid = location.pathname.startsWith(route);
      log.debug("routeValid:location.pathname", location.pathname, "route:", route, "valid:", valid);
      return valid;
    });
  }

  useEffect(() => {
    log.debug("AppRoutes:useEffect user:", debugCurrentUser(), "user roles:", currentUserRoles, "validRoutes:", validRoutes, "pendingUserRoles:", userRoles.pendingUserRoles);
    if (!loading) {
      if (!user && routeNotValid()) {
        log.debug("AppRoutes - redirecting non-logged in user at path", location.pathname, "to", toAppRoute(AppRoute.LOGIN));
        navigateIfRequiredTo(AppRoute.LOGIN);
      } else if (user && !userRoles.pendingUserRoles) {
        if (showVerifyEmail) {
          log.debug("AppRoutes - no action - showVerifyEmail:", showVerifyEmail, "validRoutes:", validRoutes, "user:", debugCurrentUser());
          navigateIfRequiredTo(AppRoute.LOGIN);
        } else if (!user?.emailVerified) {
          notificationMessages.showVerificationNotification(user, () => {
            setShowVerifyEmail(true);
            logout("email not verified", true);
          });
        } else if (!isEmpty(currentUserRoles.data) && routeNotValid()) {
          log.debug("AppRoutes - location.pathname", location.pathname, "is not valid");
          navigateIfRequiredTo(AppRoute.HOME);
        } else if (isEmpty(currentUserRoles.data) && currentUserRoles.uid) {
          log.debug("AppRoutes:useEffect user:", debugCurrentUser(), "no user roles:", currentUserRoles);
          setShowVerifyEmail(false);
          notificationMessages.showNoSystemAccessNotification(user, () => logout("No System Access", true));
        } else {
          log.debug("AppRoutes:useEffect no action path:", debugCurrentUser(), "user roles:", currentUserRoles, "userRoles.pendingUserRoles:", userRoles.pendingUserRoles, "submittedCount:", submittedCount);
        }
      }
    } else {
      log.debug("AppRoutes:useEffect no action path:loading:", loading, "pendingUserRoles:", userRoles.pendingUserRoles);
    }
  }, [user, loading, currentUserRoles, userRoles.pendingUserRoles, showVerifyEmail, submittedCount]);

  function protectedRoute(loggedInComponent: ReactNode, notLoggedInComponent: ReactNode) {
    log.debug("protectedRoute:user:", debugCurrentUser(), "loading:", loading, "systemAccess:", currentUserRoles?.data?.systemAccess, "systemAccessAndEmailVerified", systemAccessAndEmailVerified);
    return loading ?
        <LoadingDiv/> : systemAccessAndEmailVerified ? loggedInComponent : notLoggedInComponent;
  }

  return useRoutes(ROUTES);
}
