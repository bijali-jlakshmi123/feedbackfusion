import { currentUser, clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function syncCurrentUser() {
  try {
    // Get user data from clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    // Check if user exists in db
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (dbUser) {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email,
          name: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`.trim(),
          image: clerkUser.imageUrl,
        },
      });
    } else {
      // Create a new user in database
      // Check if this is the first user- make them admin
      // OR if it's the specified admin email
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;
      const isConfiguredAdmin =
        email === "bijalijayalakshmijayan@gmail.com";

      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`.trim(),
          image: clerkUser.imageUrl,
          role: isFirstUser || isConfiguredAdmin ? "admin" : "user",
        },
      });
      console.log(`New user created: ${email} with role: ${dbUser.role}`);
    }

    // Sync role to Clerk public metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        role: dbUser.role,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error syncing user from Clerk:", error);
    throw error;
  }
}
