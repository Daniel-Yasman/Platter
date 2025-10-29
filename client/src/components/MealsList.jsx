import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MealsListModal from "./MealsListModal";

export default function MealsList({ randomize = false, size }) {
  const userId = localStorage.getItem("userId");
  const { fetchCartCount } = useOutletContext();
  const [meals, setMeals] = useState([]);
  const [toast, setToast] = useState({ msg: "", color: "" });
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/food`
        );
        if (!response.ok) {
          setToast({
            msg: "Failed to load meals",
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }

        const data = await response.json();
        let rows = Array.isArray(data?.foods) ? data.foods : [];

        // Remove out of stock from the cards
        rows = rows.filter((r) => Number(r?.stock) > 0);

        if (randomize) rows = shuffle(rows);
        if (size) rows = rows.slice(0, size);

        setMeals(rows);
      } catch (e) {
        console.error(e);
        setToast({
          msg: "Failed to load meals",
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      }
    }

    fetchMeals();
  }, [randomize, size]);

  const handleAddToCart = async (mealId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setToast({ msg: "Log in first", color: "bg-yellow-500 opacity-85" });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodId: mealId, quantity: 1 }),
        }
      );

      if (!res.ok) throw new Error("Add to cart failed");
      setToast({ msg: "Added to cart", color: "bg-green-600 opacity-85" });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      await fetchCartCount();
    } catch (e) {
      console.error(e);
      setToast({
        msg: "Failed to add to cart",
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8 sm:p-16">
      <div className="flex w-full max-w-6xl flex-wrap justify-center gap-6 px-4">
        {meals.map((m) => (
          <div
            key={m._id}
            onClick={() => {
              setSelected(m);
              setModalOpen(true);
            }}
            className="w-64 cursor-pointer rounded-2xl bg-white p-5 text-center shadow-md"
          >
            <p className="mb-2 line-clamp-1 text-lg font-semibold">{m.name}</p>
            <div className="relative">
              <img
                className="mb-3 h-52 w-52 rounded-xl object-cover"
                src={`${import.meta.env.VITE_API_URL}${m.image}`}
                alt={m.name}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="mb-4 font-bold text-indigo-900">
              {Number(m.price || 0).toFixed(2)}₪
            </div>
            <button
              className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-900 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(m._id);
              }}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div onClick={() => setModalOpen(false)}>
        {modalOpen && selected && (
          <MealsListModal onClose={() => setModalOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-4 sm:gap-6"
            >
              <div className="relative flex h-[250px] w-[250px] justify-center">
                <img
                  src={`${import.meta.env.VITE_API_URL}${selected.image}`}
                  alt={selected.name}
                  className="h-[250px] w-[250px] rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="max-w-xs">
                <h2 className="mb-4 text-2xl font-bold">{selected.name}</h2>
                <p className="w-[300px] py-2 text-gray-700">
                  {selected.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-indigo-900">
                    Price: {Number(selected.price || 0).toFixed(2)}₪
                  </div>
                  <button
                    onClick={() => {
                      if (!userId) {
                        setToast({
                          msg: "Log in first",
                          color: "bg-yellow-500 opacity-85",
                        });
                        setTimeout(
                          () => setToast({ msg: "", color: "" }),
                          3000
                        );
                        return;
                      } else {
                        handleAddToCart(selected._id);
                      }
                    }}
                    className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-900 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-md"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </MealsListModal>
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

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
