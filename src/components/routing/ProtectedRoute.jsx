import { observer } from "mobx-react-lite";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "@/store/AuthStore";

export default observer(function ProtectedRoute() {
  const location = useLocation();

  if (authStore.initializing) return null;

  if (!authStore.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
});
