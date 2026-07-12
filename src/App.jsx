import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import AddCaseModal from "./components/shared/cases/AddCaseModal";

export default function App() {
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
