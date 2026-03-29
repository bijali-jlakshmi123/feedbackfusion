import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PlusIcon, Map, Filter, Check, X, SortDesc } from "lucide-react";
import Link from "next/link";
import { getCategoryDesign, CATEGORIES_TYPES } from "../data/category-data";
import { Badge } from "@/components/ui/badge";
import { STATUS_GROUPS, STATUS_ORDER } from "../data/status-data";
import FeedbackList from "@/components/feedback-list";

interface FeedbackPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    filter?: "my_feedback" | "my_votes";
    sort?: "newest" | "most_voted";
  }>;
}

export default async function FeedbackPage({ searchParams }: FeedbackPageProps) {
  const { userId: clerkUserId } = await auth();
  const { category, status, filter, sort = "newest" } = await searchParams;

  const user = clerkUserId
    ? await prisma.user.findUnique({ where: { clerkUserId } })
    : null;

  // Build prisma filter
  const where: any = {};
  if (category) where.category = category;
  if (status) where.status = status;

  if (filter === "my_feedback" && user) {
    where.authorId = user.id;
  }

  if (filter === "my_votes" && user) {
    where.votes = { some: { userId: user.id } };
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: true,
      votes: true,
    },
    orderBy:
      sort === "most_voted"
        ? { votes: { _count: "desc" } }
        : { createdAt: "desc" },
  });

  const categoryCounts = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <GradientHeader
        title="Community Feedback"
        subtitle="Explore, vote, and contribute to the features that matter most. Your voice shapes our product's future."
      >
        <div className="flex flex-wrap gap-3 justify-center pt-6">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-sm"
          >
            <Link href="/feedback/new" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Feedback
            </Link>
          </Button>

          <Button asChild size="lg" variant="secondary" className="shadow-sm">
            <Link href="/roadmap" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              View Roadmap
            </Link>
          </Button>
        </div>
      </GradientHeader>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-muted/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </CardTitle>
                {(category || status) && (
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-red-500">
                    <Link href="/feedback">
                      Reset
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</h4>
                <div className="space-y-1">
                  {CATEGORIES_TYPES.map((catType) => {
                    const design = getCategoryDesign(catType);
                    const Icon = design.icon;
                    const isActive = category === catType;
                    const count = categoryCounts.find(c => c.category === catType)?._count || 0;

                    return (
                      <Link
                        key={catType}
                        href={`/feedback?category=${catType}${status ? `&status=${status}` : ""}`}
                        className={`group flex items-center justify-between p-2 rounded-xl transition-all ${
                          isActive 
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border border-blue-200" 
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           <div className={`p-1.5 rounded-lg border ${isActive ? "bg-white dark:bg-blue-800 border-blue-200" : "bg-muted/40 border-transparent"} group-hover:scale-110 transition`}>
                             <Icon className="h-3.5 w-3.5" />
                           </div>
                           <span className="text-sm">{catType}</span>
                        </div>
                        <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground/80 group-hover:bg-muted-foreground/10 group-hover:text-foreground transition-all">
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</h4>
                <div className="space-y-1">
                  {STATUS_ORDER.map((statusKey) => {
                    const statusInfo = STATUS_GROUPS[statusKey as keyof typeof STATUS_GROUPS];
                    const isActive = status === statusKey;

                    return (
                      <Link
                        key={statusKey}
                        href={`/feedback?status=${statusKey}${category ? `&category=${category}` : ""}${filter ? `&filter=${filter}` : ""}`}
                        className={`group flex items-center justify-between p-2 rounded-xl transition-all ${
                          isActive 
                            ? "bg-muted text-foreground font-bold border border-muted-foreground/20" 
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           <div className={`h-2 w-2 rounded-full ${statusInfo.bgColor.split(' ')[0]} ${statusInfo.color.replace('border-', 'bg-')}`} />
                           <span className="text-sm">{statusInfo.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Activity Filter */}
              {user && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">My Activity</h4>
                  <div className="space-y-1">
                    <Link
                      key="my-feedback"
                      href={`/feedback?filter=my_feedback${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}`}
                      className={`group flex items-center justify-between p-2 rounded-xl transition-all ${
                        filter === "my_feedback"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border border-blue-200"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm">My Feedback</span>
                    </Link>
                    <Link
                       key="my-votes"
                      href={`/feedback?filter=my_votes${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}`}
                      className={`group flex items-center justify-between p-2 rounded-xl transition-all ${
                        filter === "my_votes"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border border-blue-200"
                          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm">My Votes</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Sorting Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <SortDesc className="h-3 w-3" />
                  Sorting
                </h4>
                <div className="flex flex-wrap gap-2">
                   <Button asChild variant={sort === "newest" ? "default" : "secondary"} size="sm" className="rounded-full text-xs h-8">
                     <Link href={`/feedback?sort=newest${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}`}>
                       Newest
                     </Link>
                   </Button>
                   <Button asChild variant={sort === "most_voted" ? "default" : "secondary"} size="sm" className="rounded-full text-xs h-8">
                     <Link href={`/feedback?sort=most_voted${category ? `&category=${category}` : ""}${status ? `&status=${status}` : ""}`}>
                       Most Voted
                     </Link>
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Stats Card if logged in? */}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              {category ? `${category} Feedback` : "Latest Feedback"}
            </h2>

            <div className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground">{posts.length}</span> suggestions
            </div>
          </div>

          <div className="space-y-4">
            <FeedbackList initialPosts={posts} userId={user?.id || null} />
          </div>
        </div>
      </div>
    </div>
  );
}
