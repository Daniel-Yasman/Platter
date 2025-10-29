import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import MealsListModal from "../components/MealsListModal";

function Menu() {
  const { fetchCartCount } = useOutletContext();
  const userId = localStorage.getItem("userId");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", color: "" });

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/food`
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
        setFoods(Array.isArray(data?.foods) ? data.foods : []);
      } catch (err) {
        console.error(err);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  async function handleAdd(foodId) {
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
        `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodId, quantity: 1 }),
        }
      );
      if (!response.ok) {
        setToast({
          msg: "Failed to add to cart",
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      await fetchCartCount();
    } catch (err) {
      console.error(err);
      setToast({
        msg: "Failed to add to cart",
        color: "bg-red-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    }
  }

  async function handleModalAdd(foodId) {
    await handleAdd(foodId);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-4xl sm:text-6xl font-semibold">Menu</h1>
        <p className="text-lg sm:text-2xl pb-2 text-gray-700">Our Meals</p>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 pb-16">
        {loading ? (
          <p className="text-center text-gray-600">Loading…</p>
        ) : foods.length === 0 ? (
          <p className="text-center text-gray-600">No meals available.</p>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => {
              const outOfStock = (food.stock ?? 0) <= 0;
              return (
                <div
                  key={food._id}
                  onClick={() => {
                    setSelected(food);
                    setModalOpen(true);
                  }}
                  className={`cursor-pointer rounded-2xl p-5 text-center shadow-md ${
                    outOfStock ? "bg-white/60" : "bg-white"
                  }`}
                >
                  <p className="mb-2 line-clamp-1 text-lg font-semibold">
                    {food.name}
                  </p>
                  <img
                    className="mb-3 h-52 w-full rounded-xl object-cover"
                    src={`${import.meta.env.VITE_API_URL}${food.image}`}
                    alt={food.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="mb-2 text-sm text-gray-600 line-clamp-2">
                    {food.description}
                  </div>
                  <div className="mb-4 font-bold text-indigo-900">
                    {Number(food.price || 0).toFixed(2)}₪
                  </div>
                  <button
                    disabled={outOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(food._id);
                    }}
                    className={`rounded-full px-5 py-2.5 font-semibold text-white shadow-md ${
                      outOfStock
                        ? "cursor-not-allowed bg-gray-600"
                        : "cursor-pointer bg-gradient-to-r from-indigo-900 to-orange-500"
                    }`}
                  >
                    {outOfStock ? "Out of stock" : "Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen &&
        selected &&
        (() => {
          const selectedOutOfStock = (selected?.stock ?? 0) <= 0;
          return (
            <MealsListModal
              onClose={() => setModalOpen(false)}
              outOfStock={selectedOutOfStock}
            >
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <div className="relative flex h-[250px] w-[250px] justify-center">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${selected.image}`}
                    alt={selected.name}
                    className={`h-[250px] w-[250px] rounded-xl object-cover ${
                      selectedOutOfStock ? "opacity-60" : ""
                    }`}
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
                      disabled={selectedOutOfStock}
                      onClick={() => handleModalAdd(selected._id)}
                      className={`rounded-full px-5 py-2.5 font-semibold text-white shadow-md ${
                        selectedOutOfStock
                          ? "cursor-not-allowed bg-gray-600"
                          : "cursor-pointer bg-gradient-to-r from-indigo-900 to-orange-500"
                      }`}
                    >
                      {selectedOutOfStock ? "Out of stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </MealsListModal>
          );
        })()}
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

export default Menu;
