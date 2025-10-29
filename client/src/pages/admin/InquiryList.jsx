import { useState, useEffect } from "react";

function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [toast, setToast] = useState({ msg: "", color: "" });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch(`/api/inquiry/`);
        if (!response.ok) {
          setToast({
            msg: `Error ${response.status}: ${response.statusText}`,
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const parsed = await response.json();
        setInquiries(parsed.inqueries);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-4 p-4 border bg-gray-50 rounded-lg items-center justify-center">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="w-64 border bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2"
            >
              <div className="font-semibold text-gray-800 break-words">
                Email:{" "}
                <span className="font-normal text-gray-700">
                  {inquiry.email}
                </span>
              </div>
              <div className="text-gray-700 text-sm break-words">
                Message:
                <div className="text-gray-900 font-medium">{inquiry.body}</div>
              </div>
            </div>
          ))
        ) : (
          <p>No inquiries yet.</p>
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

export default InquiryList;
