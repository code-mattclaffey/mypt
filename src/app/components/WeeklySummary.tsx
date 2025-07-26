'use client';

import { useState } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { DailyEntry, WeeklySummary as WeeklySummaryType } from '../types';

interface WeeklySummaryProps {
  entries: Record<string, DailyEntry>;
  weekStart: Date;
  onGetSummary: (weekStart: Date) => Promise<WeeklySummaryType>;
}

export default function WeeklySummary({ entries, weekStart, onGetSummary }: WeeklySummaryProps) {
  const [summary, setSummary] = useState<WeeklySummaryType | null>(null);
  const [loading, setLoading] = useState(false);

  const weekEnd = endOfWeek(weekStart);
  const weekKey = format(weekStart, 'yyyy-MM-dd');

  // Check if we have entries for all 7 days of the week
  const hasCompleteWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!entries[dateKey]) return false;
      days.push(entries[dateKey]);
    }
    return true;
  };

  const handleGetSummary = async () => {
    setLoading(true);
    try {
      const weekSummary = await onGetSummary(weekStart);
      setSummary(weekSummary);
    } catch (error) {
      console.error('Failed to get summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasCompleteWeek()) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mt-6 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h2>
        
        {!summary ? (
          <div>
            <button 
              onClick={handleGetSummary}
              disabled={loading}
              className={`
                px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg 
                hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg
                ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'}
              `}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Summary...
                </div>
              ) : (
                'Get Weekly Summary'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">AI Summary</h3>
                  <p className="text-blue-800 leading-relaxed">{summary.summary}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold opacity-90">Recommended Steps</h4>
                </div>
                <div className="text-3xl font-bold">{summary.recommendedSteps.toLocaleString()}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold opacity-90">Recommended Calories</h4>
                </div>
                <div className="text-3xl font-bold">{summary.recommendedCalories.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}