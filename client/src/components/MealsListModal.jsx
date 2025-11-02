import * as motion from "motion/react-client";
import { IoClose } from "react-icons/io5";

export default function MealsListModal({ children, onClose, outOfStock }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className={`fixed left-1/2 top-1/2 z-50 h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 bg-white p-4 ${
          outOfStock ? "bg-white/80" : ""
        }`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          duration: 0.1,
          delay: 0.05,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <button
          className="cursor-pointer py-2"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose className="h-6 w-6" />
        </button>
        {children}
      </motion.div>
    </>
  );
}
