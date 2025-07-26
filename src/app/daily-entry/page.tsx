'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { UserProfile, DailyEntry } from '../types';

const getDailyTargets = (userProfile: UserProfile | null) => {
  if (!userProfile || !userProfile.targetCalories || !userProfile.targetSteps) {
    return { calories: 2000, steps: 8000 };
  }
  
  return { calories: userProfile.targetCalories, steps: userProfile.targetSteps };
};

export default function DailyEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [date, setDate] = useState(dateParam || format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    mood: 3,
    energy: 3,
    calories: 2000,
    steps: 8000,
    weight: 70
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    const savedEntries = localStorage.getItem('healthAssistant_entries');
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    }
    
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(entries).length === 0) return;
    
    const existingEntry = entries[date];
    if (existingEntry) {
      setFormData({
        mood: existingEntry.mood,
        energy: existingEntry.energy,
        calories: existingEntry.calories,
        steps: existingEntry.steps,
        weight: existingEntry.weight
      });
    } else {
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateKey = format(prevDate, 'yyyy-MM-dd');
      
      let weight = 70;
      if (entries[prevDateKey]) {
        weight = entries[prevDateKey].weight;
      } else if (userProfile) {
        weight = userProfile.weight;
      }
      
      // Calculate daily targets
      const targets = getDailyTargets(userProfile);
      
      setFormData({
        mood: 3,
        energy: 3,
        calories: targets.calories,
        steps: targets.steps,
        weight: weight
      });
    }
  }, [date, entries, userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: DailyEntry = {
      date,
      mood: formData.mood as 1 | 2 | 3 | 4 | 5,
      energy: formData.energy as 1 | 2 | 3 | 4 | 5,
      calories: formData.calories,
      steps: formData.steps,
      weight: formData.weight
    };

    const updatedEntries = {
      ...entries,
      [date]: newEntry
    };

    localStorage.setItem('healthAssistant_entries', JSON.stringify(updatedEntries));
    router.back();
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
                <h1 className="text-2xl font-bold text-gray-800">Daily Entry</h1>
              </div>
              <button 
                onClick={() => router.back()}
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Health Entry</h2>
              <p className="text-gray-600">Record your daily health metrics</p>
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mood (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mood}
                  onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value) || 1})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  step="1"
                />
                <div className="flex justify-between text-lg mt-2 px-1">
                  <span>😢</span>
                  <span>😐</span>
                  <span>😊</span>
                  <span>😄</span>
                  <span>🤩</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-blue-600">
                  Current: {formData.mood}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Energy (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.energy}
                  onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value) || 1})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  step="1"
                />
                <div className="flex justify-between text-lg mt-2 px-1">
                  <span>🔋</span>
                  <span>🔋</span>
                  <span>🔋</span>
                  <span>🔋</span>
                  <span>⚡</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-blue-600">
                  Current: {formData.energy}
                </div>
              </div>

              <div>
                <label htmlFor="calories" className="block text-sm font-semibold text-gray-700 mb-2">
                  Calories
                </label>
                <input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  min="0"
                  placeholder="Enter calories consumed"
                />
              </div>

              <div>
                <label htmlFor="steps" className="block text-sm font-semibold text-gray-700 mb-2">
                  Steps
                </label>
                <input
                  id="steps"
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  min="0"
                  placeholder="Enter steps taken"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  min="0"
                  placeholder="Enter current weight"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}