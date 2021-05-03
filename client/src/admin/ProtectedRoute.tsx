import "react-perfect-scrollbar/dist/css/styles.css";
import "./mixins/chartjs";
import { useSession } from "../auth/useSession";
import SigninSignupPage from "../auth/SigninSignupPage";
import React from "react";
import AppContainer from "./AppContainer";

export default function ProtectedRoute() {
  const { user, loading } = useSession();
  console.log("ProtectedRoute:user:", user, "loading:", loading);

  return user?.emailVerified ? (
    <AppContainer />
  ) : (
    <SigninSignupPage variant="signin" />
  );
}
