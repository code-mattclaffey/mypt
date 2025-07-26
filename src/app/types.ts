export interface UserProfile {
  height: number; // in cm
  sex: 'male' | 'female';
  weight: number; // in kg
  activityLevel: 1 | 2 | 3 | 4 | 5;
  goalWeight: number; // in kg
  targetDate: string; // YYYY-MM-DD format
  targetCalories?: number;
  targetSteps?: number;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD format
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  calories: number;
  steps: number;
  weight: number;
}

export interface WeeklySummary {
  week: string; // YYYY-MM-DD of Monday
  summary: string;
  recommendedSteps: number;
  recommendedCalories: number;
}