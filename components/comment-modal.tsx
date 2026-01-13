"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getComments, createComment } from "@/lib/actions";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string | null;
    name: string | null;
    username: string | null;
    image: string | null;
  } | null;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  currentUserImage?: string | null;
  onCommentAdded?: () => void;
}

const SUGGESTED_COMMENTS = ["🔥", "💯", "😂", "🤔", "👏"];

export default function CommentModal({
  isOpen,
  onClose,
  postId,
  currentUserImage,
  onCommentAdded
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      getComments(postId)
        .then((data) => setComments(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await createComment(postId, newComment);
      setNewComment("");
      // Refresh comments
      const updatedComments = await getComments(postId);
      setComments(updatedComments);
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestionClick = (emoji: string) => {
      setNewComment(prev => prev ? prev + " " + emoji : emoji);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Comments</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-400">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No comments yet. Be the first to say something!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                             <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm">@{comment.author?.username || "Unknown"}</span>
                                <span className="text-[10px] text-gray-400">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-gray-800">{comment.content}</p>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Suggestions & Input */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl space-y-3">
             {/* Suggestions */}
              <div className="flex gap-2 justify-start items-center">
                  {SUGGESTED_COMMENTS.map((emoji, index) => (
                      <motion.button 
                        key={index}
                        whileTap={{ scale: 0.8, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleSuggestionClick(emoji)}
                        className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full text-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        type="button"
                      >
                          {emoji}
                      </motion.button>
                  ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                 <div className="flex-1 relative">
                    <input 
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-purple-300 font-medium text-sm"
                        disabled={submitting}
                    />
                    <button 
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:bg-gray-300"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
