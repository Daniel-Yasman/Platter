import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
export default function CreateReservation() {
  const userId = localStorage.getItem("userId");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cart, setCart] = useState([]);
  const { fetchCartCount } = useOutletContext();
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState({ msg: "", color: "" });

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [cvv, setCvv] = useState("");
  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/${userId}`
        );
        if (!response.ok) {
          setToast({
            msg: `Error ${response.status}: ${response.statusText}`,
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const data = await response.json();
        setCart(data.cart ?? []);
        setTotal(data.total ?? 0);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCart();
  }, [userId]);

  async function cartReset() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}/cartReset`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      const result = await response.json().catch(() => null);
      setCart(result?.cart ?? []); // trust backend state
    } catch (error) {
      console.error(error);
      setToast({
        msg: String(error?.message || error),
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !time) {
      setToast({
        msg: "Select date and time",
        color: "bg-yellow-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      return;
    }
    if (!cardName || !cardNumber || !month || !year || !cvv) {
      setToast({
        msg: "Fill payment fields (demo only)",
        color: "bg-yellow-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      return;
    }

    const data = {
      date: `${date}T${time}`,
      cart: cart,
      total,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservation/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const parsed = await response.json().catch(() => null); // <-- await
        setToast({
          msg: parsed?.error || `Error ${response.status}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      setToast({
        msg: "Reservation created",
        color: "bg-green-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      await cartReset();
      await fetchCartCount();
      setTimeout(() => {
        window.location.href = "/";
      }, 3500);
    } catch (e) {
      console.error(e);
      setToast({
        msg: "Network error",
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  }

  return (
    <div className="p-4">
      {/* Cart */}
      <div className="mb-6 w-full max-w-2xl rounded border bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Cart is empty.</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 rounded border p-3"
                >
                  <img
                    className="h-16 w-16 rounded object-cover"
                    src={`${import.meta.env.VITE_API_URL}${item.foodId.image}`}
                    alt={item.foodId.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.foodId.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.foodId.price.toFixed(2)}₪ · x{item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right font-semibold">
              Total: {total.toFixed(2)}₪
            </div>
          </>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-2xl flex-col gap-4"
      >
        {/* Date & Time */}
        <div className="rounded border bg-white p-4 shadow">
          <h3 className="mb-3 text-lg font-semibold">Date & Time</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex flex-col">
              <span className="text-sm">Date (Up to one week in advance)</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded border px-3 py-2"
                required
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">Time (30-min slots, 09:00–20:30)</span>
              <input
                type="time"
                step={1800}
                min="09:00"
                max="20:30"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded border px-3 py-2"
                required
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Slots are every 30 minutes. If a slot is full you will need another
            time.
          </p>
        </div>

        {/* Payment (fake) */}
        <div className="rounded border bg-white p-4 shadow">
          <h3 className="mb-3 text-lg font-semibold">Payment Info (demo)</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col">
              <span className="text-sm">Card Holder</span>
              <input
                type="text"
                placeholder="Full name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="rounded border px-3 py-2"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">Card Number</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="rounded border px-3 py-2"
                maxLength={19}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">Expiry Month</span>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(e.target.value.padStart(2, "0"))}
                className="rounded border px-3 py-2"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">Expiry Year</span>
              <input
                type="number"
                min={new Date().getFullYear()}
                max={2030}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded border px-3 py-2"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">CVV</span>
              <input
                type="password"
                inputMode="numeric"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="rounded border px-3 py-2"
                maxLength={3}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            These fields are not sent to the server.
          </p>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-full bg-gradient-to-r from-indigo-900 to-orange-500 px-6 py-3 font-semibold text-white shadow-md"
        >
          Submit Reservation
        </button>
      </form>
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
