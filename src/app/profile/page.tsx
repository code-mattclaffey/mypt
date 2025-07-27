'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../types';

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    height: 170,
    sex: 'male' as 'male' | 'female',
    weight: 70,
    activityLevel: 3 as 1 | 2 | 3 | 4 | 5,
    goalWeight: 65,
    targetDate: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setFormData({
        height: profile.height || 170,
        sex: profile.sex || 'male',
        weight: profile.weight || 70,
        activityLevel: profile.activityLevel || 3,
        goalWeight: profile.goalWeight || 65,
        targetDate: profile.targetDate || ''
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/get-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entries: {},
          weekStart: new Date().toISOString().split('T')[0],
          currentWeight: formData.weight,
          goalWeight: formData.goalWeight,
          startWeight: formData.weight,
          targetDate: formData.targetDate,
          height: formData.height,
          sex: formData.sex,
          activityLevel: formData.activityLevel
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const profileWithTargets = {
          ...formData,
          targetCalories: data.targetCalories || 2000,
          targetSteps: data.targetSteps || 8000
        };
        localStorage.setItem('healthAssistant_profile', JSON.stringify(profileWithTargets));
      } else {
        localStorage.setItem('healthAssistant_profile', JSON.stringify(formData));
      }
    } catch (error) {
      console.error('Failed to get initial targets:', error);
      localStorage.setItem('healthAssistant_profile', JSON.stringify(formData));
    }
    
    router.back();
  };

  const activityLabels = {
    1: 'Sedentary',
    2: 'Lightly Active',
    3: 'Moderately Active',
    4: 'Very Active',
    5: 'Super Active'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚙️</span>
                <h1 className="text-2xl font-bold text-slate-100">Profile Settings</h1>
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
              <span className="text-5xl block mb-4">👤</span>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                {userProfile ? 'Edit Your Profile' : 'Create Your Profile'}
              </h2>
              <p className="text-slate-300">Set up your health tracking preferences</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-slate-200 mb-2">
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100 placeholder-slate-400"
                  min="100"
                  max="250"
                  placeholder="Enter your height"
                  required
                />
              </div>

              <div>
                <label htmlFor="sex" className="block text-sm font-semibold text-slate-200 mb-2">
                  Sex
                </label>
                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(e) => setFormData({...formData, sex: e.target.value as 'male' | 'female'})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-slate-200 mb-2">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100 placeholder-slate-400"
                  min="30"
                  max="300"
                  placeholder="Enter your weight"
                  required
                />
              </div>

              <div>
                <label htmlFor="goalWeight" className="block text-sm font-semibold text-slate-200 mb-2">
                  Goal Weight (kg)
                </label>
                <input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={formData.goalWeight}
                  onChange={(e) => setFormData({...formData, goalWeight: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100 placeholder-slate-400"
                  min="30"
                  max="300"
                  placeholder="Enter your goal weight"
                  required
                />
              </div>

              <div>
                <label htmlFor="targetDate" className="block text-sm font-semibold text-slate-200 mb-2">
                  Target Date
                </label>
                <input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/10 text-slate-100"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-semibold text-slate-200 mb-3">
                  Activity Level
                </label>
                <input
                  id="activity"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({...formData, activityLevel: (parseInt(e.target.value) || 1) as 1 | 2 | 3 | 4 | 5})}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  step="1"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-slate-100 bg-white/10 rounded px-2 py-1">
                  {activityLabels[formData.activityLevel]}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {userProfile && (
                  <button 
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
                >
                  {userProfile ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}