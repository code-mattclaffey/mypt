interface GoalProgressCardProps {
  progress: number;
  remaining: number;
  currentWeight: number;
  goalWeight: number;
  dailyTargets: { calories: number; steps: number };
  onDailyEntry?: () => void;
}

export default function GoalProgressCard({ 
  progress, 
  remaining, 
  currentWeight, 
  goalWeight, 
  dailyTargets,
  onDailyEntry
}: GoalProgressCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-100 mb-1">Goal Progress</h3>
          <p className="text-slate-300 text-sm mb-2">
            Current: {currentWeight}kg → Goal: {goalWeight}kg
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-slate-200">
                {progress.toFixed(1)}% complete
              </div>
              <div className="text-xs text-slate-400">
                ({remaining.toFixed(1)}kg remaining)
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Daily targets: {dailyTargets.calories} cal • {dailyTargets.steps.toLocaleString()} steps
            </div>
          </div>
        </div>
      </div>
      {onDailyEntry && (
        <button
          onClick={onDailyEntry}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
        >
          Daily Entry
        </button>
      )}
    </div>
  );
}