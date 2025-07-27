"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "../types";
import { useHealthCalculations } from "../hooks/useHealthCalculations";

export default function AISummaryPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [summary, setSummary] = useState<string>("");
  const [newGoal, setNewGoal] = useState<number>(0);
  const [newTargetCalories, setNewTargetCalories] = useState<number>(0);
  const [newTargetSteps, setNewTargetSteps] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { getDailyTargets } = useHealthCalculations(userProfile, {});

  const getProgressStatus = () => {
    if (!userProfile || !userProfile.targetDate) return null;

    const totalWeightToLose = Math.abs(
      userProfile.weight - userProfile.goalWeight
    );
    const weightLost = Math.abs(userProfile.weight - currentWeight);
    const remaining = Math.abs(currentWeight - userProfile.goalWeight);
    const progressPercent =
      totalWeightToLose > 0 ? (weightLost / totalWeightToLose) * 100 : 0;

    const targetDate = new Date(userProfile.targetDate);
    const today = new Date();
    const totalDays = Math.ceil(
      (targetDate.getTime() -
        new Date(userProfile.targetDate).getTime() +
        365 * 24 * 60 * 60 * 1000) /
        (1000 * 60 * 60 * 24)
    );
    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const timeProgressPercent =
      totalDays > 0 ? ((totalDays - daysRemaining) / totalDays) * 100 : 0;

    const isOnTrack = progressPercent >= timeProgressPercent - 10; // 10% tolerance

    return (
      <div
        className={`rounded-lg p-4 ${
          isOnTrack
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isOnTrack ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <h3
            className={`font-semibold ${
              isOnTrack ? "text-green-800" : "text-red-800"
            }`}
          >
            {isOnTrack ? "On Track" : "Behind Target"}
          </h3>
        </div>
        <p
          className={`text-sm ${isOnTrack ? "text-green-700" : "text-red-700"}`}
        >
          You've lost {weightLost.toFixed(1)}kg ({progressPercent.toFixed(1)}%
          of goal) with {daysRemaining} days remaining.
          {isOnTrack
            ? " Great progress! Keep up the good work."
            : " Consider adjusting your plan to reach your goal on time."}
        </p>
      </div>
    );
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthAssistant_profile");
    const savedEntries = localStorage.getItem("healthAssistant_entries");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        const sortedEntries = Object.entries(entries).sort(
          ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
        );
        const latestWeight = sortedEntries.length > 0 
          ? (sortedEntries[0][1] as any).weight 
          : profile.weight;
        setCurrentWeight(latestWeight);
      } else {
        setCurrentWeight(profile.weight);
      }
    }
  }, []);

  const handleGetSummary = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      // Get all entries for analysis
      const savedEntries = localStorage.getItem("healthAssistant_entries");
      const allEntries = savedEntries ? JSON.parse(savedEntries) : {};

      const today = new Date();
      const recentEntries: Record<string, any> = {};

      // Get entries from the past 30 days for better analysis
      for (let i = -30; i <= 0; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split("T")[0];
        if (allEntries[dateKey]) {
          recentEntries[dateKey] = allEntries[dateKey];
        }
      }

      const response = await fetch("/api/get-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: recentEntries,
          weekStart: today.toISOString().split("T")[0],
          currentWeight,
          goalWeight: userProfile.goalWeight,
          startWeight: userProfile.weight,
          targetDate: userProfile.targetDate,
          height: userProfile.height,
          sex: userProfile.sex,
          activityLevel: userProfile.activityLevel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setSummary(data.summary || data.text || "No summary available");
        setNewGoal(data.newGoalWeight || userProfile.goalWeight);
        setNewTargetCalories(data.recommendedCalories || getDailyTargets().calories);
        setNewTargetSteps(data.recommendedSteps || getDailyTargets().steps);
        setHasError(false);
        setShowSummary(true);
      } else {
        setSummary("Sorry, AI insights are temporarily unavailable. Please try again later.");
        setHasError(true);
        setShowSummary(true);
      }
    } catch (error) {
      console.error("Failed to get AI summary:", error);
      setSummary("Sorry, AI insights are temporarily unavailable. Please try again later.");
      setHasError(true);
      setShowSummary(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChanges = () => {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      goalWeight: Math.max(newGoal, userProfile.goalWeight),
      targetCalories: newTargetCalories,
      targetSteps: newTargetSteps,
    };

    console.log("Saving updated profile:", updatedProfile);
    localStorage.setItem(
      "healthAssistant_profile",
      JSON.stringify(updatedProfile)
    );
    console.log("Profile saved to localStorage");

    // Trigger a storage event to notify other components
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "healthAssistant_profile",
        newValue: JSON.stringify(updatedProfile),
      })
    );

    router.back();
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
                  <path d="M12 8v16l8-8-8-8z" fill="white"/>
                  <circle cx="22" cy="10" r="3" fill="#10b981"/>
                  <circle cx="10" cy="22" r="3" fill="#f59e0b"/>
                </svg>
                <h1 className="text-2xl font-bold text-slate-100">AI Insights</h1>
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">
              Weight Progress Analysis
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-slate-300">Start Weight</h3>
                <p className="text-xl font-bold text-slate-100">
                  {userProfile.weight}kg
                </p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-200">Current Weight</h3>
                <p className="text-xl font-bold text-blue-100">
                  {currentWeight}kg
                </p>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-purple-200">Goal Weight</h3>
                <p className="text-xl font-bold text-purple-100">
                  {userProfile.goalWeight}kg
                </p>
              </div>
            </div>
            {getProgressStatus()}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
          <div className="p-6">
            {!showSummary ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-100 mb-4">
                  Get AI Insights
                </h2>
                <p className="text-slate-300 mb-6">
                  Let our AI analyze your progress and suggest personalized goal
                  adjustments
                </p>
                <button
                  onClick={handleGetSummary}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Get AI Insights"}
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-4">
                  AI Recommendations
                </h2>
                <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-200 whitespace-pre-wrap">{summary}</p>
                </div>
                {!hasError && (newGoal > userProfile.goalWeight ||
                  newTargetCalories !== (userProfile.targetCalories || 0) ||
                  newTargetSteps !== (userProfile.targetSteps || 0)) && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-yellow-200 mb-2">
                      Suggested Updates
                    </h3>
                    {newGoal > userProfile.goalWeight && (
                      <p className="text-yellow-100 mb-1">
                        New goal weight:{" "}
                        <span className="font-bold">{newGoal}kg</span> (was{" "}
                        {userProfile.goalWeight}kg)
                      </p>
                    )}
                    {newTargetCalories !==
                      (userProfile.targetCalories || 0) && (
                      <p className="text-yellow-100 mb-1">
                        New target calories:{" "}
                        <span className="font-bold">{newTargetCalories}</span>{" "}
                        (was {userProfile.targetCalories || "not set"})
                      </p>
                    )}
                    {newTargetSteps !== (userProfile.targetSteps || 0) && (
                      <p className="text-yellow-100">
                        New target steps:{" "}
                        <span className="font-bold">{newTargetSteps}</span> (was{" "}
                        {userProfile.targetSteps || "not set"})
                      </p>
                    )}
                  </div>
                )}
                {!hasError && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowSummary(false)}
                      className="flex-1 px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium cursor-pointer"
                    >
                      Get New Summary
                    </button>
                    <button
                      onClick={handleAcceptChanges}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                    >
                      Accept Changes
                    </button>
                  </div>
                )}
                {hasError && (
                  <button
                    onClick={() => setShowSummary(false)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
