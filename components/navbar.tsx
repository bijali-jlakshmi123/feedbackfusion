"use client";

import { Sparkle, Map, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 justify-center">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                FeedbackFusion
              </span>
            </div>
          </Link>

          <Link
            href="/roadmap"
            className="text-sm hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Map className="h-4 w-4" />
            Roadmap
          </Link>

          <Link
            href="/feedback"
            className="text-sm hover:text-primary flex items-center gap-1 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm hover:text-primary transition-colors flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </nav>
  );
}
