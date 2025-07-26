import { UserProfile, DailyEntry } from '../types';

export const useHealthCalculations = (userProfile: UserProfile | null, entries: Record<string, DailyEntry>) => {
  const getLatestWeight = () => {
    const sortedEntries = Object.entries(entries)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
    return sortedEntries.length > 0 ? sortedEntries[0][1].weight : userProfile?.weight || 0;
  };

  const getGoalProgress = () => {
    if (!userProfile) return { progress: 0, remaining: 0 };
    
    const currentWeight = getLatestWeight();
    const startWeight = userProfile.weight;
    const goalWeight = userProfile.goalWeight;
    
    const totalWeightToLose = Math.abs(startWeight - goalWeight);
    const weightLost = Math.abs(startWeight - currentWeight);
    
    const progress = totalWeightToLose > 0 ? Math.min((weightLost / totalWeightToLose) * 100, 100) : 0;
    const remaining = Math.abs(currentWeight - goalWeight);
    
    return { progress, remaining };
  };

  const getDailyTargets = () => {
    if (!userProfile || !userProfile.targetCalories || !userProfile.targetSteps) {
      return { calories: 2000, steps: 8000 };
    }
    
    return { calories: userProfile.targetCalories, steps: userProfile.targetSteps };
  };

  return {
    getLatestWeight,
    getGoalProgress,
    getDailyTargets
  };
};