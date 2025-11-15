import { Link } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { useState } from "react";

function Navbar({ cartCount = 0, userName = "" }) {
  const userId = localStorage.getItem("userId");
  const isLoggedIn = Boolean(userId);
  const [toast, setToast] = useState({ msg: "", color: "" });
  return (
    <div className="pt-4 flex flex-col md:grid grid-cols-3 items-center md:w-full px-10 pb-10 text-indigo-900 border-b-2">
      {/* Left */}
      <ul className="flex md:flex-row flex-col items-center md:gap-8 gap-4 md:justify-start text-5xl md:text-base">
        <li className="md:hidden">
          <Link to="/">Home</Link>
        </li>
        <li className="transition-transform duration-200 hover:scale-[1.15]">
          <Link to="/aboutUs">About</Link>
        </li>
        <li className="transition-transform duration-200 hover:scale-[1.15]">
          <Link to="/menu">Menu</Link>
        </li>
        <li className="transition-transform duration-200 hover:scale-[1.15]">
          <Link to="/contactUs">Contact Us</Link>
        </li>
      </ul>

      {/* Center */}
      <Link
        to="/"
        className="justify-self-center transition-transform duration-200 hover:scale-[1.15]"
      >
        <img
          className="hidden md:block w-32 h-auto"
          src={`${
            import.meta.env.VITE_API_URL
          }/images/pages/home/Icon_transparent_2.png`}
          alt="Logo"
          loading="lazy"
          decoding="async"
        />
      </Link>

      {/* Right */}
      <ul className="flex flex-wrap justify-center items-center gap-4 md:justify-end">
        {!isLoggedIn ? (
          <li className="transition-transform duration-200 hover:scale-[1.15]">
            <Link to="/login">Sign in</Link>
          </li>
        ) : (
          <li className="transition-transform duration-200 hover:scale-[1.15]">
            <Link to="/my-reservations">
              <div className="flex items-center gap-1">
                <FaCircleUser className="w-10 h-10 md:w-7 md:h-7" />
                <div className="text-2xl">{userName || "Guest"}</div>
              </div>
            </Link>
          </li>
        )}
        <li className="transition-transform duration-200 hover:scale-[1.15]">
          {isLoggedIn ? (
            <Link to="/cart" className="cursor-pointer inline-block">
              <div className="flex justify-center relative w-14 h-14">
                <LuShoppingCart className="absolute w-14 h-14" />
                <span
                  // Hot fix.. works though
                  className={`absolute top-4 ${
                    cartCount <= 9 ? "left-[1.65rem]" : "left-[1.3rem]"
                  }`}
                >
                  {cartCount}
                </span>
              </div>
            </Link>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => {
                setToast({
                  msg: "Log in first.",
                  color: "bg-yellow-600 opacity-85",
                });
                setTimeout(() => setToast({ msg: "", color: "" }), 3000);
              }}
            >
              <LuShoppingCart className="w-12 h-12" />
            </button>
          )}
        </li>
        <li>
          {" "}
          {isLoggedIn ? (
            <Link
              className="text-xl cursor-pointer p-3 bg-gradient-to-r from-indigo-900 to-orange-500 text-white font-semibold rounded-full shadow-md hover:from-orange-500 hover:to-indigo-800 transition transform duration-500"
              to="/reserve"
            >
              Make a reservation
            </Link>
          ) : (
            <button
              onClick={() => {
                setToast({
                  msg: "Log in first.",
                  color: "bg-yellow-600 opacity-85",
                });
                setTimeout(() => setToast({ msg: "", color: "" }), 3000);
              }}
              className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-indigo-900 to-orange-500 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:from-orange-500 hover:to-indigo-800 transition transform duration-200"
            >
              Make a reservation
            </button>
          )}
        </li>
      </ul>
      {/* Toast */}
      {toast.msg ? (
        <div
          className={`fixed right-5 top-5 z-50 rounded px-6 py-3 text-white shadow-lg ${toast.color}`}
        >
          {toast.msg}
        </div>
      ) : null}
    </div>
  );
}

export default Navbar;
