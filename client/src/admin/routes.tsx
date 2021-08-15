import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import MainLayout from "./components/MainLayout";
import Account from "../pages/account/Account";
import UserList from "../pages/users/UserList";
import Login from "../pages/login/Login";
import NotFound from "../pages/NotFound";
import Products from "../pages/products/Products";
import Register from "../pages/login/Register";
import EmailVerification from "../pages/email-verification/EmailVerification";
import { APP_DASHBOARD, APP_PATH, AppRoute, PUBLIC_PATH, PublicRoute } from "../constants";
import Companies from "../pages/companies/Companies";
import { Settings } from "../pages/settings/Settings";
import CompanyEdit from "../pages/company/CompanyEdit";
import ExampleDashboard from "../pages/example-dashboard/ExampleDashboard";
import Prices from "../pages/prices/Prices";
import { PricingSetup } from "../pages/price-setup/PricingSetup";
import { ProductCodings } from "../pages/products/ProductCodings";
import { ProductCodingType } from "../models/product-models";
import { productRoute } from "../mappings/product-mappings";
import { Orders } from "../pages/orders/Orders";

export default function routes(isLoggedIn: boolean | undefined) {
  return [
    {
      path: APP_PATH,
      element: isLoggedIn ? <DashboardLayout/> : <Navigate to={`/${AppRoute.LOGIN}`}/>,
      children: [
        {path: AppRoute.ACCOUNT, element: <Account/>},
        {path: AppRoute.USERS, element: <UserList/>},
        {path: AppRoute.COMPANIES, element: <Companies/>},
        {path: AppRoute.COMPANIES_EDIT, element: <CompanyEdit/>, exact: true},
        {path: AppRoute.EXAMPLE_DASHBOARD, element: <ExampleDashboard/>},
        {path: AppRoute.PRICES, element: <Prices/>},
        {path: AppRoute.PRICING_SETUP, element: <PricingSetup/>},
        {path: AppRoute.ORDERS, element: <Orders/>},
        {path: AppRoute.PRODUCTS, element: <Products/>},
        {
          path: productRoute(ProductCodingType.HARDNESS),
          element: <ProductCodings productCodingType={ProductCodingType.HARDNESS}/>
        },
        {
          path: productRoute(ProductCodingType.COMPOUND),
          element: <ProductCodings productCodingType={ProductCodingType.COMPOUND}/>
        },
        {
          path: productRoute(ProductCodingType.COLOUR),
          element: <ProductCodings productCodingType={ProductCodingType.COLOUR}/>
        },
        {
          path: productRoute(ProductCodingType.GRADE),
          element: <ProductCodings productCodingType={ProductCodingType.GRADE}/>
        },
        {
          path: productRoute(ProductCodingType.CURING_METHOD),
          element: <ProductCodings productCodingType={ProductCodingType.CURING_METHOD}/>
        },
        {path: AppRoute.SETTINGS, element: <Settings/>},
        {path: PublicRoute.ASTERISK, element: <Navigate to="/404"/>},
      ],
    },
    {
      path: PUBLIC_PATH,
      element: !isLoggedIn ? <MainLayout/> : <Navigate to={APP_DASHBOARD}/>,
      children: [
        {path: PublicRoute.EMAIL_VERIFICATION, element: <EmailVerification/>},
        {path: PublicRoute.LOGIN, element: <Login/>},
        {path: PublicRoute.REGISTER, element: <Register/>},
        {path: PublicRoute.NOT_FOUND, element: <NotFound/>},
        {path: PUBLIC_PATH, element: <Navigate to={APP_DASHBOARD}/>},
        {path: PublicRoute.ASTERISK, element: <Navigate to="/404"/>},
      ],
    },
  ];
}
