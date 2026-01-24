import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function ImageOverlay({ src, onClose }) {
  return (
    <AnimatePresence>
      {src && (
        <>
          {/* الخلفية السوداء */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* الصورة نفسها */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="relative">
              <img
                src={src}
                className="max-h-[80vh] max-w-[80vw] rounded-xl shadow-lg"
                alt="product"
              />
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white text-2xl p-1 bg-black/50 rounded-full hover:bg-black/70"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
