import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { syncCurrentUser } from "@/lib/sync-user";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Feedback Fusion",
  description: "Users suggests a votes features",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    await syncCurrentUser();
  } catch (error) {
    console.error("Failed to sync user in RootLayout:", error);
  }
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body 
        className={`${inter.className} min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            {/*Navbar*/}
            <Navbar />
            {/*Main section*/}
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            {/*Footer*/}
            <Footer />
            <Toaster position="top-center" richColors />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
