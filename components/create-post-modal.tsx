"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createPost } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void; // Callback to refresh feed
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createPost(content);
      toast.success("Brain rot successfully unleashed!");
      setContent("");
      onPostCreated?.();
      onClose();
    } catch (error) {
      toast.error("Failed to post. Your thoughts are too powerful.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Unleash the Thoughts
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  What's occupying that gray matter?
                </label>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder="Type something profound... or just complain about the weather."
                    className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ponder-blue/50 focus:border-ponder-blue resize-none text-gray-900 placeholder:text-gray-300 transition-all pr-4 pb-8"
                    autoFocus
                    maxLength={280}
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none opacity-50">
                     <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                        Ctrl + Enter
                     </span>
                     <span className="text-[10px] font-medium text-gray-400">to post</span>
                  </div>
                  <div className={cn("absolute bottom-3 right-3 text-xs font-medium transition-colors", 
                      content.length > 250 ? "text-orange-500" : "text-gray-400"
                  )}>
                    {content.length}/280
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-ponder-blue hover:bg-ponder-blue/90 text-white font-medium py-2 px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post it"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
