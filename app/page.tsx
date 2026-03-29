"use client";

import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 h-[400px] w-[400px] bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="space-y-20 px-4 md:px-8">
        {/* 🔥 HERO SECTION */}
        <section className="relative text-center pt-16 pb-10 overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border text-sm">
              <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              AI Powered Feedback System
            </div>

            {/* TITLE */}
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Turn Feedback Into{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Product Growth
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              Collect, analyze, and prioritize user feedback with powerful AI
              insights. Build exactly what your users want.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {/* PRIMARY */}
              <Link
                href="/feedback/new"
                className="group inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition-all duration-300"
              >
                Submit Feedback
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>

              {/* SECONDARY */}
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border bg-white/10 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
              >
                View Roadmap
                <Map className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* TRUST TEXT */}
            <p className="text-xs text-muted-foreground pt-4">
              Trusted by developers & startups worldwide
            </p>
          </div>
        </section>

        {/* ✨ FEATURES */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "AI Insights",
              desc: "Automatically analyze feedback with powerful AI.",
            },
            {
              title: "Smart Roadmap",
              desc: "Prioritize features based on user demand.",
            },
            {
              title: "User Engagement",
              desc: "Keep your users involved and updated.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border bg-white/5 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* 📊 STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Users", value: "10K+" },
            { label: "Feedbacks", value: "25K+" },
            { label: "Features Built", value: "1.2K+" },
            { label: "Satisfaction", value: "98%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border"
            >
              <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* 💬 TESTIMONIAL */}
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-lg italic text-muted-foreground">
            "This platform completely changed how we handle user feedback!"
          </p>
          <p className="font-semibold">— Happy Customer</p>
        </section>

        {/* 🚀 CTA */}
        <section className="text-center space-y-6 pb-16">
          <h2 className="text-3xl font-bold">
            Build what users actually want 🚀
          </h2>

          <Link
            href="/feedback/new"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-all"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
