'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has profile, redirect to dashboard if they do
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    if (savedProfile) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" stroke="#1d4ed8" strokeWidth="2"/>
              <circle cx="15" cy="15" r="2" fill="white" opacity="0.9"/>
              <circle cx="25" cy="15" r="2" fill="white" opacity="0.9"/>
              <circle cx="20" cy="25" r="2" fill="white" opacity="0.9"/>
              <path d="M15 15 L25 15 L20 25 Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
              <rect x="12" y="19" width="16" height="2" rx="1" fill="white"/>
              <rect x="11" y="17" width="2" height="6" rx="1" fill="white"/>
              <rect x="27" y="17" width="2" height="6" rx="1" fill="white"/>
              <circle cx="30" cy="12" r="1" fill="#fbbf24" opacity="0.8"/>
              <circle cx="32" cy="28" r="1" fill="#f59e0b" opacity="0.8"/>
              <circle cx="8" cy="25" r="1" fill="#10b981" opacity="0.8"/>
            </svg>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent font-mono">
            MyPT.ai
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Your AI Personal Trainer
            <span className="block bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              That Actually Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized fitness plans, track your progress, and receive AI-powered insights 
            that adapt to your lifestyle. No more generic workouts or confusing diet plans.
          </p>
          <button
            onClick={() => router.push('/sign-up')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Journey Free
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Get personalized recommendations that adapt to your progress, lifestyle, and goals in real-time.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Progress Tracking</h3>
            <p className="text-gray-600">
              Visual calendar tracking with intelligent analytics that show you exactly how you're progressing.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptive Goals</h3>
            <p className="text-gray-600">
              Your goals evolve with you. Our AI adjusts your targets based on your performance and lifestyle changes.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/30 shadow-xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Health?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already discovered the power of AI-driven fitness coaching. 
            Start your personalized journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/sign-up')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Now
            </button>
            <p className="text-sm text-gray-500">
              ✨ Free to start • No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}