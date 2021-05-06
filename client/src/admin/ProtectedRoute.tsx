import "react-perfect-scrollbar/dist/css/styles.css";
import "./mixins/chartjs";
import { useSession } from "../auth/useSession";
import React from "react";
import AppContainer from "./AppContainer";
import { log } from "../util/logging-config";
import MainLayout from "./components/MainLayout";

export default function ProtectedRoute() {
  const { user } = useSession();
  log.info("user?.emailVerified", user?.emailVerified);
  return user?.emailVerified ? <AppContainer /> : <MainLayout />;
}
