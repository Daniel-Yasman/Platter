import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

export default function Cart() {
  const { fetchCartCount } = useOutletContext(); // from Layout
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState({ msg: "", color: "" });

  async function fetchUserCart() {
    if (!userId) {
      setToast({
        msg: "Please log in first",
        color: "bg-yellow-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      return;
    }
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
      }
      const data = await response.json();
      setItems(Array.isArray(data?.cart) ? data.cart : []);
      setTotal(Number(data?.total || 0));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchUserCart();
  }, []);

  async function handleCartUpdate(foodId, nextQty) {
    if (nextQty <= 0) {
      // treat 0 or less as remove
      return handleRemoveItem(foodId);
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodId, quantity: Number(nextQty) }),
        }
      );
      if (!response.ok) {
        const t = await response.text();
        setToast({
          msg: t || "Update failed",
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      await fetchUserCart();
      await fetchCartCount(); // keep navbar in sync
    } catch (e) {
      console.error(e);
      setToast({
        msg: "Update failed",
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  }

  async function handleRemoveItem(foodId) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}/${foodId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const t = await res.text();
        setToast({
          msg: t || "Remove failed",
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      await fetchUserCart();
      await fetchCartCount(); // decrement navbar count when unique item removed
    } catch (e) {
      console.error(e);
      setToast({
        msg: "Remove failed",
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-orange-200">
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-4">
        <div className="w-full rounded-md bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Shopping Cart</h1>
            <div>
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </div>
          </div>

          <div className="my-4 w-full border" />

          {/* Items */}
          <section className="mb-4 max-h-[320px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                Cart’s empty.
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id}>
                  <div className="flex items-center justify-between gap-4 px-2">
                    <img
                      className="h-24 w-24 rounded-lg object-cover"
                      src={`${import.meta.env.VITE_API_URL}${
                        item.foodId?.image
                      }`}
                      alt={item.foodId?.name || "Item"}
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="flex flex-1 flex-col items-center">
                      <div className="font-medium">{item.foodId?.name}</div>
                      <div className="text-sm text-gray-700">
                        {Number(item.foodId?.price || 0).toFixed(2)}₪
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleCartUpdate(item.foodId._id, item.quantity - 1)
                          }
                          className="h-8 w-8 rounded-full border text-lg leading-none"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <div className="min-w-[2ch] text-center">
                          x{item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            handleCartUpdate(item.foodId._id, item.quantity + 1)
                          }
                          className="h-8 w-8 rounded-full border text-lg leading-none"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const pop = confirm(`Remove ${item.foodId.name}?`);
                        if (pop) handleRemoveItem(item.foodId._id);
                      }}
                      className="text-gray-600 hover:text-red-600"
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="my-4 w-full border" />
                </div>
              ))
            )}
          </section>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Link to="/menu" className="text-blue-600 hover:underline">
              ← Back to the menu
            </Link>

            {items.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">
                  Total: {Number(total).toFixed(2)}₪
                </div>
                <Link
                  to="/reserve"
                  className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-900 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-md"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
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
