"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, MessageSquare } from "lucide-react";
import { toggleVote } from "@/app/feedback/actions";
import { useState, useEffect } from "react";

interface FeedbackListProps {
  initialPosts: any[];
  userId: number | null;
}

export default function FeedbackList({ initialPosts, userId }: FeedbackListProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (initialPosts.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 bg-muted/20 border-dashed">
        <div className="bg-muted p-4 rounded-full mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No feedback yet</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-center px-6">
          Be the first to share your thoughts and help us improve.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {initialPosts.map((post) => (
        <Card
          key={post.id}
          className="group p-5 hover:border-blue-500/50 hover:shadow-md transition-all duration-300 cursor-pointer border-muted/60 bg-card/80 backdrop-blur-sm"
        >
          <div className="flex gap-6">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button
                onClick={() => toggleVote(post.id)}
                className={`p-2 rounded-xl transition-all duration-300 transform active:scale-95 ${
                  post.votes.some((v: any) => v.userId === userId)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-muted/60 group-hover:bg-blue-50 text-muted-foreground group-hover:text-blue-600 border border-transparent hover:border-blue-200"
                }`}
              >
                <ChevronUp className="h-5 w-5" />
              </button>
              <span className={`font-bold text-sm tracking-tight ${
                post.votes.some((v: any) => v.userId === userId) ? "text-blue-600" : "text-foreground"
              }`}>
                {post.votes?.length || 0}
              </span>
            </div>

            {/* Content Section */}
            <div className="grow space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                   <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0">
                    {post.category || "General"}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {isMounted ? new Date(post.createdAt).toLocaleDateString() : '...'}
                </span>
              </div>

              <h3 className="text-lg font-bold group-hover:text-blue-600 transition tracking-tight">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {post.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-linear-to-br from-blue-400 to-purple-500 border border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold overflow-hidden">
                    {post.author?.image ? (
                        <img src={post.author.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                        post.author?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground/80">
                    {post.author?.name || "Anonymous Member"}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
