import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function MyReservations() {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("Loading…");
  const [toast, setToast] = useState({ msg: "", color: "" });
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      setToast({
        msg: `Log in first`,
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      setMessage("Log in first");
      return;
    }
    async function fetchReservations() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reservation/${userId}`
        );
        if (!response.ok) {
          setToast({
            msg: "Failed to load reservations",
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const data = await response.json();
        setReservations(data.reservations);
        setMessage(data.reservations.length ? "" : "No reservations found");
      } catch {
        setMessage("Network error");
      }
    }
    fetchReservations();
  }, [userId]);

  function handleLogout() {
    setToast({ msg: "Logging off...", color: "bg-yellow-600 opacity-85" });
    setTimeout(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      window.location.href = "/";
    }, 3000);
  }
  function handleAdminPage() {
    if (role === "admin") navigate("/admin");
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservation/${userId}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const { error } = await response
          .json()
          .catch(() => ({ error: "Delete failed" }));
        const readableError =
          error === "time_passed"
            ? "Cannot delete reservations set in less than 24 hours."
            : error;
        setToast({
          msg: readableError || "Delete failed",
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }

      setReservations((rs) => rs.filter((r) => r._id !== id));
      if (reservations.length - 1 === 0) setMessage("No reservations found");
    } catch {
      setToast({
        msg: "Delete failed",
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-orange-200">
      <div className="mx-auto max-w-3xl p-4">
        {message && (
          <p className="mb-6 rounded bg-white p-3 text-center text-gray-700 shadow">
            {message}
          </p>
        )}
        <div className="flex gap-2">
          <span className="text-black font-semibold">
            <Link to="/">Home</Link>
          </span>
          <span className="text-black font-semibold">
            <button className="cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          </span>
          {role === "admin" && (
            <span className="text-black font-semibold">
              <button className="cursor-pointer" onClick={handleAdminPage}>
                Admin page
              </button>
            </span>
          )}
        </div>
        <div className="space-y-6">
          {reservations.map((r) => (
            <div key={r._id} className="rounded-md bg-white p-4 shadow">
              <div className="mb-3 text-gray-700">
                At:{" "}
                <span className="font-semibold">
                  {new Date(r.time).toLocaleString("en-IL", {
                    timeZone: "Asia/Jerusalem",
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-4">
                {r.cart.map((c) => (
                  <div
                    key={c._id}
                    className="flex w-28 flex-col items-center text-center"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}${c.foodId.image}`}
                      alt={c.foodId.name}
                      className="mb-1 h-24 w-24 rounded-md border object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="text-sm font-medium">
                      {c.foodId?.name || "Deleted meal"}
                    </div>
                    <div className="text-xs text-gray-600">x{c.quantity}</div>
                  </div>
                ))}
              </div>

              <p className="mb-3 font-semibold">Total: {r.total.toFixed(2)}₪</p>

              <button
                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                onClick={() => {
                  const pop = confirm("Are you sure you want to delete?");
                  if (pop) handleDelete(r._id);
                }}
              >
                Delete reservation
              </button>
            </div>
          ))}
        </div>
      </div>
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
