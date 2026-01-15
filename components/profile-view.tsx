"use client";

import { useEffect, useState } from "react";
import { getUserStats, updateProfile } from "@/lib/actions";
import { User, Edit2, Check, FileText, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getRankDescription } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in"); 
                },
            },
        });
    } catch (error) {
        console.error("Logout failed", error);
        setIsLoggingOut(false);
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
    <div className="w-full max-w-lg mx-auto pb-20 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-[32px] overflow-hidden mb-6 pt-8">
        {/* Content */}
        <div className="px-6 pb-8 relative">
            {/* Avatar & Actions */}
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
                <div className="flex gap-2">
                    {!isEditingBio && (
                        <>
                            <button 
                                onClick={() => setIsEditingBio(true)}
                                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                             <button 
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="p-2 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                {isLoggingOut ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <LogOut className="w-4 h-4" />
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Name & Username */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 font-medium">@{user.username}</p>
            </div>

             {/* Rank Badge with Popover */}
             <div className="flex items-center gap-2 mb-6">
                <Popover>
                    <PopoverTrigger asChild>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors select-none")}>
                            {stats.rank?.title || "Unranked"}
                        </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="space-y-2">
                             <h4 className="font-medium leading-none text-gray-900 border-b border-gray-100 pb-2 mb-2">
                                {stats.rank?.title || "Unranked"}
                             </h4>
                             <p className="text-sm text-gray-600 italic">
                                "{getRankDescription(stats.rank?.title || "")}"
                             </p>
                             <div className="pt-2 text-xs text-gray-400 bg-gray-50 -mx-4 -mb-4 p-3 border-t border-gray-100 mt-2">
                                <p><strong>How it works:</strong> Earn likes on your posts to climb the ranks and unlock new titles.</p>
                             </div>
                        </div>
                    </PopoverContent>
                </Popover>
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
                     <div className="bg-gray-50 rounded-2xl p-5">
                        <p className="text-sm text-gray-800 font-medium whitespace-pre-wrap">
                            "{stats.popularPost.content}"
                        </p>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
