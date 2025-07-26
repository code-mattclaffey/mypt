'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { UserProfile, DailyEntry } from '../types';

export default function WeightPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    const savedEntries = localStorage.getItem('healthAssistant_entries');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
      
      const todayEntry = parsedEntries[date];
      if (todayEntry) {
        setWeight(todayEntry.weight.toString());
      } else {
        // Pre-fill with previous day's weight or profile weight
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateKey = format(prevDate, 'yyyy-MM-dd');
        
        if (parsedEntries[prevDateKey]) {
          setWeight(parsedEntries[prevDateKey].weight.toString());
        }
      }
    }
  }, [date]);

  const getPreviousWeight = () => {
    if (!date) return userProfile?.weight || 70;
    
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateKey = format(prevDate, 'yyyy-MM-dd');
    
    if (entries[prevDateKey]) {
      return entries[prevDateKey].weight;
    }
    
    return userProfile?.weight || 70;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingEntry = entries[date];
    const newEntry: DailyEntry = {
      date,
      mood: existingEntry?.mood || 3,
      energy: existingEntry?.energy || 3,
      calories: existingEntry?.calories || 2000,
      steps: existingEntry?.steps || 8000,
      weight: parseFloat(weight)
    };

    const updatedEntries = {
      ...entries,
      [date]: newEntry
    };

    setEntries(updatedEntries);
    localStorage.setItem('healthAssistant_entries', JSON.stringify(updatedEntries));
    
    router.push('/');
  };

  const getLatestWeight = () => {
    const sortedEntries = Object.entries(entries)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
    return sortedEntries.length > 0 ? sortedEntries[0][1].weight : userProfile?.weight || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
                  <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8z" fill="#60a5fa"/>
                  <circle cx="20" cy="16" r="2" fill="white"/>
                  <path d="M15 22h10l-2 4h-6l-2-4z" fill="white"/>
                  <path d="M18 20h4v2h-4v-2z" fill="white"/>
                  <circle cx="14" cy="18" r="1" fill="#22c55e"/>
                  <circle cx="26" cy="18" r="1" fill="#22c55e"/>
                  <path d="M20 28c-1.5 0-3-0.5-4-1.5l1-1c0.7 0.7 1.8 1 3 1s2.3-0.3 3-1l1 1c-1 1-2.5 1.5-4 1.5z" fill="#1d4ed8"/>
                </svg>
                <h1 className="text-2xl font-bold text-gray-800">Weight Entry</h1>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium cursor-pointer"
              >
                Back to Calendar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Record Your Weight</h2>
              <p className="text-gray-600">Track your progress towards your goal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-lg"
                    placeholder="Enter your current weight"
                    min="30"
                    max="300"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    kg
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Your last recorded weight: {getLatestWeight()}kg</p>
              </div>

              {userProfile && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-1">Goal Reminder</h3>
                      <p className="text-purple-800 text-sm">
                        Target: {userProfile.goalWeight}kg
                        {weight && ` | Difference: ${Math.abs(parseFloat(weight) - userProfile.goalWeight).toFixed(1)}kg`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
                >
                  Save Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}