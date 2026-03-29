import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES_TYPES } from "@/app/data/category-data";
import { createFeedback } from "./actions";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function NewFeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link 
        href="/feedback" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Feedback
      </Link>

      <GradientHeader
        title="Share Your Ideas"
        subtitle="Help us prioritize what's next. We read every single piece of feedback."
      />

      <Card className="border-muted/60 shadow-lg">
        <CardHeader>
          <CardTitle>Create Feedback</CardTitle>
          <CardDescription>
            Give your suggestion a clear title and description to help others understand it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createFeedback} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold tracking-tight">
                Feedback Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Add dark mode to the dashboard"
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-bold tracking-tight">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {CATEGORIES_TYPES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold tracking-tight">
                Detailed Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Explain what exactly this feature would do and why it's valuable..."
                required
                className="min-h-[150px] leading-relaxed"
              />
            </div>

            <div className="flex items-center space-x-2 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
              <input 
                type="checkbox" 
                id="autoVote" 
                name="autoVote" 
                defaultChecked 
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="autoVote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Upvote this suggestion automatically
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
               <Button asChild variant="outline" size="lg">
                <Link href="/feedback">Cancel</Link>
              </Button>
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold gap-2">
                Submit Feedback
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl flex items-start gap-4">
        <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg text-blue-600 dark:text-blue-400">
          <Send className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">Better descriptions get faster reviews</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300/80 leading-relaxed">
            Include use cases and clear problem statements to help our team understand the impact of your request.
          </p>
        </div>
      </div>
    </div>
  );
}
