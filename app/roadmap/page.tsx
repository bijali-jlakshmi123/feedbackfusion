import { GradientHeader } from "@/components/gradient-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { STATUS_GROUPS, STATUS_ORDER } from "../data/status-data";
import { getCategoryDesign } from "../data/category-data";
import { ChevronUp } from "lucide-react";

export default async function RoadmapPage() {
  const posts = await prisma.post.findMany({
    where: {
      status: {
        not: "under_review",
      },
    },
    include: {
      votes: true,
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Filter out under_review for the main roadmap view
  const roadmapStatuses = STATUS_ORDER.filter(status => status !== "under_review");

  return (
    <div className="space-y-8 pb-12">
      <GradientHeader
        title="Product Roadmap"
        subtitle="Follow our journey as we build out the most requested features and improvements."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roadmapStatuses.map((statusKey) => {
          const statusInfo = STATUS_GROUPS[statusKey as keyof typeof STATUS_GROUPS];
          const statusPosts = posts.filter((p) => p.status === statusKey);
          const Icon = statusInfo.icon;

          return (
            <div key={statusKey} className="flex flex-col gap-6">
              {/* Column Header */}
              <div className="space-y-2 px-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor} ${statusInfo.color} border`}>
                    <Icon className={`h-5 w-5 ${statusInfo.textColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight leading-none group">
                      {statusInfo.title}
                      <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-bold bg-muted text-muted-foreground align-middle">
                        {statusPosts.length}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {statusInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Column Content */}
              <div className="space-y-4">
                {statusPosts.map((post) => {
                  const categoryDesign = getCategoryDesign(post.category);
                  const CategoryIcon = categoryDesign.icon;

                  return (
                    <Card 
                      key={post.id} 
                      className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4 ${statusInfo.color} hover:scale-[1.02] cursor-pointer bg-card/50 backdrop-blur-xs`}
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <div className={`p-1 rounded-md ${categoryDesign.light} border ${categoryDesign.border}`}>
                               <CategoryIcon className={`h-3 w-3 ${categoryDesign.text}`} />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                               {post.category}
                             </span>
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full">
                             <ChevronUp className="h-3 w-3" />
                             {post.votes.length}
                           </div>
                        </div>
                        <CardTitle className="text-base font-bold leading-snug group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-muted/40 flex items-center gap-2">
                           <div className="h-5 w-5 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 border border-white shadow-sm flex items-center justify-center text-[8px] text-white font-black overflow-hidden">
                              {post.author?.image ? (
                                <img src={post.author.image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                post.author?.name?.charAt(0) || "U"
                              )}
                           </div>
                           <span className="text-[11px] font-medium text-muted-foreground">
                             Requested by {post.author?.name?.split(' ')[0] || "User"}
                           </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {statusPosts.length === 0 && (
                  <div className="text-center py-12 rounded-2xl border-2 border-dashed border-muted/40 bg-muted/5">
                    <p className="text-sm text-muted-foreground font-medium">Nothing here yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
