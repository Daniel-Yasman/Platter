import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [toast, setToast] = useState({ msg: "", color: "" });
  const navigate = useNavigate();

  async function handleClick(e) {
    e.preventDefault();
    const data = { name, email, password, phone };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      } else {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setToast({
          msg: "Register successfull! redirecting...",
          color: "bg-orange-300",
        });
        setTimeout(() => {
          setToast({ msg: "", color: "" });
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-black">
      <form
        onSubmit={handleClick}
        className="relative w-[400px] rounded-md bg-white p-10 shadow-md flex flex-col items-center gap-6"
      >
        <header className="text-3xl font-semibold">Sign Up</header>

        {/* Name */}
        <div className="relative w-full">
          <label
            htmlFor="name"
            className="absolute -top-2 left-2 bg-white px-1.5 text-xs text-black"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder=" "
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border-[1.5px] border-gray-400 px-2 py-2 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
        </div>

        {/* Email */}
        <div className="relative w-full">
          <label
            htmlFor="email"
            className="absolute -top-2 left-2 bg-white px-1.5 text-xs text-black"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            placeholder=" "
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border-[1.5px] border-gray-400 px-2 py-2 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
        </div>

        {/* Password */}
        <div className="relative w-full">
          <label
            htmlFor="password"
            className="absolute -top-2 left-2 bg-white px-1.5 text-xs text-black"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder=" "
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border-[1.5px] border-gray-400 px-2 py-2 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
        </div>

        {/* Phone */}
        <div className="relative w-full">
          <label
            htmlFor="phone"
            className="absolute -top-2 left-2 bg-white px-1.5 text-xs text-black"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            placeholder="050-123-1234"
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-md border-[1.5px] border-gray-400 px-2 py-2 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-md border-2 border-orange-300 bg-orange-300 px-4 py-2 font-medium text-white transition hover:bg-white hover:text-orange-400"
        >
          Register
        </button>

        <span className="flex gap-1 text-sm">
          Already have an account?
          <Link className="text-orange-300 hover:underline" to="/login">
            Login
          </Link>
        </span>
      </form>
      {/* Toast */}
      {toast.msg ? (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded px-14 py-9 text-white shadow-lg ${toast.color}`}
        >
          {toast.msg}
        </div>
      ) : null}
    </main>
  );
}

export default Register;
