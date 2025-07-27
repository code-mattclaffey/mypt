'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { UserProfile, DailyEntry } from '../types';

const getDailyTargets = (userProfile: UserProfile | null) => {
  if (!userProfile || !userProfile.targetCalories || !userProfile.targetSteps) {
    return { calories: 2000, steps: 8000 };
  }
  
  return { calories: userProfile.targetCalories, steps: userProfile.targetSteps };
};

function DailyEntryContent() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📝</span>
                <h1 className="text-2xl font-bold text-slate-100">Daily Entry</h1>
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

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
          <div className="p-8">
            <div className="text-center mb-8">
              <span className="text-5xl block mb-4">📊</span>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Daily Health Entry</h2>
              <p className="text-slate-300">Record your daily health metrics</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-slate-200 mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  How are you feeling today?
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.mood}
                  onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value) || 1})}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  step="1"
                />
                <div className="flex justify-between text-lg mt-2 px-1">
                  <span>😢</span>
                  <span>😐</span>
                  <span>😊</span>
                  <span>😄</span>
                  <span>🤩</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-slate-100 bg-white/10 rounded px-2 py-1">
                  {formData.mood === 1 && "Low mood"}
                  {formData.mood === 2 && "Not great"}
                  {formData.mood === 3 && "Okay"}
                  {formData.mood === 4 && "Pretty good"}
                  {formData.mood === 5 && "Very happy"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  What's your energy level today?
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.energy}
                  onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value) || 1})}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  step="1"
                />
                <div className="flex justify-between text-lg mt-2 px-1">
                  <span>🔋</span>
                  <span>🔋</span>
                  <span>🔋</span>
                  <span>🔋</span>
                  <span>⚡</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-slate-100 bg-white/10 rounded px-2 py-1">
                  {formData.energy === 1 && "Totally drained"}
                  {formData.energy === 2 && "Running low"}
                  {formData.energy === 3 && "Cruising along"}
                  {formData.energy === 4 && "Feeling energized"}
                  {formData.energy === 5 && "Supercharged!"}
                </div>
              </div>

              <div>
                <label htmlFor="calories" className="block text-sm font-semibold text-slate-200 mb-2">
                  How many calories did you consume today?
                </label>
                <input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100 placeholder-slate-400"
                  min="0"
                  placeholder="Enter calories consumed"
                />
              </div>

              <div>
                <label htmlFor="steps" className="block text-sm font-semibold text-slate-200 mb-2">
                  How many steps did you take today?
                </label>
                <input
                  id="steps"
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100 placeholder-slate-400"
                  min="0"
                  placeholder="Enter steps taken"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-slate-200 mb-2">
                  What's your current weight? (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100 placeholder-slate-400"
                  min="0"
                  placeholder="Enter current weight"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium cursor-pointer"
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

export default function DailyEntryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <DailyEntryContent />
    </Suspense>
  );
}