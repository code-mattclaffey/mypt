"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll("[data-scroll-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return visibleSections;
}

export default function LandingPage() {
  const router = useRouter();
  const visibleSections = useScrollAnimation();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    setHasProfile(!!savedProfile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
              <path d="M12 8v16l8-8-8-8z" fill="white"/>
              <circle cx="22" cy="10" r="3" fill="#10b981"/>
              <circle cx="10" cy="22" r="3" fill="#f59e0b"/>
            </svg>
            <h1 className="text-xl font-black tracking-tight text-slate-100 font-sans">
              HealthSync
            </h1>
          </div>
          <button
            onClick={() => router.push(hasProfile ? "/dashboard" : "/sign-up")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
          >
            {hasProfile ? 'Dashboard' : 'Get Started'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center px-6 relative">
        <div className="text-center max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-slate-100 mb-6 leading-tight">
            Your AI Personal Trainer
            <span className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              That Actually Works.
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized fitness plans, track your progress, and receive
            AI-powered insights that adapt to your lifestyle. No more generic
            workouts or confusing diet plans.
          </p>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
          >
            Start Your Journey Free
          </button>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="flex flex-col items-center text-slate-400">
            <span className="text-sm mb-2">Scroll to explore</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-20">
        {/* Story Section 1: The Problem */}
        <section
          id="problem"
          data-scroll-section
          className={`mb-20 md:mb-40 transition-all duration-1000 transform ${
            visibleSections.has("problem")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
              The Problem with Traditional Fitness
            </h3>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Generic workout plans. One-size-fits-all diets. Static goals that
              don't adapt to your life. Most fitness apps treat you like
              everyone else, ignoring what makes you unique.
            </p>
          </div>
        </section>

        {/* Story Section 2: Features */}
        <section
          id="features"
          data-scroll-section
          className={`mb-16 md:mb-32 transition-all duration-1000 transform ${
            visibleSections.has("features")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
              A Smarter Approach
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-100 mb-3">
                AI-Powered Insights
              </h4>
              <p className="text-slate-300">
                Get personalized recommendations that adapt to your progress,
                lifestyle, and goals in real-time.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-100 mb-3">
                Smart Progress Tracking
              </h4>
              <p className="text-slate-300">
                Visual calendar tracking with intelligent analytics that show
                you exactly how you're progressing.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-100 mb-3">
                Adaptive Goals
              </h4>
              <p className="text-slate-300">
                Your goals evolve with you. Our AI adjusts your targets based on
                your performance and lifestyle changes.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section 3: CTA */}
        <section
          id="cta"
          data-scroll-section
          className={`transition-all duration-1000 transform ${
            visibleSections.has("cta")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 shadow-xl text-center">
            <h3 className="text-3xl font-bold text-slate-100 mb-4">
              Your Journey Starts Here
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands who've discovered the power of AI-driven health
              coaching. Your personalized transformation begins with a single
              click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push("/sign-up")}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
              >
                Begin Your Transformation
              </button>
              <p className="text-sm text-slate-400">
                🎉{" "}
                <span className="font-semibold text-green-400">100% FREE</span>{" "}
                • No credit card • No hidden fees
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
