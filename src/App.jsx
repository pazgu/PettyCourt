import { BrowserRouter, Routes, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import AddCaseModal from "./components/shared/cases/AddCaseModal";
import { authStore } from "@/store/AuthStore";
import { CaseDetailsPage } from "./pages/CaseDetails/index.jsx";
import { MyCasesPage } from "./pages/MyCases/index.jsx";
import { CaseFilters } from "./components/shared/caseFilters";

export default observer(function App() {
  useEffect(() => {
    authStore.loadUser();
  }, []);

  const isLoggedIn = !!authStore.user;

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-case" element={<AddCaseModal />} />
        <Route path="/my-cases" element={<MyCasesPage />} />
        <Route path="/case/:id" element={<CaseDetailsPage />} />
        <Route path="/filter" element={<CaseFilters />} />
      </Routes>
    </BrowserRouter>
  );
});
