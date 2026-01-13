"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { getUserRank } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UserTooltipProps {
  children: React.ReactNode;
  user: {
    username?: string | null;
    name?: string | null;
    totalLikes: number;
  };
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const rank = getUserRank(user.totalLikes);

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span className="cursor-pointer hover:underline decoration-ponder-blue/50 underline-offset-2">
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={5}
            className="z-50 bg-white border border-gray-100 shadow-xl rounded-xl p-4 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <div className="flex flex-col space-y-2">
              <span className="font-bold text-gray-900 text-sm">
                @{user.username || user.name || "user"}
              </span>
              <div
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium w-fit text-white",
                  rank.badgeColor
                )}
              >
                {rank.title}
              </div>
              <p className="text-xs text-gray-500 max-w-[150px]">
                 {getRankDescription(rank.title)}
              </p>
            </div>
            <TooltipPrimitive.Arrow className="fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

function getRankDescription(title: string) {
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
