import { GradientHeader } from "@/components/gradient-header";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminFeedbackTable from "@/components/admin-feedback-table";
import { syncCurrentUser } from "@/lib/sync-user";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user is synced with DB
  const user = await syncCurrentUser();

  if (!user || user.role != "admin") {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="container mx-auto">
      <GradientHeader
        title="Admin Dashboard"
        subtitle="Manage feedbacks and update their status"
      />
      <AdminFeedbackTable posts={posts} />
    </div>
  );
}
