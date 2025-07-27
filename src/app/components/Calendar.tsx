'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { DailyEntry, UserProfile } from '../types';

interface MobileCalendarProps {
  entries: Record<string, DailyEntry>;
  onDateSelect: (date: Date) => void;
  userProfile?: UserProfile;
}

function MobileCalendar({ entries, onDateSelect, userProfile }: MobileCalendarProps) {
  const [showPastEntries, setShowPastEntries] = useState(false);
  const today = new Date();
  const todayKey = format(today, 'yyyy-MM-dd');
  const hasEntryToday = entries[todayKey] !== undefined;

  const pastEntries = Object.entries(entries)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 10); // Show last 10 entries

  const getDayStatus = (date: Date) => {
    if (!userProfile || !entries[format(date, 'yyyy-MM-dd')]) return 'none';
    const dateKey = format(date, 'yyyy-MM-dd');
    const entry = entries[dateKey];
    
    const targets = {
      calories: userProfile.targetCalories || 2000,
      steps: userProfile.targetSteps || 8000
    };
    const caloriesDiff = entry.calories - targets.calories;
    const stepsDiff = targets.steps - entry.steps;
    
    if (caloriesDiff >= 500 || stepsDiff >= 5000) return 'red';
    if (caloriesDiff >= 200 || stepsDiff >= 2000) return 'orange';
    return 'green';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  if (showPastEntries) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Past Entries</h2>
            <button
              onClick={() => setShowPastEntries(false)}
              className="text-blue-600 font-medium"
            >
              Back to Today
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {pastEntries.length > 0 ? (
            pastEntries.map(([dateKey, entry]) => {
              const date = new Date(dateKey);
              const status = getDayStatus(date);
              return (
                <button
                  key={dateKey}
                  onClick={() => onDateSelect(date)}
                  className="w-full p-4 border-b border-gray-50 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(date, 'EEEE, MMM d')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {entry.calories} cal • {entry.steps.toLocaleString()} steps • {entry.weight}kg
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              No entries yet. Start tracking your health!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {format(today, 'EEEE, MMMM d')}
        </h2>
        
        <div className="space-y-4">
          {hasEntryToday ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(getDayStatus(today))}`}></div>
                <span className="font-medium text-green-800">Entry Completed</span>
              </div>
              <div className="text-sm text-green-700">
                {entries[todayKey].calories} cal • {entries[todayKey].steps.toLocaleString()} steps • {entries[todayKey].weight}kg
              </div>
              <button
                onClick={() => onDateSelect(today)}
                className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Edit Today's Entry
              </button>
            </div>
          ) : (
            <button
              onClick={() => onDateSelect(today)}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Add Today's Entry
            </button>
          )}
          
          <button
            onClick={() => setShowPastEntries(true)}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            View Past Entries ({pastEntries.length})
          </button>
        </div>
      </div>
    </div>
  );
}

interface CalendarProps {
  entries: Record<string, DailyEntry>;
  onDateSelect: (date: Date) => void;
  targetDate?: string;
  userProfile?: UserProfile;
}

export default function Calendar({ entries, onDateSelect, targetDate, userProfile }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  
  useState(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });
  
  // Show mobile version on small screens
  if (isMobile) {
    return <MobileCalendar entries={entries} onDateSelect={onDateSelect} userProfile={userProfile} />;
  }
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasEntry = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return entries[dateKey] !== undefined;
  };

  const isTargetDate = (date: Date) => {
    if (!targetDate) return false;
    const dateKey = format(date, 'yyyy-MM-dd');
    return dateKey === targetDate;
  };

  const getDayStatus = (date: Date) => {
    if (!userProfile || !hasEntry(date)) return 'none';
    const dateKey = format(date, 'yyyy-MM-dd');
    const entry = entries[dateKey];
    
    const targets = getDailyTargets(userProfile);
    const caloriesDiff = entry.calories - targets.calories;
    const stepsDiff = targets.steps - entry.steps;
    
    // Red: 500+ calories over OR 5000+ steps under
    if (caloriesDiff >= 500 || stepsDiff >= 5000) {
      return 'red';
    }
    
    // Orange: 200+ calories over OR 2000+ steps under
    if (caloriesDiff >= 200 || stepsDiff >= 2000) {
      return 'orange';
    }
    
    // Green: everything else
    return 'green';
  };

  const getDailyTargets = (userProfile: UserProfile) => {
    if (!userProfile || !userProfile.targetCalories || !userProfile.targetSteps) {
      return { calories: 2000, steps: 8000 };
    }
    
    return { calories: userProfile.targetCalories, steps: userProfile.targetSteps };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-primary-600 cursor-pointer"
            onClick={() => navigateMonth('prev')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button 
            className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-primary-600 cursor-pointer"
            onClick={() => navigateMonth('next')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-500 text-sm py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map(day => {
            const entry = entries[format(day, 'yyyy-MM-dd')];
            const dayStatus = getDayStatus(day);
            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={`
                  h-20 sm:h-32 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 relative p-1 sm:p-2 flex flex-col cursor-pointer
                  ${!isSameMonth(day, currentDate) 
                    ? 'text-gray-300 hover:text-gray-400' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${isToday(day) && !hasEntry(day)
                    ? 'border-2 border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100' 
                    : ''
                  }
                  ${dayStatus === 'green' && !isTargetDate(day)
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm' 
                    : ''
                  }
                  ${dayStatus === 'orange' && !isTargetDate(day)
                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm' 
                    : ''
                  }
                  ${dayStatus === 'red' && !isTargetDate(day)
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm' 
                    : ''
                  }
                  ${isTargetDate(day) && !isToday(day)
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm ring-2 ring-yellow-200' 
                    : ''
                  }
                `}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-bold">{format(day, 'd')}</span>
                  <div className="flex gap-1">
                    {dayStatus === 'green' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {dayStatus === 'orange' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {dayStatus === 'red' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isTargetDate(day) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                {entry && (
                  <div className="text-xs mt-1 space-y-0.5 text-left hidden sm:block">
                    <div>😊 {entry.mood}/5 ⚡ {entry.energy}/5</div>
                    <div>{entry.calories} cal</div>
                    <div>{entry.steps.toLocaleString()} steps</div>
                    <div>{entry.weight}kg</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}