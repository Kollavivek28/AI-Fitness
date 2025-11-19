"use client";

import { motion , AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ImagePreview({ title, prompt, url, loading, onClose }) {
  return (
    <AnimatePresence>
      {prompt ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500"
            >
              <X size={16} />
            </button>

            <h3>{title || prompt}</h3>
            <p>{prompt}</p>

            <div className="mt-4 min-h-[300px] rounded-2xl bg-slate-100/60 p-4">
              {loading ? (
                <div>Generating imagery...</div>
              ) : url ? (
                <img
                  src={url}
                  alt="Generated"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <p>No preview available.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
