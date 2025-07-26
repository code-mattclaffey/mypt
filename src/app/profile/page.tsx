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
      setFormData(profile);
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
                <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {userProfile ? 'Edit Your Profile' : 'Create Your Profile'}
              </h2>
              <p className="text-gray-600">Set up your health tracking preferences</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                  min="100"
                  max="250"
                  placeholder="Enter your height"
                  required
                />
              </div>

              <div>
                <label htmlFor="sex" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sex
                </label>
                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(e) => setFormData({...formData, sex: e.target.value as 'male' | 'female'})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                  min="30"
                  max="300"
                  placeholder="Enter your weight"
                  required
                />
              </div>

              <div>
                <label htmlFor="goalWeight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Goal Weight (kg)
                </label>
                <input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={formData.goalWeight}
                  onChange={(e) => setFormData({...formData, goalWeight: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                  min="30"
                  max="300"
                  placeholder="Enter your goal weight"
                  required
                />
              </div>

              <div>
                <label htmlFor="targetDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-semibold text-gray-700 mb-3">
                  Activity Level
                </label>
                <input
                  id="activity"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({...formData, activityLevel: (parseInt(e.target.value) || 1) as 1 | 2 | 3 | 4 | 5})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  step="1"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-green-600">
                  {activityLabels[formData.activityLevel]}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {userProfile && (
                  <button 
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
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