'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DailyEntry, UserProfile } from '../types';

// Add custom slider styles
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}

interface DailyEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  existingEntry?: DailyEntry;
  onSave: (entry: DailyEntry) => void;
  entries: Record<string, DailyEntry>;
  userProfile?: UserProfile;
}

export default function DailyEntryModal({ 
  isOpen, 
  onClose, 
  date, 
  existingEntry, 
  onSave,
  entries,
  userProfile
}: DailyEntryModalProps) {
  const getPreviousWeight = () => {
    if (!date) return userProfile?.weight || 70;
    
    // Look for previous day's entry
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateKey = format(prevDate, 'yyyy-MM-dd');
    
    if (entries[prevDateKey]) {
      return entries[prevDateKey].weight;
    }
    
    return userProfile?.weight || 70;
  };

  const [formData, setFormData] = useState({
    mood: 3,
    energy: 3,
    calories: 2000,
    steps: 8000,
    weight: getPreviousWeight()
  });

  useEffect(() => {
    if (existingEntry) {
      setFormData({
        mood: existingEntry.mood,
        energy: existingEntry.energy,
        calories: existingEntry.calories,
        steps: existingEntry.steps,
        weight: existingEntry.weight
      });
    } else {
      setFormData({
        mood: 3,
        energy: 3,
        calories: 2000,
        steps: 8000,
        weight: getPreviousWeight()
      });
    }
  }, [existingEntry, date, entries, userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const entry: DailyEntry = {
      date: format(date, 'yyyy-MM-dd'),
      mood: formData.mood as 1 | 2 | 3 | 4 | 5,
      energy: formData.energy as 1 | 2 | 3 | 4 | 5,
      calories: formData.calories,
      steps: formData.steps,
      weight: formData.weight
    };

    onSave(entry);
    onClose();
  };

  if (!isOpen || !date) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Daily Entry
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mb-6">{format(date, 'MMMM d, yyyy')}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="mood" className="block text-sm font-semibold text-gray-700 mb-3">
                Mood (1-5)
              </label>
              <input
                id="mood"
                type="range"
                min="1"
                max="5"
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                step="1"
                aria-describedby="mood-help"
              />
              <div className="flex justify-between text-lg mt-2 px-1" role="img" aria-label="Mood scale from sad to excited">
                <span>😢</span>
                <span>😐</span>
                <span>😊</span>
                <span>😄</span>
                <span>🤩</span>
              </div>
              <div className="text-center mt-2 text-sm font-medium text-primary-600">
                Current: {formData.mood}
              </div>
              <p id="mood-help" className="text-xs text-gray-500 mt-1">Rate your overall mood today</p>
            </div>

            <div>
              <label htmlFor="energy" className="block text-sm font-semibold text-gray-700 mb-3">
                Energy (1-5)
              </label>
              <input
                id="energy"
                type="range"
                min="1"
                max="5"
                value={formData.energy}
                onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                step="1"
                aria-describedby="energy-help"
              />
              <div className="flex justify-between text-lg mt-2 px-1" role="img" aria-label="Energy scale from low to high">
                <span>🔋</span>
                <span>🔋</span>
                <span>🔋</span>
                <span>🔋</span>
                <span>⚡</span>
              </div>
              <div className="text-center mt-2 text-sm font-medium text-primary-600">
                Current: {formData.energy}
              </div>
              <p id="energy-help" className="text-xs text-gray-500 mt-1">Rate your energy level today</p>
            </div>

            <div>
              <label htmlFor="calories" className="block text-sm font-semibold text-gray-700 mb-2">
                Calories
              </label>
              <input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                min="0"
                placeholder="Enter calories consumed"
                aria-describedby="calories-help"
              />
              <p id="calories-help" className="text-xs text-gray-500 mt-1">Daily calorie intake</p>
            </div>

            <div>
              <label htmlFor="steps" className="block text-sm font-semibold text-gray-700 mb-2">
                Steps
              </label>
              <input
                id="steps"
                type="number"
                value={formData.steps}
                onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                min="0"
                placeholder="Enter steps taken"
                aria-describedby="steps-help"
              />
              <p id="steps-help" className="text-xs text-gray-500 mt-1">Daily step count</p>
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
                min="0"
                placeholder="Enter current weight"
                aria-describedby="weight-help"
              />
              <p id="weight-help" className="text-xs text-gray-500 mt-1">Current body weight in kilograms</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg cursor-pointer"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}