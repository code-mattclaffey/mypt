'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
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
      router.push('/dashboard');
      return;
    }
  }, [router]);

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
          targetCalories: data.recommendedCalories || 2000,
          targetSteps: data.recommendedSteps || 8000
        };
        localStorage.setItem('healthAssistant_profile', JSON.stringify(profileWithTargets));
      } else {
        localStorage.setItem('healthAssistant_profile', JSON.stringify(formData));
      }
    } catch (error) {
      console.error('Failed to get initial targets:', error);
      localStorage.setItem('healthAssistant_profile', JSON.stringify(formData));
    }
    
    router.push('/dashboard');
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
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
          <div className="p-8">
            <div className="text-center mb-8">
              <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
                <path d="M12 8v16l8-8-8-8z" fill="white"/>
                <circle cx="22" cy="10" r="3" fill="#10b981"/>
                <circle cx="10" cy="22" r="3" fill="#f59e0b"/>
              </svg>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Create Your Profile</h2>
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

              <button 
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
              >
                Create Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}