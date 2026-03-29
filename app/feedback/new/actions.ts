"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFeedback(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const autoVote = formData.get("autoVote") === "on";

  if (!title || !category) {
    throw new Error("Missing required fields");
  }

  // Ensure user exists in our database
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not found in Clerk");

    user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        image: clerkUser.imageUrl,
      },
    });
  }

  const post = await prisma.$transaction(async (tx) => {
    const newPost = await tx.post.create({
      data: {
        title,
        description,
        category,
        authorId: user.id,
      },
    });

    if (autoVote) {
      await tx.vote.create({
        data: {
          userId: user.id,
          postId: newPost.id,
        },
      });
    }

    return newPost;
  });

  revalidatePath("/feedback");
  redirect("/feedback");
}
