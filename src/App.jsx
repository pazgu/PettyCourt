import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import AddCaseModal from "./components/shared/cases/AddCaseModal";
import { authStore } from "@/store/AuthStore";

export default function App() {
  useEffect(() => {
    authStore.loadUser();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-case" element={<AddCaseModal />} />
      </Routes>
    </BrowserRouter>
  );
}
