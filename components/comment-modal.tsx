import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getComments, createComment } from "@/lib/actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Reset state when opening
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

  const Content = (
    <div className="flex flex-col h-full max-h-[80vh] md:max-h-[600px] w-full">
         {/* Header (Desktop only inside modal, Drawer has its own) */}
         {isDesktop && (
            <div className="flex items-center justify-between p-5 flex-shrink-0">
              <h3 className="font-bold text-lg">Comments</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
         )}
         
         {/* Comments List */}
         <div className="flex-1 overflow-y-auto px-5 space-y-4 min-h-0">
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
         <div className="p-5 space-y-3 flex-shrink-0">
             <div className="flex gap-2 justify-start items-center overflow-x-auto pb-1 scrollbar-none">
                  {SUGGESTED_COMMENTS.map((emoji, index) => (
                      <motion.button 
                        key={index}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleSuggestionClick(emoji)}
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        type="button"
                        aria-label={`Add emoji ${emoji}`}
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
                        className="w-full pl-4 pr-12 py-3 rounded-3xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-100 font-medium text-sm transition-all"
                        disabled={submitting}
                    />
                    <button 
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-black text-white rounded-full p-2 transition-all disabled:opacity-30 disabled:hover:bg-gray-900"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                 </div>
              </form>
         </div>
    </div>
  );

  if (isDesktop) {
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
              {Content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="border-b border-gray-100 pb-4">
          <DrawerTitle className="text-center">Comments</DrawerTitle>
        </DrawerHeader>
        {Content}
      </DrawerContent>
    </Drawer>
  );
}
