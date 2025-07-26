import { useState, useEffect } from 'react';
import { UserProfile, DailyEntry } from '../types';

export const useHealthData = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});

  useEffect(() => {
    const savedProfile = localStorage.getItem('healthAssistant_profile');
    const savedEntries = localStorage.getItem('healthAssistant_entries');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const savedEntries = localStorage.getItem('healthAssistant_entries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('healthAssistant_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (Object.keys(entries).length > 0) {
      localStorage.setItem('healthAssistant_entries', JSON.stringify(entries));
    }
  }, [entries]);

  return {
    userProfile,
    setUserProfile,
    entries,
    setEntries
  };
};