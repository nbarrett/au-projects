import "react-perfect-scrollbar/dist/css/styles.css";
import "./mixins/chartjs";
import { useSession } from "../auth/useSession";
import SigninSignupPage from "../auth/SigninSignupPage";
import React from "react";
import AppContainer from "./AppContainer";
import { log } from "../util/logging-config";

export default function ProtectedRoute() {
  const { user } = useSession();
  log.info("user?.emailVerified", user?.emailVerified);
  return user?.emailVerified ? (
    <AppContainer />
  ) : (
    <SigninSignupPage variant="signin" />
  );
}
