import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>
              by the{" "}
              <Link
                href="https://bijali-jayalakshmi-jayan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600"
              >
                Bijali Jayalakshmi Jayan
              </Link>
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} Feedback Fusion. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
