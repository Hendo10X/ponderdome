"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  totalLikes: number;
  totalPosts: number;
  rank: number;
}

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  currentUserImage?: string | null;
}

export default function LeaderboardItem({ entry }: LeaderboardItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
        "bg-card border-border overflow-hidden transition-all duration-300",
        isOpen ? "rounded-[24px] border bg-accent/50" : "rounded-2xl border bg-card"
    )}>
      {/* Main Row */}
      <div className={cn("flex items-center justify-between p-4", isOpen ? "bg-accent/50" : "bg-card")}>
        <div className="flex items-center gap-4">
            {/* Rank */}
            <span className="font-medium text-foreground w-6 text-center text-sm">
                #{entry.rank}
            </span>
            
            {/* User Info */}
            <div className="flex flex-col">
                <span className="font-medium text-foreground text-sm">
                    {entry.username || entry.name}
                </span>
            </div>
        </div>

        {/* Badge / Interaction Trigger */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 outline-none",
                isOpen 
                    ? "bg-secondary text-secondary-foreground" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            )}
        >
            {entry.totalLikes.toLocaleString()}
        </button>
      </div>

      {/* Dropdown Stats */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="bg-accent/50"
            >
                <div className="grid grid-cols-2 divide-x divide-border p-4">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <span className="text-xl font-medium text-foreground">{entry.totalLikes.toLocaleString()}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">Value Created</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center px-4">
                        <span className="text-xl font-medium text-foreground">{entry.totalPosts.toLocaleString()}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">Thoughts</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
