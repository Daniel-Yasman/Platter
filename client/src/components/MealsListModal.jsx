import { IoClose } from "react-icons/io5";

export default function MealsListModal({ children, onClose, outOfStock }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed left-1/2 top-1/2 z-50 h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 bg-white p-4 ${
          outOfStock ? "bg-white/80" : ""
        }`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="cursor-pointer py-2"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose className="h-6 w-6" />
        </button>
        {children}
      </div>
    </>
  );
}
