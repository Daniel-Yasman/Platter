import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MyReservations() {
  const userId = localStorage.getItem("userId");
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("Loading…");
  useEffect(() => {
    if (!userId) {
      setMessage("Log in first");
      return;
    }
    async function fetchReservations() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservation/${userId}`);
        if (!response.ok) return setMessage("Failed to load reservations");
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
    localStorage.clear("userId");
    window.location.href = "/";
  }
  async function handleDelete(id) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservation/${userId}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const { error } = await response
          .json()
          .catch(() => ({ error: "Delete failed" }));
        alert(error || "Delete failed");
        return;
      }
      //
      setReservations((rs) => rs.filter((r) => r._id !== id));
      if (reservations.length - 1 === 0) setMessage("No reservations found");
    } catch {
      alert("Delete failed");
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
                onClick={() => handleDelete(r._id)}
              >
                Delete reservation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
