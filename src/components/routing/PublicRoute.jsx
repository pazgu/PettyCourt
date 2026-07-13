import { observer } from "mobx-react-lite";
import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "@/store/AuthStore";

export default observer(function PublicRoute() {
  if (authStore.initializing) return null;

  if (authStore.user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
});
