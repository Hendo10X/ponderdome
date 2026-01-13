import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FeedClient from "./feed-client";

import { getFeed, getLeaderboard } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const [initialPosts, initialLeaderboard] = await Promise.all([
    getFeed(),
    getLeaderboard(),
  ]);

  return <FeedClient user={session.user} initialPosts={initialPosts} initialLeaderboard={initialLeaderboard} />;
}
