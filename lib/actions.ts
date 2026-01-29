"use server";

import { db } from "./db";
import { post, user, like, comment } from "./db/schema";
import { eq, desc, count, sql, inArray, and } from "drizzle-orm";
import { auth } from "./auth"; 
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createPost(content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!content || content.trim().length === 0) {
    throw new Error("Content cannot be empty");
  }

  const userId = session.user.id;

  const [newPost] = await db
    .insert(post)
    .values({
      id: crypto.randomUUID(),
      content: content.trim(),
      userId: userId,
      createdAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard");
  return newPost;
}

export async function getLeaderboard() {
  // 1. Aggregate total likes per user
  const likesData = await db
    .select({
      userId: post.userId,
      totalLikes: sql<number>`sum(${post.likesCount})`.mapWith(Number),
      totalPosts: count(post.id),
    })
    .from(post)
    .groupBy(post.userId)
    .orderBy(desc(sql`sum(${post.likesCount})`))
    .limit(50);

  // 2. Fetch user details for these top users
  const userIds = likesData.map((l) => l.userId);
  
  if (userIds.length === 0) return [];

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
    })
    .from(user)
    .where(inArray(user.id, userIds));

  // 3. Merge and assign rank
  const leaderboard = likesData.map((entry, index) => {
    const userInfo = users.find((u) => u.id === entry.userId);
    return {
      id: entry.userId,
      name: userInfo?.name,
      username: userInfo?.username,
      image: userInfo?.image,
      totalLikes: entry.totalLikes,
      totalPosts: entry.totalPosts,
      rank: index + 1,
    };
  });

  return leaderboard;
}

export async function getFeed(page: number = 1, limit: number = 20) {
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user?.id;

  const offset = (page - 1) * limit;

  // 1. Fetch posts with author info
  const postsQuery = db
    .select({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      },
    })
    .from(post)
    .leftJoin(user, eq(post.userId, user.id))
    .orderBy(desc(post.createdAt))
    .limit(limit)
    .offset(offset);

  const posts = await postsQuery;

  // 2. Fetch user like status for these posts if logged in
  let likedPostIds = new Set<string>();
  if (currentUserId && posts.length > 0) {
    const postIds = posts.map(p => p.id);
    const existingLikes = await db
      .select({ postId: like.postId })
      .from(like)
      .where(and(eq(like.userId, currentUserId), inArray(like.postId, postIds)));
    existingLikes.forEach(l => likedPostIds.add(l.postId));
  }

  // 3. Get leaderboard to determine ranks for authors
  const leaderboard = await getLeaderboard();
  const rankMap = new Map<string, number>();
  const totalLikesMap = new Map<string, number>();

  leaderboard.forEach((entry) => {
    rankMap.set(entry.id, entry.rank);
    totalLikesMap.set(entry.id, entry.totalLikes);
  });

  // 4. For authors NOT in leaderboard, we still need their total likes (but rank will be >50)
  // Get unique author IDs from posts who are NOT in leaderboard map
  const needingLikes = Array.from(
    new Set(posts.map((p) => p.author?.id).filter((id): id is string => !!id && !totalLikesMap.has(id)))
  );

  if (needingLikes.length > 0) {
      const extraLikesData = await db
        .select({
          userId: post.userId,
          totalLikes: sql<number>`sum(${post.likesCount})`.mapWith(Number),
        })
        .from(post)
        .where(inArray(post.userId, needingLikes))
        .groupBy(post.userId);
      
      extraLikesData.forEach(l => totalLikesMap.set(l.userId, l.totalLikes));
  }

  // 5. Merge data
  return posts.map((p) => ({
    ...p,
    isLiked: likedPostIds.has(p.id),
    author: {
      ...p.author,
      totalLikes: totalLikesMap.get(p.author!.id) || 0,
      rank: rankMap.get(p.author!.id) || null, // null means unranked (not in top 50)
    },
  }));
}

export async function toggleLike(postId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  const userId = session.user.id;

  // Check if like exists
  const existingLike = await db.query.like.findFirst({
    where: and(eq(like.postId, postId), eq(like.userId, userId)),
  });

  if (existingLike) {
    // Unlike
    await db.delete(like).where(and(eq(like.postId, postId), eq(like.userId, userId)));
    await db.update(post)
      .set({ likesCount: sql`${post.likesCount} - 1` })
      .where(eq(post.id, postId));
    
    revalidatePath("/dashboard");
    return { liked: false };
  } else {
    // Like
    await db.insert(like).values({
      id: crypto.randomUUID(),
      postId,
      userId,
      createdAt: new Date(),
    });
    await db.update(post)
      .set({ likesCount: sql`${post.likesCount} + 1` })
      .where(eq(post.id, postId));
    
    revalidatePath("/dashboard");
    return { liked: true };
  }
}

export async function getComments(postId: string) {
   const comments = await db.select({
       id: comment.id,
       content: comment.content,
       createdAt: comment.createdAt,
       author: {
           id: user.id,
           name: user.name,
           username: user.username,
           image: user.image,
       }
   })
   .from(comment)
   .leftJoin(user, eq(comment.userId, user.id))
   .where(eq(comment.postId, postId))
   .orderBy(desc(comment.createdAt));

   return comments;
}

export async function createComment(postId: string, content: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");
    
    const userId = session.user.id;
    if (!content.trim()) throw new Error("Empty comment");

    await db.insert(comment).values({
        id: crypto.randomUUID(),
        content: content.trim(),
        postId,
        userId,
        createdAt: new Date(),
    });
    await db.update(post)
        .set({ commentsCount: sql`${post.commentsCount} + 1` })
        .where(eq(post.id, postId));

    revalidatePath("/dashboard");
}

import { getUserRank } from "@/lib/utils";

export async function updateProfile(bio: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await db
    .update(user)
    .set({ bio })
    .where(eq(user.id, session.user.id));

  revalidatePath("/dashboard");
}

export async function getUserStats(userId: string) {
  // Aggregate stats
  const userPosts = await db.query.post.findMany({
    where: eq(post.userId, userId),
  });

  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likesCount, 0);
  const rank = getUserRank(totalLikes);

  // Get most popular post
  const popularPost = await db.query.post.findFirst({
    where: eq(post.userId, userId),
    orderBy: (posts, { desc }) => [desc(posts.likesCount)],
    with: {
      author: true, // Need author for PostCard if we reuse it
    }
  });

  // Get user details for bio
  const userDetails = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { bio: true } // Only fetch bio if needed
  });

  return {
    totalPosts,
    totalLikes,
    rank,
    popularPost: popularPost ? {
        ...popularPost,
        author: {
           ...popularPost.author,
           totalLikes: 0, // Not needed for single display or fetched separately
           rank: null 
        }
    } : null,
    bio: userDetails?.bio || ""
  };
}

export async function deletePost(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Verify ownership
  const existingPost = await db.query.post.findFirst({
    where: eq(post.id, postId),
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (existingPost.userId !== userId) {
    throw new Error("Unauthorized: You do not own this post");
  }

  // Delete dependencies first (likes, comments) if cascade isn't set up in DB, 
  // but assuming standard cascade or manual cleanup:
  await db.delete(like).where(eq(like.postId, postId));
  await db.delete(comment).where(eq(comment.postId, postId));
  
  // Delete the post
  await db.delete(post).where(eq(post.id, postId));

  revalidatePath("/dashboard");
}
