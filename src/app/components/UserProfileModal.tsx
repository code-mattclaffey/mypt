'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProfile?: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  existingProfile, 
  onSave 
}: UserProfileModalProps) {
  const [formData, setFormData] = useState({
    height: 170,
    sex: 'male' as 'male' | 'female',
    weight: 70,
    activityLevel: 3 as 1 | 2 | 3 | 4 | 5,
    goalWeight: 65,
    targetDate: ''
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
    }
  }, [existingProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (existingProfile) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const activityLabels = {
    1: 'Sedentary',
    2: 'Lightly Active',
    3: 'Moderately Active',
    4: 'Very Active',
    5: 'Super Active'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {existingProfile ? 'Edit Profile' : 'Create Profile'}
            </h3>
            {existingProfile && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
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
                onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
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
                onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                min="30"
                max="300"
                placeholder="Enter your weight"
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
                onChange={(e) => setFormData({...formData, activityLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                step="1"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <div className="text-center mt-2 text-sm font-medium text-primary-600">
                {activityLabels[formData.activityLevel]}
              </div>
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
                onChange={(e) => setFormData({...formData, goalWeight: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              {existingProfile && (
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
              >
                {existingProfile ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}