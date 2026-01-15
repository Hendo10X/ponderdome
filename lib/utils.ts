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

export function getRankDescription(title: string) {
  switch (title) {
    case "Dry Brain": return "Just stepped into the bathroom.";
    case "Damp Thinker": return "You’ve got a little moisture, but no splash yet.";
    case "Prickly Philosopher": return "The ideas are starting to tingle.";
    case "Lather Legend": return "You’re really starting to foam up some genius.";
    case "Loofah Lord": return "You’ve scrubbed away the surface-level thoughts.";
    case "Soapbox Superstar": return "People are actually stopping to listen to you.";
    case "Deep-Sea Diver": return "You’re thinking deeper than the average human.";
    case "Soggy Sage": return "You have spent too much time in the shower.";
    case "Prune-Fingered Prophet": return "Your skin is wrinkled, but your mind is sharp.";
    case "The Big Drip": return "You are the undisputed King/Queen of the Dome.";
    default: return "";
  }
}
