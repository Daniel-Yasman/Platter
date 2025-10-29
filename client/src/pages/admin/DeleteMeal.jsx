import { useState, useEffect } from "react";

function DeleteMeal() {
  const adminId = localStorage.getItem("userId");
  const [foods, setFoods] = useState([]);
  const [foodId, setFoodId] = useState("");
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [toast, setToast] = useState({ msg: "", color: "" });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/food/`
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
        setFoods(parsed.foods || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFoods();
  }, []);

  async function handleClick(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/foods/${adminId}/${foodId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      } else {
        // reset selection after delete
        setSelectedId("");
        setFoodId("");
        setName("");
        setFoods((prev) => prev.filter((f) => f._id !== foodId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Delete Meal</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Select a Meal
          </label>
          <select
            value={selectedId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedId(id);
              const selected = foods.find((f) => f._id === id);
              if (selected) {
                setFoodId(selected._id);
                setName(selected.name);
              }
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring focus:ring-red-200"
          >
            <option value="">Select Option</option>
            {foods.map((food) => (
              <option key={food._id} value={food._id}>
                {food.name}
              </option>
            ))}
          </select>
        </div>

        {selectedId && (
          <div className="mt-6 space-y-4">
            <p className="text-center text-lg font-medium text-gray-700">
              Delete <span className="font-semibold">{name}</span>?
            </p>
            <button
              onClick={(e) => {
                const pop = confirm("Are you absolutely sure?");
                if (pop) handleClick(e);
              }}
              className="w-full rounded-md bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 font-semibold text-white shadow-md"
            >
              Confirm Delete
            </button>
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

export default DeleteMeal;
