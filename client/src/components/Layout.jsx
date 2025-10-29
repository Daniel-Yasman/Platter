import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");

  const fetchCartCount = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setCartCount(0);
      setUserName("");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}`
      );
      if (!res.ok) {
        setCartCount(0);
        setUserName("");
        return;
      }
      const data = await res.json();
      setCartCount(Array.isArray(data?.cart) ? data.cart.length : 0);
      setUserName(data?.name || "");
    } catch {
      setCartCount(0);
      setUserName("");
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} userName={userName} />
      <main className="flex-1">
        <Outlet context={{ fetchCartCount }} />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
