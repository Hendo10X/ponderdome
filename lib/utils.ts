import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Rank = {
  title: string;
  minLikes: number;
  badgeColor: string; // Tailwind class
};

export const RANKS: Rank[] = [
  { title: "Dry Brain", minLikes: 0, badgeColor: "bg-gray-400" },
  { title: "Damp Thinker", minLikes: 10, badgeColor: "bg-blue-300" },
  { title: "Prickly Philosopher", minLikes: 50, badgeColor: "bg-green-400" },
  { title: "Lather Legend", minLikes: 80, badgeColor: "bg-pink-400" },
  { title: "Loofah Lord", minLikes: 150, badgeColor: "bg-purple-400" },
  { title: "Soapbox Superstar", minLikes: 300, badgeColor: "bg-yellow-400" },
  { title: "Deep-Sea Diver", minLikes: 500, badgeColor: "bg-blue-600" },
  { title: "Soggy Sage", minLikes: 1000, badgeColor: "bg-emerald-600" },
  { title: "Prune-Fingered Prophet", minLikes: 2500, badgeColor: "bg-indigo-600" },
  { title: "The Big Drip", minLikes: 5000, badgeColor: "bg-ponder-blue" },
];

export function getUserRank(likes: number): Rank {
  // Sort reverse to find the highest matching rank
  const sortedRanks = [...RANKS].sort((a, b) => b.minLikes - a.minLikes);
  return sortedRanks.find((rank) => likes >= rank.minLikes) || RANKS[0];
}
