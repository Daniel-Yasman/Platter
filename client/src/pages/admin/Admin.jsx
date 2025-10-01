import { useState } from "react";
import CreateMeal from "./CreateMeal";
import ModifyMeal from "./ModifyMeal";
import DeleteMeal from "./DeleteMeal";
import DeleteReservation from "./DeleteReservation";

function Admin() {
  const [action, setAction] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <form className="flex flex-col items-center gap-4 bg-white shadow-md rounded-lg p-6 w-80">
        <label className="text-lg font-medium">Select an Operation</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="">Select Option</option>
          <option value="createMeal">Create Meal</option>
          <option value="modifyMeal">Modify Meal</option>
          <option value="deleteMeal">Delete Meal</option>
          <option value="deleteReservation">Delete Reservation</option>
        </select>
      </form>

      <div className="mt-10 w-full max-w-2xl">
        {action === "createMeal" && <CreateMeal />}
        {action === "modifyMeal" && <ModifyMeal />}
        {action === "deleteMeal" && <DeleteMeal />}
        {action === "deleteReservation" && <DeleteReservation />}
      </div>
    </div>
  );
}

export default Admin;
