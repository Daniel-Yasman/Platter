import { useEffect, useState } from "react";

function UpcomingOrders() {
  const [reservations, setReservations] = useState([]);
  const [toast, setToast] = useState({ msg: "", color: "" });
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/`
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
        setReservations(parsed.reservations || []);
      } catch (error) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);
  return (
    <div>
      <div className="flex flex-wrap gap-4 p-4 border bg-gray-50 rounded-lg items-center justify-center">
        {reservations.map(
          (r) =>
            new Date(r.time) > new Date() && (
              <div
                key={r.id}
                className="w-64 border bg-white rounded-lg shadow-sm p-4 flex flex-col gap-1"
              >
                <div className="font-semibold text-gray-800">
                  Name: {r.user}
                </div>
                <div className="text-gray-700 text-sm">Email: {r.email}</div>
                <div className="text-gray-700 text-sm">
                  Order Date: {r.time}
                </div>
                <div className="font-medium text-gray-900">
                  Total:{" "}
                  <span className="text-green-700">₪{r.total.toFixed(2)}</span>
                </div>
                <div className="border-t-3 border-b-3 text-center">
                  {r.cart.map((item) => (
                    <div className="">
                      <div key={item._id}>
                        {item.foodId?.name} × {item.quantity}
                      </div>
                      <div className="text-green-700">
                        ₪{item.foodId?.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
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
export default UpcomingOrders;
