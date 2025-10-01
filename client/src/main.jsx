import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Home from "./pages/Home";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Menu from "./pages/Menu";
import Cart from "./pages/user/Cart";
import CreateReservation from "./pages/user/CreateReservation";
import MyReservations from "./pages/user/MyReservations";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Layout from "./components/Layout";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reserve" element={<CreateReservation />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
