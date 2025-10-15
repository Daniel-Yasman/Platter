import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ msg: "", color: "" });

  async function handleClick(e) {
    e.preventDefault();
    const data = { email, password };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 2800);
      } else {
        const parsed = await response.json();
        localStorage.setItem("userId", parsed.data.userId);
        setEmail("");
        setPassword("");
        setToast({
          msg: "Success",
          color: "bg-green-600",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        setTimeout(() => {
          window.location.href = "/";
        }, 3100);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-black">
      <form
        onSubmit={handleClick}
        className="relative w-[400px] rounded-md bg-white p-10 shadow-md flex flex-col gap-6"
      >
        <header className="text-3xl font-semibold text-center">Log In</header>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border border-gray-400 px-2 py-2 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border border-gray-400 px-2 py-2 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-md border-2 border-teal-400 bg-teal-400 py-2 font-medium text-white transition hover:bg-white hover:text-teal-400"
        >
          Log In
        </button>

        <span className="text-center">
          <Link
            className="cursor-pointer text-blue-500 hover:underline"
            to="/resetpassword"
          >
            Forgot Password?
          </Link>
        </span>
        <span className="text-center">
          Don't have an account?{" "}
          <Link className="text-teal-400 hover:underline" to="/register">
            Sign Up
          </Link>
        </span>
      </form>
      {/* Toast */}
      {toast.msg ? (
        <div
          className={`fixed right-5 top-5 z-50 rounded px-6 py-3 text-white shadow-lg ${toast.color}`}
        >
          {toast.msg}
        </div>
      ) : null}
    </main>
  );
}

export default Login;
