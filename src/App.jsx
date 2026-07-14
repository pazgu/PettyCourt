import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import RootLayout from "./components/layout/RootLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import PublicRoute from "./components/routing/PublicRoute";
import { HomePage } from "./pages/Home/index";
import { authStore } from "@/store/AuthStore";
import { CaseDetailsPage } from "./pages/CaseDetails/index.jsx";
import { MyCasesPage } from "./pages/MyCases/index.jsx";
import { Toaster } from "@/components/ui/sonner";

export default observer(function App() {
  useEffect(() => {
    authStore.loadUser();
  }, []);

  return (
    <>
      <HashRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route path="/" element={<HomePage />} />
            <Route path="/case/:id" element={<CaseDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/my-cases" element={<MyCasesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster />
    </>
  );
});
