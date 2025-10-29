import { useEffect, useState } from "react";

function SubscriberList() {
  const [subs, setSubs] = useState([]);
  const [toast, setToast] = useState({ msg: "", color: "" });

  useEffect(() => {
    const fetchSubs = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subscriber/`
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
      setSubs(parsed.subscribers);
    };
    fetchSubs();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-4 p-4 border bg-gray-50 rounded-lg items-center justify-center">
        {subs.length > 0 ? (
          subs.map((sub) => (
            <div
              key={sub._id}
              className="w-64 border bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2"
            >
              <div className="font-semibold text-gray-800">
                Email:{" "}
                <span className="font-normal text-gray-700">{sub.email}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No subscribers yet.</p>
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

export default SubscriberList;
