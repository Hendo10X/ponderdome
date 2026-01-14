"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CreatePostModal from "@/components/create-post-modal";
import UserTooltip from "@/components/user-tooltip";
import { getFeed, toggleLike } from "@/lib/actions";
import { Heart, MessageSquare, Plus } from "lucide-react";
import CommentModal from "@/components/comment-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileView from "@/components/profile-view";

type Tab = "feed" | "leaderboard" | "profile";

type LeaderboardEntry = {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  totalLikes: number;
  rank: number;
};

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  author: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    image?: string | null;
    totalLikes: number;
    rank: number | null;
  } | null;
};

interface FeedClientProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    username?: string | null;
    id: string;
  };
  initialPosts: Post[];
  initialLeaderboard: LeaderboardEntry[];
}

// Custom helper for short time format
function formatShortTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

export default function FeedClient({ user, initialPosts, initialLeaderboard }: FeedClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [loading, setLoading] = useState(false);

  // Sync state with props
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
      setLeaderboard(initialLeaderboard);
  }, [initialLeaderboard]);

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "profile", label: "Profile" },
  ];

  /* 
   * We rely on router.refresh() for data updates now, 
   * but fetching can still be done if needed for specific actions.
   */
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch feed", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
      router.refresh();
  };

  return (
    <div className={cn(
        "bg-gray-50 flex flex-col items-center pt-14 md:pt-24 relative w-full overflow-x-hidden",
        activeTab === "profile" ? "min-h-screen" : "h-screen overflow-hidden"
    )}>
      {/* Tabs */}
      <div className="flex-none flex space-x-6 md:space-x-12 mb-4 md:mb-6 relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
              activeTab === tab.id
                ? "text-white"
                : "text-black hover:text-gray-800"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#6982FF] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-lg min-h-0">
        <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
                 <motion.div
                    key="profile"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full pb-32"
                 >
                     <ProfileView user={user} />
                 </motion.div>
            ) : (
                <motion.div
                    key="main-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                >
                    <ScrollArea className="h-full px-4 pb-10">
                        <motion.div
                        key={activeTab}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full text-left pb-32"
                        >
            {activeTab === "feed" && (
              <>
                {!loading && posts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-6 pt-10">
                    <p className="text-gray-500 font-medium text-lg">
                      There is nothing to see here fella.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-6">
                    {/* Feed List */}
                    <div className="space-y-4">
                      {loading && posts.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                          Loading thoughts...
                        </div>
                      ) : (
                        <>
                          {posts.map((post) => (
                            <PostCard key={post.id} post={post} currentUserImage={user.image} />
                          ))}
                          <div className="h-20" />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "leaderboard" && (
               <div className="flex flex-col items-center justify-center space-y-4 pt-10 pb-20">
                 {leaderboard.length === 0 ? (
                    <p className="text-gray-900 font-medium">leaderboard(no leader yet)</p>
                 ) : (
                    <div className="w-full space-y-3">
                        {leaderboard.map((entry) => (
                            <div key={entry.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold text-gray-900 w-8">#{entry.rank}</span>
                                    <span className="font-bold text-gray-900">{entry.username || entry.name}</span>
                                </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                            {entry.totalLikes.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                 )}
               </div>
            )}

                        </motion.div>
                    </ScrollArea>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Floating Create Button */}
      {activeTab === "feed" && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-900 text-sm font-medium transition-all duration-500 ease-[0.23,1,0.32,1] hover:bg-[#6982FF] hover:text-white group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          <span>start creating</span>
        </motion.button>
      )}

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

function PostCard({ post, currentUserImage }: { post: Post; currentUserImage?: string | null }) {
  const router = useRouter();
  const [likes, setLikes] = useState(post.likesCount); 
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Sync state with props if they change (from router.refresh)
  useEffect(() => {
    setLikes(post.likesCount);
    setCommentsCount(post.commentsCount || 0);
    setIsLiked(post.isLiked);
  }, [post]);

  const handleLike = async () => {
    // Optimistic toggle
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
        await toggleLike(post.id);
        router.refresh(); // Refresh server data
    } catch (e) {
        // Revert on error
        setIsLiked(!newLikedState);
        setLikes((prev) => (!newLikedState ? prev + 1 : prev - 1));
        console.error("Like failed", e);
    }
  };

  const handleCommentAdded = () => {
      setCommentsCount((prev) => prev + 1);
      router.refresh(); // Refresh server data
  };

  return (
    <>
        <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white p-5 rounded-2xl border border-gray-100 transition-shadow relative"
        >
        <div className="flex items-start">
            {/* Post Content */}
            <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                {post.author ? (
                    <UserTooltip
                    user={{
                        ...post.author,
                        totalLikes: post.author.totalLikes,
                    }}
                    >
                    <span className="font-bold text-gray-900 text-sm">
                        @{post.author.username || post.author.name}
                    </span>
                    </UserTooltip>
                ) : (
                    <span className="font-bold text-gray-500 text-sm">Unknown</span>
                )}
                </div>
            </div>

            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {post.content}
            </p>

            {/* Actions / Stats */}
            <div className="flex items-center space-x-6 mt-4 text-xs font-medium">
                {/* Like Button (Heart) */}
                <motion.button
                whileTap={{ scale: 0.8 }}
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={handleLike}
                className={cn("flex items-center transition-colors space-x-1.5", isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400")}
                >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                <span className="font-bold text-sm">{likes}</span>
                </motion.button>

                {/* Comment Button (MessageSquare) */}
                <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setIsCommentModalOpen(true)}
                    className={cn("flex items-center transition-colors space-x-1.5 text-gray-400 hover:text-purple-400")}
                >
                <MessageSquare className={cn("w-5 h-5")} />
                <span className="font-bold text-sm">{commentsCount}</span>
                </motion.button>

                {/* Leaderboard/Hashtag (Rank) */}
                <div className="flex items-center space-x-1.5 cursor-default">
                  <span className="font-bold text-sm text-green-500">
                     {post.author?.rank ? `#${post.author.rank}` : null}
                  </span>
                </div>
            </div>
            </div>
        </div>
        
        {/* Time at bottom right */}
        <div className="absolute bottom-6 right-6 text-gray-300 text-xs font-medium">
            {formatShortTime(post.createdAt)}
        </div>
        </motion.div>

        <CommentModal 
            isOpen={isCommentModalOpen} 
            onClose={() => setIsCommentModalOpen(false)} 
            postId={post.id}
            currentUserImage={currentUserImage}
            onCommentAdded={handleCommentAdded}
        />
    </>
  );
}
