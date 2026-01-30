"use client";

import { Facehash } from "facehash";

interface UserAvatarProps {
  username: string;
  size?: number;
  className?: string;
}

export function UserAvatar({ username, size = 48, className }: UserAvatarProps) {
  return (
    <div className={className}>
      <Facehash name={username} size={size} />
    </div>
  );
}
