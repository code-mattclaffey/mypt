"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Calendar from "../components/Calendar";

import GoalProgressCard from "../components/GoalProgressCard";
import UserProfileCard from "../components/UserProfileCard";
import WelcomeScreen from "../components/WelcomeScreen";
import AISummaryCard from "../components/AISummaryCard";
import { useHealthData } from "../hooks/useHealthData";
import { useHealthCalculations } from "../hooks/useHealthCalculations";
import { DailyEntry } from "../types";

export default function Home() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { userProfile, setUserProfile, entries, setEntries } = useHealthData();

  // Dashboard page - no redirect needed since users come here intentionally

  useEffect(() => {
    const handleFocus = () => {
      const savedProfile = localStorage.getItem('healthAssistant_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        router.push('/sign-up');
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'healthAssistant_profile' && e.newValue) {
        setUserProfile(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUserProfile]);
  const { getLatestWeight, getGoalProgress, getDailyTargets } =
    useHealthCalculations(userProfile, entries);

  const handleDateSelect = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    router.push(`/daily-entry?date=${dateString}`);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  {/* Main circle with gradient */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" stroke="#1d4ed8" strokeWidth="2"/>
                  
                  {/* AI Brain/Circuit pattern */}
                  <circle cx="15" cy="15" r="2" fill="white" opacity="0.9"/>
                  <circle cx="25" cy="15" r="2" fill="white" opacity="0.9"/>
                  <circle cx="20" cy="25" r="2" fill="white" opacity="0.9"/>
                  
                  {/* Connecting lines */}
                  <path d="M15 15 L25 15 L20 25 Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
                  
                  {/* Fitness dumbbell icon */}
                  <rect x="12" y="19" width="16" height="2" rx="1" fill="white"/>
                  <rect x="11" y="17" width="2" height="6" rx="1" fill="white"/>
                  <rect x="27" y="17" width="2" height="6" rx="1" fill="white"/>
                  
                  {/* Sparkle effects */}
                  <circle cx="30" cy="12" r="1" fill="#fbbf24" opacity="0.8"/>
                  <circle cx="32" cy="28" r="1" fill="#f59e0b" opacity="0.8"/>
                  <circle cx="8" cy="25" r="1" fill="#10b981" opacity="0.8"/>
                </svg>
                {/* AI pulse effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent font-mono">
                  MyPT.ai
                </h1>
                <p className="text-xs text-gray-500 -mt-1 font-medium tracking-wide">Your AI Personal Trainer</p>
              </div>
            </div>
            {userProfile && (
              <>
                {/* Desktop buttons */}
                <div className="hidden sm:flex gap-3">
                  <button
                    onClick={() => router.push("/daily-entry")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Daily Entry
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium cursor-pointer flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
                
                {/* Mobile hamburger menu */}
                <div className="sm:hidden relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {showMobileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                      <button
                        onClick={() => {
                          router.push("/daily-entry");
                          setShowMobileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Daily Entry
                      </button>
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setShowMobileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">

        {userProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UserProfileCard userProfile={userProfile} />
            
            <GoalProgressCard
              key={`${userProfile.goalWeight}-${userProfile.targetCalories}-${userProfile.targetSteps}`}
              progress={getGoalProgress().progress}
              remaining={getGoalProgress().remaining}
              currentWeight={getLatestWeight()}
              goalWeight={userProfile.goalWeight}
              dailyTargets={getDailyTargets()}
            />
            
            <AISummaryCard onClick={() => router.push('/summary')} />
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/sign-up")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
            >
              Create Your Profile
            </button>
          </div>
        )}

        <div className="flex-1">
          {userProfile ? (
            <Calendar
              entries={entries}
              onDateSelect={handleDateSelect}
              targetDate={userProfile?.targetDate}
              userProfile={userProfile}
            />
          ) : (
            <WelcomeScreen onCreateProfile={() => router.push("/sign-up")} />
          )}
        </div>
      </div>
    </div>
  );
}
