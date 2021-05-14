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
import { LOGIN_ROUTE } from '../constants';

export default function routes(isLoggedIn: boolean | undefined) {
  return [
    {
      path: "app",
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: "account", element: <Account /> },
        { path: "customers", element: <CustomerList /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "products", element: <ProductList /> },
        { path: "settings", element: <Settings /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "//*",
      element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
      children: [
        { path: "email-verification", element: <EmailVerification /> },
        { path: LOGIN_ROUTE, element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "404", element: <NotFound /> },
        { path: "//*", element: <Navigate to="/app/dashboard" /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
  ];
}
