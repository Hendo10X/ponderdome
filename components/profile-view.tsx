"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserStats, updateProfile } from "@/lib/actions";
import { User, Edit2, Check, Trophy, Heart, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import UserTooltip from "@/components/user-tooltip";
import { formatDistanceToNow } from "date-fns";

interface ProfileViewProps {
  user: {
    id: string;
    name: string;
    username?: string | null;
    image?: string | null;
  };
}

interface UserStats {
  totalPosts: number;
  totalLikes: number;
  rank: {
    title: string;
    badgeColor: string;
  };
  popularPost: any | null;
  bio: string;
}

export default function ProfileView({ user }: ProfileViewProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    getUserStats(user.id)
      .then((data) => {
        setStats(data);
        setBioInput(data.bio || "");
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      await updateProfile(bioInput);
      setStats((prev) => prev ? { ...prev, bio: bioInput } : null);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio", error);
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full max-w-lg mx-auto pb-20 px-0 md:px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-none md:rounded-[32px] overflow-hidden mb-6 pt-8 min-h-[50vh]">
        {/* Content */}
        <div className="px-6 pb-8 relative">
            {/* Avatar & Edit Button */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {user.image ? (
                            <img src={user.image} alt={user.username || "User"} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-gray-300">
                            {(user.username?.[0] || user.name?.[0] || "U").toUpperCase()}
                        </span>
                    )}
                </div>
                {!isEditingBio && (
                    <button 
                        onClick={() => setIsEditingBio(true)}
                        className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Name & Username */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 font-medium">@{user.username}</p>
            </div>

             {/* Rank Badge */}
             <div className="flex items-center gap-2 mb-6">
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600")}>
                    {stats.rank?.title || "Unranked"}
                </span>
             </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-gray-900">{stats.totalPosts}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Posts</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-gray-900">{stats.totalLikes}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Likes Earned</span>
                </div>
            </div>

            {/* Bio Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900">About</h3>
                    {isEditingBio && (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditingBio(false)}
                                className="text-xs font-medium text-gray-400 hover:text-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveBio}
                                disabled={savingBio}
                                className="text-xs font-bold text-blue-500 hover:text-blue-600 disabled:opacity-50"
                            >
                                {savingBio ? "Saving..." : "Save"}
                            </button>
                        </div>
                    )}
                </div>
                
                {isEditingBio ? (
                    <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="w-full h-24 p-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 resize-none text-sm text-gray-700"
                        maxLength={150}
                    />
                ) : (
                    <p className="text-sm text-gray-600 leading-relaxed min-h-[20px]">
                        {stats.bio || "No bio yet."}
                    </p>
                )}
            </div>

            {/* Popular Post Highlight */}
            {stats.popularPost && (
                <div>
                     <h3 className="font-bold text-sm text-gray-900 mb-3">Most Popular Post</h3>
                     <div className="bg-gray-50 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Trophy className="w-16 h-16 text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-800 font-medium mb-3 relative z-10 line-clamp-3">
                            "{stats.popularPost.content}"
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 relative z-10">
                            <div className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                                <span>{stats.popularPost.likesCount}</span>
                            </div>
                            <span>{formatDistanceToNow(new Date(stats.popularPost.createdAt), { addSuffix: true })}</span>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
