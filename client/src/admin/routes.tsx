import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import MainLayout from "./components/MainLayout";
import Account from "./pages/Account";
import CustomerList from "./pages/CustomerList";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import EmailVerification from "./pages/EmailVerification";
import { APP_DASHBOARD, APP_PATH, AppRoute, PUBLIC_PATH, PublicRoute } from "../constants";
import Companies from "./pages/Companies";

export default function routes(isLoggedIn: boolean | undefined) {
  return [
    {
      path: APP_PATH,
      element: isLoggedIn ? <DashboardLayout/> : <Navigate to={`/${AppRoute.LOGIN}`}/>,
      children: [
        {path: AppRoute.ACCOUNT, element: <Account/>},
        {path: AppRoute.USERS, element: <CustomerList/>},
        {path: AppRoute.COMPANIES, element: <Companies/>},
        {path: AppRoute.EXAMPLE_DASHBOARD, element: <Dashboard/>},
        {path: AppRoute.PRODUCTS, element: <ProductList/>},
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
