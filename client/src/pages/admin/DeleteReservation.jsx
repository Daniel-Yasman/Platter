import { useState, useEffect } from "react";

function DeleteReservation() {
  const adminId = localStorage.getItem("userId");
  const [reservations, setReservations] = useState([]);
  const [toast, setToast] = useState({ msg: "", color: "" });

  useEffect(() => {
    try {
      const fetchReservations = async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reservation/`
        );
        if (!response.ok) {
          setToast({
            msg: `Error ${response.status}: ${response.statusText}`,
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const parsed = await response.json();
        setReservations(parsed.reservations);
      };
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  }, []);

  async function handleDelete(id) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/reservations/${adminId}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      } else {
        // optional: remove deleted reservation from UI
        setReservations((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Delete Reservation</h2>

        {reservations.length === 0 ? (
          <div className="text-center text-gray-600">
            No reservations to delete.
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="rounded-md border border-gray-200 p-4 shadow-sm"
              >
                <div>{reservation.userId.name}</div>
                <div>{reservation.userId.email}</div>
                <h3 className="text-lg font-semibold mb-2">Cart</h3>
                <div className="space-y-2">
                  {reservation.cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded bg-gray-50 p-2"
                    >
                      <div>
                        <div className="font-medium">{item.foodId.name}</div>
                        <div className="text-sm text-gray-600">
                          Price: {item.foodId.price} | Qty: {item.quantity}
                        </div>
                      </div>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          item.foodId.image
                        }`}
                        alt={item.foodId.name}
                        className="h-12 w-12 rounded object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-indigo-900">
                    Total: ₪{reservation.total}
                  </span>
                  <button
                    onClick={() => {
                      const pop = confirm("Are you absolutely sure?");
                      if (pop) handleDelete(reservation._id);
                    }}
                    className="rounded-md bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 font-semibold text-white shadow-md"
                  >
                    Delete Reservation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default DeleteReservation;
