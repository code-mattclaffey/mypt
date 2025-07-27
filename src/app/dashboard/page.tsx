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

  useEffect(() => {
    // Check if user has profile, redirect to home if they don't
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    if (!savedProfile) {
      router.push('/');
      return;
    }
    setUserProfile(JSON.parse(savedProfile));
    const handleFocus = () => {
      const savedProfile = localStorage.getItem('healthAssistant_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        router.push('/');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-100 font-sans">
                  HealthSync
                </h1>
                <p className="text-xs text-slate-400 -mt-1 font-medium tracking-wide">AI-Powered Health Insights</p>
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
                    className="px-4 py-2 border-2 border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium cursor-pointer flex items-center gap-2"
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
                    className="p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {showMobileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2">
                      <button
                        onClick={() => {
                          router.push("/daily-entry");
                          setShowMobileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2 text-slate-300"
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
                        className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2 text-slate-300"
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
          <div className={`grid grid-cols-1 gap-4 ${new Date().getDay() === 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {new Date().getDay() === 0 && (
              <AISummaryCard onClick={() => router.push('/summary')} />
            )}
            
            <UserProfileCard userProfile={userProfile} onEditProfile={() => router.push("/profile")} />
            
            <GoalProgressCard
              key={`${userProfile.goalWeight}-${userProfile.targetCalories}-${userProfile.targetSteps}`}
              progress={getGoalProgress().progress}
              remaining={getGoalProgress().remaining}
              currentWeight={getLatestWeight()}
              goalWeight={userProfile.goalWeight}
              dailyTargets={getDailyTargets()}
              onDailyEntry={() => router.push(`/daily-entry?date=${format(new Date(), 'yyyy-MM-dd')}`)}
            />
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
