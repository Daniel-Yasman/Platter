import { useState } from "react";

function CreateMeal() {
  const adminId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState({ msg: "", color: "" });

  async function handleClick(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("stock", stock);
    data.append("description", description);
    if (image) data.append("image", image);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${adminId}`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      } else {
        setName("");
        setPrice("");
        setImage(null);
        setStock("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleClick}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Meal</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
          {/* <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          /> */}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full rounded-md bg-gradient-to-r from-indigo-900 to-orange-500 px-4 py-2 font-semibold text-white shadow-md"
        >
          Submit
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

export default CreateMeal;
