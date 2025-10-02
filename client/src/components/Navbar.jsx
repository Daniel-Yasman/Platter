import { Link } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";

function Navbar({ cartCount = 0, userName = "" }) {
  const userId = localStorage.getItem("userId");
  const isLoggedIn = Boolean(userId);
  const [toast, setToast] = useState({ msg: "", color: "" });
  return (
    <div className="grid grid-cols-3 items-center w-full px-10 pb-10 text-indigo-900 border-b">
      {/* Left */}
      <ul className="flex items-center gap-8 justify-start">
        <li>
          <Link to="/aboutUs">About</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/contactUs">Contact Us</Link>
        </li>
      </ul>

      {/* Center */}
      <Link to="/" className="justify-self-center">
        <img
          className="w-32 h-auto"
          src={`${
            import.meta.env.VITE_API_URL
          }/images/pages/home/Icon_transparent_2.png`}
          alt="Logo"
        />
      </Link>

      {/* Right */}
      <ul className="flex items-center gap-4 justify-end">
        {!isLoggedIn ? (
          <li>
            <Link to="/login">Sign up</Link>
          </li>
        ) : (
          <li>
            <Link to="/my-reservations">
              <div className="flex items-center gap-1">
                <FaCircleUser className="w-7 h-7" />
                <div>{userName || "Guest"}</div>
              </div>
            </Link>
          </li>
        )}
        <li>
          {isLoggedIn ? (
            <Link to="/cart" className="relative inline-block">
              <LuShoppingCart className="w-12 h-12" />
              <span className="absolute top-[13.5px] left-[23.2px] text-sm font-semibold">
                {cartCount}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setToast({
                  msg: "Log in first.",
                  color: "bg-yellow-600",
                });
                setTimeout(() => setToast({ msg: "", color: "" }), 2800);
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
              className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-indigo-900 to-orange-500 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:from-orange-500 hover:to-indigo-800 transition transform duration-200"
              to="/reserve"
            >
              Make a reservation
            </Link>
          ) : (
            <button
              onClick={() => alert("Log in first.")}
              className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-indigo-900 to-orange-500 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:from-orange-500 hover:to-indigo-800 transition transform duration-200"
            >
              Make a reservation
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
