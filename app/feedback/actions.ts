"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleVote(postId: number) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  // Get our internal user ID
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not found in Clerk");

    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "Anonymous",
        image: clerkUser.imageUrl,
      },
    });
  }

  const userId = user.id;

  // Check if vote exists
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingVote) {
    // Remove vote
    await prisma.vote.delete({
      where: {
        id: existingVote.id,
      },
    });
  } else {
    // Add vote
    await prisma.vote.create({
      data: {
        userId,
        postId,
      },
    });
  }

  revalidatePath("/feedback");
  revalidatePath("/roadmap");
}
